import express from "express";
import { findGhostFollowers, findFollowing, findFans, findUnfollowers, orderedFollowers } from "./methods";

const app = express();
const port = 3000;

app.get("/", (req, res) => {
	res.send("Web server is running!");
});

app.get("/ghost_followers", async (req, res) => {
	const { data, error } = await findGhostFollowers();
	res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
	res.setHeader("Access-Control-Allow-Credentials", "true");
	res.setHeader("Content-Type", "application/json");

	if (error) res.status(error.status).send(error.message);
	else res.end(JSON.stringify(data));
});

app.get("/fans", async (req, res) => {
	const { data, error } = await findFans();
	res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
	res.setHeader("Access-Control-Allow-Credentials", "true");
	res.setHeader("Content-Type", "application/json");

	if (error) res.status(error.status).send(error.message);
	else res.end(JSON.stringify(data));
});

app.get("/unfollowers", async (req, res) => {
	const { data, error } = await findUnfollowers();
	res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
	res.setHeader("Access-Control-Allow-Credentials", "true");
	res.setHeader("Content-Type", "application/json");

	if (error) res.status(error.status).send(error.message);
	else res.end(JSON.stringify(data));
});

app.get("/ordered_followers", async (req, res) => {
	const { data, error } = await orderedFollowers();
	res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
	res.setHeader("Access-Control-Allow-Credentials", "true");
	res.setHeader("Content-Type", "application/json");

	if (error) res.status(error.status).send(error.message);
	else res.end(JSON.stringify(data));
});

app.get("/following", async (req, res) => {
	const { data, error } = await findFollowing();
	res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
	res.setHeader("Access-Control-Allow-Credentials", "true");
	res.setHeader("Content-Type", "application/json");

	if (error) res.status(error.status).send(error.message);
	else res.end(JSON.stringify(data));
});

app.listen(port, () => {
	console.log(`Web server listening at http://localhost:${port}`);
});
