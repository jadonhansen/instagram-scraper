import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";
import { QueryResponse } from "./types";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isDebug = true;

export function queryTextFile(filePath: string): Promise<QueryResponse<string[]>> {
	const arr: string[] = [];

	const prom: Promise<QueryResponse<string[]>> = new Promise((resolve, reject) => {
		fs.createReadStream(path.join(__dirname, filePath), { encoding: "utf-8" })
			.on("error", function (error) {
				console.error(`\nError reading from file path: ${filePath}.\nError: ${error.message}\n`);
				reject({
					data: undefined,
					error: {
						status: 500,
						message: "There was a problem fetching your data!",
					},
				});
			})
			.on("data", (chunk) => {
				if (chunk) arr.push(chunk.toString());
			})
			.on("end", () => {
				if (isDebug) console.log(`\nCompleted reading from file path: ${filePath}\n`);
				resolve({ data: arr, error: undefined });
			});
	});

	return prom;
}
