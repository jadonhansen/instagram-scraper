import path from "path";
import * as fs from "fs-extra";

// The stats methods split on "\n", so a trailing newline would add an empty username.
export function formatUserList(usernames: string[]): string {
	return usernames.join("\n");
}

// Writes to a temp file and renames it, so the stats routes never read a half-written list.
export async function writeUserList(userFolderPath: string, fileName: string, usernames: string[]): Promise<void> {
	await fs.ensureDir(userFolderPath);

	const target = path.join(userFolderPath, fileName);
	const temp = `${target}.tmp`;

	await fs.writeFile(temp, formatUserList(usernames), "utf-8");
	await fs.rename(temp, target);
}

// The ghosts, fans and ordered followers routes 404 without postLikes.txt, so a fresh account gets an empty one.
export async function ensureFileExists(userFolderPath: string, fileName: string): Promise<void> {
	await fs.ensureDir(userFolderPath);
	await fs.ensureFile(path.join(userFolderPath, fileName));
}
