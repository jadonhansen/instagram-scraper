import fs from "fs";
import { Error, QueryResponse } from "./types";

const isDebug = true;

export function getDataFromFile(filePath: string): Promise<QueryResponse<string[]>> {
	return queryTextFile(filePath)
		.then((data) => {
			return { data, error: undefined };
		})
		.catch((error: Error) => {
			return { data: undefined, error };
		});
}

export function queryTextFile(filePath: string): Promise<string[]> {
	const arr: string[] = [];

	return new Promise((resolve, reject) => {
		fs.createReadStream(filePath, { encoding: "utf-8" })
			.on("error", function (error) {
				console.error(`\nError reading from file path: ${filePath}.\nError: ${error.message}\n`);
				reject({
					status: 500,
					message: "There was a problem fetching your data!",
				});
			})
			.on("data", (chunk) => {
				if (chunk) {
					arr.push(chunk.toString());
					if (isDebug) console.log(chunk);
				}
			})
			.on("end", () => {
				if (isDebug) console.log(`\nCompleted reading from file path: ${filePath}\n`);
				resolve(arr);
			});
	});
}
