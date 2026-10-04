import { ScrapeError } from "./errors";
import { InstagramClient, ListKind } from "./instagramClient";

// Stops a run whose cursor never ends. 2000 pages of 50 is far above any personal account.
const maxPages = 2000;

export async function collectList(
	client: InstagramClient,
	kind: ListKind,
	userId: string,
	onProgress?: (fetched: number) => void,
): Promise<string[]> {
	const seen = new Set<string>();
	const seenCursors = new Set<string>();
	let maxId: string | undefined;

	for (let page = 0; page < maxPages; page++) {
		const result = await client.getListPage(kind, userId, maxId);

		for (const username of result.usernames) seen.add(username);
		onProgress?.(seen.size);

		if (!result.nextMaxId) return [...seen];
		if (seenCursors.has(result.nextMaxId)) {
			throw new ScrapeError("UNEXPECTED_RESPONSE", `The ${kind} cursor repeated, so the list would never end.`);
		}

		seenCursors.add(result.nextMaxId);
		maxId = result.nextMaxId;
	}

	throw new ScrapeError("UNEXPECTED_RESPONSE", `The ${kind} list ran past ${maxPages} pages.`);
}
