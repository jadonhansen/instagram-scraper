import path from "path";

import { instagramUsersFolderPath, followersTxt, followingTxt, postLikesTxt } from "../db";
import { assertValidUsername, ScrapeError } from "./errors";
import { InstagramClient, ListKind } from "./instagramClient";
import { collectList } from "./collectors";
import { createPageFetcher, ensureLoggedIn, getViewerId, importSessionCookie, openSession } from "./session";
import { ensureFileExists, writeUserList } from "./writer";

export type ScrapePhase = "starting" | "waiting_for_login" | "profile" | ListKind;

export interface ScrapeProgress {
	phase: ScrapePhase;
	fetched: number;
	total: number;
	message?: string;
}

export interface ScrapeOptions {
	username: string;
	lists: ListKind[];
	// value of the instagram.com "sessionid" cookie from another browser; saved into the scraper profile
	sessionId?: string;
	headless?: boolean;
	loginTimeoutMs?: number;
	// aborting closes the browser and rejects with CANCELLED; nothing is written
	signal?: AbortSignal;
	onProgress?(progress: ScrapeProgress): void;
}

export interface ScrapeSummary {
	username: string;
	followers?: number;
	following?: number;
}

const listFiles: Record<ListKind, string> = { followers: followersTxt, following: followingTxt };

export async function scrapeAccount(options: ScrapeOptions): Promise<ScrapeSummary> {
	const { username, lists, headless = false, loginTimeoutMs = 10 * 60_000 } = options;
	const report = (progress: ScrapeProgress) => options.onProgress?.(progress);

	assertValidUsername(username);
	report({ phase: "starting", fetched: 0, total: 0 });

	const { signal } = options;
	if (signal?.aborted) throw cancelledError();

	const session = await openSession(headless);
	const closeOnAbort = () => void session.context.close().catch(() => undefined);
	signal?.addEventListener("abort", closeOnAbort, { once: true });

	try {
		if (options.sessionId) await importSessionCookie(session.context, options.sessionId);

		await ensureLoggedIn(session, {
			headless,
			timeoutMs: loginTimeoutMs,
			onWaitingForLogin: () => report({ phase: "waiting_for_login", fetched: 0, total: 0 }),
		});

		let currentPhase: ScrapePhase = "profile";
		let fetched = 0;
		let total = 0;

		const client = new InstagramClient(createPageFetcher(session.page), {
			sleep: (ms) => abortableSleep(ms, signal),
			onRateLimited: ({ endpoint, status, body, waitMs }) => {
				console.warn(
					`\nInstagram rate-limited ${endpoint} (HTTP ${status}) during ${currentPhase} at ${fetched}/${total}. ` +
						`Waiting ${waitMs / 1000}s. Response: ${body.slice(0, 300)}`,
				);
				report({
					phase: currentPhase,
					fetched,
					total,
					message: `Instagram rate-limited ${endpoint} (HTTP ${status}). Paused ${waitMs / 1000}s.`,
				});
			},
		});

		report({ phase: "profile", fetched: 0, total: 0 });
		const viewerId = await getViewerId(session.context);
		const viewer = viewerId ? await client.getUserInfo(viewerId) : undefined;
		const profile =
			viewer?.username.toLowerCase() === username.toLowerCase() ? viewer : await client.getProfile(username);

		if (profile.isPrivate && !profile.followedByViewer && profile.id !== viewerId) {
			throw new ScrapeError("LIST_NOT_VISIBLE", `"${username}" is private and your account does not follow it.`);
		}

		const collected: Partial<Record<ListKind, string[]>> = {};

		for (const kind of lists) {
			currentPhase = kind;
			fetched = 0;
			total = kind === "followers" ? profile.followerCount : profile.followingCount;
			report({ phase: kind, fetched, total });

			collected[kind] = await collectList(client, kind, profile.id, (count) => {
				fetched = count;
				report({ phase: kind, fetched, total });
			});
		}

		// written only once every list is in, so a failed or stopped run leaves the old files untouched
		const userFolderPath = path.join(instagramUsersFolderPath, username);
		const summary: ScrapeSummary = { username };
		for (const kind of lists) {
			const usernames = collected[kind] ?? [];
			await writeUserList(userFolderPath, listFiles[kind], usernames);
			summary[kind] = usernames.length;
		}

		await ensureFileExists(userFolderPath, postLikesTxt);
		return summary;
	} catch (error) {
		if (signal?.aborted) throw cancelledError();
		throw error;
	} finally {
		signal?.removeEventListener("abort", closeOnAbort);
		await session.context.close().catch(() => undefined);
	}
}

function cancelledError(): ScrapeError {
	return new ScrapeError("CANCELLED", "The scrape was stopped. No files were changed.");
}

function abortableSleep(ms: number, signal: AbortSignal | undefined): Promise<void> {
	return new Promise((resolve, reject) => {
		if (signal?.aborted) return reject(cancelledError());

		const onAbort = () => {
			clearTimeout(timer);
			reject(cancelledError());
		};
		const timer = setTimeout(() => {
			signal?.removeEventListener("abort", onAbort);
			resolve();
		}, ms);
		signal?.addEventListener("abort", onAbort, { once: true });
	});
}
