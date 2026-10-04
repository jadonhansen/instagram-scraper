import { ScrapeError } from "./errors";

export interface FetchResult {
	status: number;
	body: string;
}

// Performs a GET against instagram.com from inside the logged-in page, so cookies and CSRF come from the real session.
export type PageFetcher = (path: string) => Promise<FetchResult>;

export interface RateLimitInfo {
	endpoint: string;
	status: number;
	body: string;
	waitMs: number;
}

export interface ClientOptions {
	minDelayMs: number;
	maxDelayMs: number;
	rateLimitBackoffMs: number[];
	sleep(ms: number): Promise<void>;
	random(): number;
	onRateLimited?(info: RateLimitInfo): void;
}

export const defaultClientOptions: ClientOptions = {
	minDelayMs: 2000,
	maxDelayMs: 5000,
	rateLimitBackoffMs: [60_000, 120_000, 300_000, 600_000],
	sleep: (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
	random: Math.random,
};

export interface Profile {
	id: string;
	username: string;
	isPrivate: boolean;
	followedByViewer: boolean;
	followerCount: number;
	followingCount: number;
}

export type ListKind = "followers" | "following";

export interface ListPage {
	usernames: string[];
	nextMaxId: string | undefined;
}

export class InstagramClient {
	private readonly fetcher: PageFetcher;
	private readonly options: ClientOptions;
	private requestCount = 0;

	constructor(fetcher: PageFetcher, options: Partial<ClientOptions> = {}) {
		this.fetcher = fetcher;
		this.options = { ...defaultClientOptions, ...options };
	}

	async getProfile(username: string): Promise<Profile> {
		const json = await this.getJson(`/api/v1/users/web_profile_info/?username=${encodeURIComponent(username)}`, {
			notFoundMessage: `Instagram user "${username}" does not exist.`,
		});

		const user = json?.data?.user;
		if (!user || typeof user.id !== "string") {
			throw new ScrapeError("UNEXPECTED_RESPONSE", `Profile response for "${username}" had no user id.`);
		}

		return {
			id: user.id,
			username: user.username ?? username,
			isPrivate: Boolean(user.is_private),
			followedByViewer: Boolean(user.followed_by_viewer),
			followerCount: user.edge_followed_by?.count ?? 0,
			followingCount: user.edge_follow?.count ?? 0,
		};
	}

	// Profile by numeric id. Used for the logged-in account, which avoids web_profile_info and its tight rate limit.
	async getUserInfo(userId: string): Promise<Profile> {
		const json = await this.getJson(`/api/v1/users/${encodeURIComponent(userId)}/info/`, {
			notFoundMessage: `Instagram user id ${userId} does not exist.`,
		});

		const user = json?.user;
		if (!user || typeof user.username !== "string") {
			throw new ScrapeError("UNEXPECTED_RESPONSE", `User info response for id ${userId} had no username.`);
		}

		return {
			id: String(user.pk ?? user.pk_id ?? userId),
			username: user.username,
			isPrivate: Boolean(user.is_private),
			followedByViewer: false,
			followerCount: user.follower_count ?? 0,
			followingCount: user.following_count ?? 0,
		};
	}

	async getListPage(kind: ListKind, userId: string, maxId: string | undefined): Promise<ListPage> {
		const params = new URLSearchParams({ count: "50" });
		if (maxId) params.set("max_id", maxId);
		if (kind === "followers") params.set("search_surface", "follow_list_page");

		const json = await this.getJson(`/api/v1/friendships/${userId}/${kind}/?${params.toString()}`, {
			notFoundMessage: `Could not load ${kind} for user id ${userId}.`,
		});

		if (!Array.isArray(json?.users)) {
			throw new ScrapeError("UNEXPECTED_RESPONSE", `The ${kind} response had no users array.`);
		}

		const usernames: string[] = json.users
			.map((user: { username?: unknown }) => user.username)
			.filter((name: unknown): name is string => typeof name === "string" && name.length > 0);

		const next = json.next_max_id;
		return { usernames, nextMaxId: next === undefined || next === null || next === "" ? undefined : String(next) };
	}

	private async getJson(path: string, { notFoundMessage }: { notFoundMessage: string }) {
		for (let attempt = 0; ; attempt++) {
			await this.pace();

			const res = await this.fetcher(path);
			const json = parseJson(res.body);

			if (isRateLimited(res, json)) {
				const endpoint = path.split("?")[0];
				const backoff = this.options.rateLimitBackoffMs[attempt];
				if (backoff === undefined) {
					throw new ScrapeError(
						"RATE_LIMITED",
						`Instagram kept rate-limiting ${endpoint}. Wait at least an hour before scraping again.`,
					);
				}
				this.options.onRateLimited?.({ endpoint, status: res.status, body: res.body, waitMs: backoff });
				await this.options.sleep(backoff);
				continue;
			}

			if (isLoginRequired(res, json)) {
				throw new ScrapeError(
					"LOGIN_REQUIRED",
					"Instagram asked to log in again. Log in in the scraper browser window and retry.",
				);
			}

			if (res.status === 404) throw new ScrapeError("USER_NOT_FOUND", notFoundMessage);

			if (res.status !== 200 || json === undefined) {
				throw new ScrapeError("UNEXPECTED_RESPONSE", `Instagram returned HTTP ${res.status} for ${path}.`);
			}

			return json;
		}
	}

	// Random delay between requests, skipped before the first one.
	private async pace() {
		if (this.requestCount++ === 0) return;
		const { minDelayMs, maxDelayMs, random, sleep } = this.options;
		await sleep(minDelayMs + Math.floor(random() * (maxDelayMs - minDelayMs)));
	}
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseJson(body: string): any {
	try {
		return JSON.parse(body);
	} catch {
		return undefined;
	}
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isRateLimited(res: FetchResult, json: any): boolean {
	if (res.status === 429) return true;
	return typeof json?.message === "string" && /wait a few minutes/i.test(json.message);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isLoginRequired(res: FetchResult, json: any): boolean {
	if (res.status === 401 || res.status === 403) return true;
	if (json?.require_login === true) return true;
	if (json?.message === "login_required" || json?.message === "checkpoint_required") return true;
	// a non-JSON 200 is the HTML login page served in place of the API response
	return res.status === 200 && json === undefined;
}
