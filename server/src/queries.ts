import fs from "fs";
import { Error } from "./interfaces";

const isDebug = true;

export function getDataFromFile(filePath: string): Promise<string[] | Error> {
	const arr: string[] = [];

	return new Promise((resolve, reject) => {
		fs.createReadStream(filePath, "utf8")
			.on("error", function (error) {
				console.error(`\nError reading from file path: ${filePath}.\nError: ${error.message}\n`);
				reject({
					status: 500,
					message: "There was a problem fetching your data!",
				});
			})
			.on("data", (chunk) => {
				arr.push(chunk.toString());
				if (isDebug) console.log(chunk);
			})
			.on("end", () => {
				if (isDebug) console.log(`\nCompleted reading from file path: ${filePath}\n`);
				resolve(arr);
			});
	});
}
