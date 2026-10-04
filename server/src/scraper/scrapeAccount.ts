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

	const session = await openSession(headless);

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
			onWait: (reason, ms) =>
				report({ phase: currentPhase, fetched, total, message: `Paused ${ms / 1000}s (${reason})` }),
		});

		report({ phase: "profile", fetched: 0, total: 0 });
		const viewerId = await getViewerId(session.context);
		const viewer = viewerId ? await client.getUserInfo(viewerId) : undefined;
		const profile =
			viewer?.username.toLowerCase() === username.toLowerCase() ? viewer : await client.getProfile(username);

		if (profile.isPrivate && !profile.followedByViewer && profile.id !== viewerId) {
			throw new ScrapeError("LIST_NOT_VISIBLE", `"${username}" is private and your account does not follow it.`);
		}

		const userFolderPath = path.join(instagramUsersFolderPath, username);
		const summary: ScrapeSummary = { username };

		for (const kind of lists) {
			currentPhase = kind;
			fetched = 0;
			total = kind === "followers" ? profile.followerCount : profile.followingCount;
			report({ phase: kind, fetched, total });

			const usernames = await collectList(client, kind, profile.id, (count) => {
				fetched = count;
				report({ phase: kind, fetched, total });
			});

			await writeUserList(userFolderPath, listFiles[kind], usernames);
			summary[kind] = usernames.length;
		}

		await ensureFileExists(userFolderPath, postLikesTxt);
		return summary;
	} finally {
		await session.context.close().catch(() => undefined);
	}
}
