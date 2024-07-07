import express from "express";
import { findGhostFollowers, findFollowing, findFans, findUnfollowers, orderedFollowers } from "./methods";

const app = express();
const port = 3000;

app.get("/", (req, res) => {
	res.send("Web server is running!");
});

app.get("/ghost_followers", async (req, res) => {
	const { data, error } = await findGhostFollowers();

	if (error) res.status(error.status).send(error.message);
	else res.send(data);
});

app.get("/fans", async (req, res) => {
	const { data, error } = await findFans();

	if (error) res.status(error.status).send(error.message);
	else res.send(data);
});

app.get("/unfollowers", async (req, res) => {
	const { data, error } = await findUnfollowers();

	if (error) res.status(error.status).send(error.message);
	else res.send(data);
});

app.get("/ordered_followers", async (req, res) => {
	const { data, error } = await orderedFollowers();

	if (error) res.status(error.status).send(error.message);
	else res.send(data);
});

app.get("/following", async (req, res) => {
	const { data, error } = await findFollowing();

	if (error) res.status(error.status).send(error.message);
	else res.send(data);
});

app.listen(port, () => {
	console.log(`Web server listening at http://localhost:${port}`);
});
