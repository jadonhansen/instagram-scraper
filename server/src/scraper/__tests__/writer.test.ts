import os from "os";
import path from "path";
import * as fs from "fs-extra";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { ensureFileExists, writeUserList } from "../writer";

let folder: string;

beforeEach(async () => {
	folder = path.join(await fs.mkdtemp(path.join(os.tmpdir(), "ig-writer-")), "user1");
});

afterEach(async () => {
	await fs.remove(path.dirname(folder));
});

describe("writeUserList", () => {
	it("writes one username per line with no trailing newline", async () => {
		await writeUserList(folder, "followers.txt", ["user1", "user2"]);

		expect(await fs.readFile(path.join(folder, "followers.txt"), "utf-8")).toBe("user1\nuser2");
	});

	it("leaves no temp file behind", async () => {
		await writeUserList(folder, "followers.txt", ["user1"]);

		expect(await fs.readdir(folder)).toEqual(["followers.txt"]);
	});
});

describe("ensureFileExists", () => {
	it("keeps the contents of an existing file", async () => {
		await writeUserList(folder, "postLikes.txt", ["user1"]);

		await ensureFileExists(folder, "postLikes.txt");

		expect(await fs.readFile(path.join(folder, "postLikes.txt"), "utf-8")).toBe("user1");
	});
});
