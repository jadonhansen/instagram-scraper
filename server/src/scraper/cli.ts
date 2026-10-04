import { ListKind } from "./instagramClient";
import { ScrapeError } from "./errors";
import { scrapeAccount } from "./scrapeAccount";

const usage = "Usage: npm run scrape -- <username> [--only followers|following] [--headless]";

function parseArgs(argv: string[]): { username: string; lists: ListKind[]; headless: boolean } {
	const positional = argv.filter((arg, i) => !arg.startsWith("--") && argv[i - 1] !== "--only");
	const onlyIndex = argv.indexOf("--only");
	const only = onlyIndex >= 0 ? argv[onlyIndex + 1] : undefined;

	if (positional.length !== 1) throw new Error(usage);
	if (only !== undefined && only !== "followers" && only !== "following") throw new Error(usage);

	return {
		username: positional[0],
		lists: only ? [only] : ["followers", "following"],
		headless: argv.includes("--headless"),
	};
}

async function main() {
	const args = parseArgs(process.argv.slice(2));

	const summary = await scrapeAccount({
		...args,
		onProgress: ({ phase, fetched, total, message }) => {
			if (phase === "waiting_for_login") console.log("Log in to Instagram in the browser window to continue.");
			else if (message) console.log(message);
			else if (phase === "followers" || phase === "following") console.log(`${phase}: ${fetched} / ${total}`);
			else console.log(`${phase}...`);
		},
	});

	console.log(`Done. Wrote ${JSON.stringify(summary)} to db/${summary.username}/`);
}

main().catch((error) => {
	if (error instanceof ScrapeError) console.error(`Scrape failed (${error.code}): ${error.message}`);
	else console.error("Scrape failed:", error instanceof Error ? error.message : error);
	process.exit(1);
});
