import path from "path";
import { fileURLToPath } from "url";
import { chromium, BrowserContext, Page } from "playwright-core";

import { ScrapeError } from "./errors";
import { PageFetcher } from "./instagramClient";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Holds the Instagram session cookies. Gitignored; deleting it forces a fresh login.
export const sessionDir = path.join(__dirname, "../../.ig-session");

const instagramOrigin = "https://www.instagram.com";
// The public app id the Instagram web client sends with its own API calls.
const instagramWebAppId = "936619743392459";
const loginPollMs = 2000;

export interface Session {
	context: BrowserContext;
	page: Page;
}

export async function openSession(headless: boolean): Promise<Session> {
	// channel "chrome" drives the installed Google Chrome, so no Playwright browser download is needed
	const context = await chromium.launchPersistentContext(sessionDir, { channel: "chrome", headless, viewport: null });
	const page = context.pages()[0] ?? (await context.newPage());
	return { context, page };
}

async function getCookie(context: BrowserContext, name: string): Promise<string | undefined> {
	const cookies = await context.cookies(instagramOrigin);
	return cookies.find((cookie) => cookie.name === name)?.value;
}

export async function getViewerId(context: BrowserContext): Promise<string | undefined> {
	return getCookie(context, "ds_user_id");
}

interface LoginOptions {
	headless: boolean;
	timeoutMs: number;
	onWaitingForLogin?(): void;
}

// Leaves the page on instagram.com with a logged-in session, waiting for a manual login if needed.
export async function ensureLoggedIn({ context, page }: Session, options: LoginOptions): Promise<void> {
	await page.goto(instagramOrigin + "/", { waitUntil: "domcontentloaded" });
	if (await getCookie(context, "sessionid")) return;

	if (options.headless) {
		throw new ScrapeError("LOGIN_REQUIRED", "No saved Instagram session. Run once without --headless to log in.");
	}

	options.onWaitingForLogin?.();
	await page.goto(instagramOrigin + "/accounts/login/", { waitUntil: "domcontentloaded" });
	await page.bringToFront();

	const deadline = Date.now() + options.timeoutMs;
	while (!(await getCookie(context, "sessionid"))) {
		if (page.isClosed()) throw new ScrapeError("BROWSER_CLOSED", "The scraper browser window was closed.");
		if (Date.now() > deadline) {
			throw new ScrapeError("LOGIN_TIMEOUT", "Timed out waiting for you to log in to Instagram.");
		}
		await page.waitForTimeout(loginPollMs);
	}

	await page.goto(instagramOrigin + "/", { waitUntil: "domcontentloaded" });
}

export function createPageFetcher(page: Page): PageFetcher {
	return async (requestPath) => {
		if (page.isClosed()) throw new ScrapeError("BROWSER_CLOSED", "The scraper browser window was closed.");

		return page.evaluate(
			async ({ url, appId }) => {
				const csrf = document.cookie.match(/csrftoken=([^;]+)/)?.[1] ?? "";
				const res = await fetch(url, {
					credentials: "include",
					headers: { "X-IG-App-ID": appId, "X-Requested-With": "XMLHttpRequest", "X-CSRFToken": csrf },
				});
				return { status: res.status, body: await res.text() };
			},
			{ url: instagramOrigin + requestPath, appId: instagramWebAppId },
		);
	};
}
