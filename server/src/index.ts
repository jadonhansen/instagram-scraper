import express from "express";
import { findGhostFollowers, findFollowing, findFans, findUnfollowers, orderedFollowers } from "./methods";
import { Error } from "./types";

const app = express();
const port = 3000;

app.get("/", (req, res) => {
	res.send("Web server is running!");
});

app.get("/ghost_followers", async (req, res) => {
	const result: string[] | Error = await findGhostFollowers();

	if (Array.isArray(result)) res.send(result);
	else res.status(result.status).send(result.message);
});

app.get("/fans", async (req, res) => {
	const result: string[] | Error = await findFans();

	if (Array.isArray(result)) res.send(result);
	else res.status(result.status).send(result.message);
});

app.get("/unfollowers", async (req, res) => {
	const result: string[] | Error = await findUnfollowers();

	if (Array.isArray(result)) res.send(result);
	else res.status(result.status).send(result.message);
});

app.get("/ordered_followers", async (req, res) => {
	const result: string[] | Error = await orderedFollowers();

	if (Array.isArray(result)) res.send(result);
	else res.status(result.status).send(result.message);
});

app.get("/following", async (req, res) => {
	const result: string[] | Error = await findFollowing();

	if (Array.isArray(result)) res.send(result);
	else res.status(result.status).send(result.message);
});

app.listen(port, () => {
	console.log(`Web server listening at http://localhost:${port}`);
});
