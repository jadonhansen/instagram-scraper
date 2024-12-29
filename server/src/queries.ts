import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";
import { QueryResponse } from "./types";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isDebug = true;

function doesTextFileExist(filePath: string): QueryResponse<boolean> {
	const res = fs.existsSync(filePath);

	if (res) {
		return {
			data: true,
			error: undefined,
		};
	} else {
		return {
			data: undefined,
			error: {
				status: 404,
				message: `Could not find file: ${filePath}`,
			},
		};
	}
}

export function queryTextFile(filePath: string): Promise<QueryResponse<string>> {
	let contents: string = "";
	const textFilePath = path.join(__dirname, filePath);

	const { data, error } = doesTextFileExist(textFilePath);

	if (error) {
		if (isDebug) console.error(`queryTextFile error: ${error.message}`);

		return new Promise((resolve, reject) =>
			resolve({
				data: undefined,
				error: error,
			}),
		);
	}

	const prom: Promise<QueryResponse<string>> = new Promise((resolve, reject) => {
		fs.createReadStream(textFilePath, { encoding: "utf-8" })
			.on("error", function (error) {
				if (isDebug) console.error(`Error reading from file path: ${filePath}.\nError: ${error.message}`);

				// do not reject here as the server then crashes since we don't have an upper try-catch
				resolve({
					data: undefined,
					error: {
						status: 500,
						message: "There was a problem fetching your data!",
					},
				});
			})
			.on("data", (chunk) => {
				if (chunk) contents += chunk.toString();
			})
			.on("end", () => {
				if (isDebug) console.log(`\nCompleted reading from file path: ${filePath}`);
				resolve({ data: contents ? contents : "", error: undefined });
			});
	});

	return prom;
}

export function queryDirectoryFolders(filePath: string): QueryResponse<string[]> {
	const folderPath = path.join(__dirname, filePath);
	const list = fs.readdirSync(folderPath);

	if (list) {
		if (isDebug) console.log(`\nObtained folders from db path: ${folderPath}`);

		const temp: string[] = [];

		for (const item of list) {
			const name = `${folderPath}/${item}`;
			if (fs.statSync(name).isDirectory()) temp.push(item);
		}

		return { data: temp, error: undefined };
	}

	if (isDebug) console.log(`\nError obtaining folders from db path: ${folderPath}`);

	return {
		data: undefined,
		error: {
			status: 500,
			message: "There was a problem fetching your profiles!",
		},
	};
}
