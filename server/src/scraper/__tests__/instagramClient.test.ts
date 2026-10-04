import { describe, expect, it } from "vitest";

import { FetchResult, InstagramClient } from "../instagramClient";

function clientReturning(...responses: FetchResult[]) {
	const queue = [...responses];
	const waits: number[] = [];
	const client = new InstagramClient(async () => queue.shift() ?? { status: 500, body: "" }, {
		sleep: async (ms) => {
			waits.push(ms);
		},
		random: () => 0,
		rateLimitBackoffMs: [10, 20],
	});
	return { client, waits };
}

const json = (status: number, body: unknown): FetchResult => ({ status, body: JSON.stringify(body) });

describe("InstagramClient", () => {
	it("returns usernames and the next cursor from a list page", async () => {
		const { client } = clientReturning(
			json(200, { users: [{ username: "user1" }, { username: "user2" }], next_max_id: "50" }),
		);

		const page = await client.getListPage("followers", "123", undefined);

		expect(page).toEqual({ usernames: ["user1", "user2"], nextMaxId: "50" });
	});

	it("treats a missing next_max_id as the last page", async () => {
		const { client } = clientReturning(json(200, { users: [{ username: "user1" }] }));

		const page = await client.getListPage("following", "123", "50");

		expect(page.nextMaxId).toBeUndefined();
	});

	it("retries after a 429 once the backoff has passed", async () => {
		const { client } = clientReturning(json(429, {}), json(200, { users: [{ username: "user1" }] }));

		const page = await client.getListPage("followers", "123", undefined);

		expect(page.usernames).toEqual(["user1"]);
	});

	it("throws RATE_LIMITED when every backoff is used up", async () => {
		const { client } = clientReturning(
			json(429, {}),
			json(400, { message: "Please wait a few minutes before you try again." }),
			json(429, {}),
		);

		await expect(client.getListPage("followers", "123", undefined)).rejects.toMatchObject({ code: "RATE_LIMITED" });
	});

	it("throws LOGIN_REQUIRED when Instagram serves the HTML login page", async () => {
		const { client } = clientReturning({ status: 200, body: "<!DOCTYPE html><html></html>" });

		await expect(client.getListPage("followers", "123", undefined)).rejects.toMatchObject({
			code: "LOGIN_REQUIRED",
		});
	});

	it("throws USER_NOT_FOUND for a 404 profile", async () => {
		const { client } = clientReturning(json(404, {}));

		await expect(client.getProfile("user1")).rejects.toMatchObject({ code: "USER_NOT_FOUND" });
	});

	it("maps the profile response to follower and following counts", async () => {
		const { client } = clientReturning(
			json(200, {
				data: {
					user: {
						id: "123",
						username: "user1",
						is_private: true,
						followed_by_viewer: false,
						edge_followed_by: { count: 300 },
						edge_follow: { count: 110 },
					},
				},
			}),
		);

		const profile = await client.getProfile("user1");

		expect(profile).toEqual({
			id: "123",
			username: "user1",
			isPrivate: true,
			followedByViewer: false,
			followerCount: 300,
			followingCount: 110,
		});
	});

	it("maps the user info response for the logged-in account", async () => {
		const { client } = clientReturning(
			json(200, { user: { pk: 123, username: "user1", follower_count: 300, following_count: 110 } }),
		);

		const profile = await client.getUserInfo("123");

		expect(profile).toMatchObject({ id: "123", username: "user1", followerCount: 300, followingCount: 110 });
	});

	it("waits between requests but not before the first", async () => {
		const { client, waits } = clientReturning(json(200, { users: [] }), json(200, { users: [] }));

		await client.getListPage("followers", "123", undefined);
		await client.getListPage("followers", "123", undefined);

		expect(waits).toEqual([5000]);
	});
});
