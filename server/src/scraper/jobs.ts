import { randomUUID } from "crypto";

import { QueryResponse } from "../types";
import { assertValidSessionId, assertValidUsername, ScrapeError } from "./errors";
import { scrapeAccount, ScrapeOptions, ScrapeProgress, ScrapeSummary } from "./scrapeAccount";

export type ScrapeJobStatus = "running" | "done" | "error";

export interface ScrapeJob {
	id: string;
	username: string;
	status: ScrapeJobStatus;
	progress: ScrapeProgress;
	summary?: ScrapeSummary;
	error?: { code: string; message: string };
	startedAt: string;
	finishedAt?: string;
}

type Scraper = (options: ScrapeOptions) => Promise<ScrapeSummary>;

// Runs one scrape at a time, because every run shares the same browser profile.
export class ScrapeJobManager {
	private readonly jobs = new Map<string, ScrapeJob>();
	private readonly scraper: Scraper;

	constructor(scraper: Scraper = scrapeAccount) {
		this.scraper = scraper;
	}

	start(username: string, sessionId?: string): QueryResponse<ScrapeJob> {
		try {
			assertValidUsername(username);
			if (sessionId) assertValidSessionId(sessionId);
		} catch (error) {
			return { data: undefined, error: { status: 400, message: (error as Error).message } };
		}

		const running = [...this.jobs.values()].find((job) => job.status === "running");
		if (running) {
			return {
				data: undefined,
				error: { status: 409, message: `A scrape for "${running.username}" is already running.` },
			};
		}

		const job: ScrapeJob = {
			id: randomUUID(),
			username,
			status: "running",
			progress: { phase: "starting", fetched: 0, total: 0 },
			startedAt: new Date().toISOString(),
		};
		this.jobs.set(job.id, job);

		this.scraper({
			username,
			lists: ["followers", "following"],
			sessionId,
			onProgress: (progress) => (job.progress = progress),
		})
			.then((summary) => {
				job.status = "done";
				job.summary = summary;
			})
			.catch((error: unknown) => {
				console.error(`\nScrape job ${job.id} for ${username} failed:`, error);
				job.status = "error";
				job.error =
					error instanceof ScrapeError
						? { code: error.code, message: error.message }
						: { code: "UNEXPECTED", message: "The scraper crashed. Check the server log." };
			})
			.finally(() => (job.finishedAt = new Date().toISOString()));

		return { data: job, error: undefined };
	}

	get(id: string): QueryResponse<ScrapeJob> {
		const job = this.jobs.get(id);
		if (!job) return { data: undefined, error: { status: 404, message: `No scrape job with id ${id}.` } };
		return { data: job, error: undefined };
	}
}
