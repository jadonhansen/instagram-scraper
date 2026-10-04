import { describe, expect, it } from "vitest";

import { collectList } from "../collectors";
import { InstagramClient, ListPage } from "../instagramClient";

function clientWithPages(pages: Record<string, ListPage>) {
	return {
		getListPage: async (_kind: string, _userId: string, maxId: string | undefined) => pages[maxId ?? "start"],
	} as unknown as InstagramClient;
}

describe("collectList", () => {
	it("follows the cursor until it runs out and drops duplicates", async () => {
		const client = clientWithPages({
			start: { usernames: ["user1", "user2"], nextMaxId: "a" },
			a: { usernames: ["user2", "user3"], nextMaxId: "b" },
			b: { usernames: ["user4"], nextMaxId: undefined },
		});

		const usernames = await collectList(client, "followers", "123");

		expect(usernames).toEqual(["user1", "user2", "user3", "user4"]);
	});

	it("throws when the cursor repeats", async () => {
		const client = clientWithPages({
			start: { usernames: ["user1"], nextMaxId: "a" },
			a: { usernames: ["user2"], nextMaxId: "a" },
		});

		await expect(collectList(client, "following", "123")).rejects.toMatchObject({ code: "UNEXPECTED_RESPONSE" });
	});
});
