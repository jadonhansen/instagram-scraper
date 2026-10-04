import { describe, expect, it } from "vitest";

import { ScrapeError } from "../errors";
import { ScrapeJobManager } from "../jobs";
import { ScrapeSummary } from "../scrapeAccount";

const neverResolves = () => new Promise<ScrapeSummary>(() => {});
const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

describe("ScrapeJobManager", () => {
	it("rejects a username that could escape the db folder", () => {
		const manager = new ScrapeJobManager(neverResolves);

		expect(manager.start("../etc").error?.status).toBe(400);
	});

	it("rejects a session value that is not a sessionid cookie", () => {
		const manager = new ScrapeJobManager(neverResolves);

		expect(manager.start("user1", "not a cookie").error?.status).toBe(400);
	});

	it("refuses a second job while one is running", () => {
		const manager = new ScrapeJobManager(neverResolves);
		manager.start("user1");

		expect(manager.start("user2").error?.status).toBe(409);
	});

	it("marks the job done with the scraper's summary", async () => {
		const manager = new ScrapeJobManager(async () => ({ username: "user1", followers: 2, following: 1 }));
		const id = manager.start("user1").data!.id;

		await flush();

		expect(manager.get(id).data).toMatchObject({ status: "done", summary: { followers: 2, following: 1 } });
	});

	it("records the error code when the scraper fails", async () => {
		const manager = new ScrapeJobManager(async () => {
			throw new ScrapeError("LIST_NOT_VISIBLE", "private");
		});
		const id = manager.start("user1").data!.id;

		await flush();

		expect(manager.get(id).data?.error?.code).toBe("LIST_NOT_VISIBLE");
	});
});
