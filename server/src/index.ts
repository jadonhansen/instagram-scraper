import express from "express";
import {
	findGhostFollowers,
	findFollowing,
	findFans,
	findUnfollowers,
	orderedFollowers,
	getInstagramUsers,
	addInstagramUser,
} from "./methods";

const app = express();
const port = 3000;

// For parsing application/json
app.use(express.json());

app.get("/", (req, res) => {
	res.send("Web server is running!");
});

/**
 * This makes the cors stuff work :)
 */
app.options("*", async (req, res) => {
	res.setHeader("Access-Control-Allow-Headers", "*");
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Credentials", "true");
	res.setHeader("Content-Type", "application/json");
	res.end("");
});

app.post("/ghost_followers", async (req, res) => {
	const user = req.body.user;
	if (!user) return res.status(500).send("Undefined user in request body.");

	const { data, error } = await findGhostFollowers(user);

	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Credentials", "true");
	res.setHeader("Content-Type", "application/json");

	if (error) res.status(error.status).send(error.message);
	else res.end(JSON.stringify(data));
});

app.post("/fans", async (req, res) => {
	const user = req.body.user;
	if (!user) return res.status(500).send("Undefined user in request body.");

	const { data, error } = await findFans(user);

	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Credentials", "true");
	res.setHeader("Content-Type", "application/json");

	if (error) res.status(error.status).send(error.message);
	else res.end(JSON.stringify(data));
});

app.post("/unfollowers", async (req, res) => {
	const user = req.body.user;
	if (!user) return res.status(500).send("Undefined user in request body.");

	const { data, error } = await findUnfollowers(user);

	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Credentials", "true");
	res.setHeader("Content-Type", "application/json");

	if (error) res.status(error.status).send(error.message);
	else res.end(JSON.stringify(data));
});

app.post("/ordered_followers", async (req, res) => {
	const user = req.body.user;
	if (!user) return res.status(500).send("Undefined user in request body.");

	const { data, error } = await orderedFollowers(user);

	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Credentials", "true");
	res.setHeader("Content-Type", "application/json");

	if (error) res.status(error.status).send(error.message);
	else res.end(JSON.stringify(data));
});

app.post("/following", async (req, res) => {
	const user = req.body.user;
	if (!user) return res.status(500).send("Undefined user in request body.");

	const { data, error } = await findFollowing(user);

	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Credentials", "true");
	res.setHeader("Content-Type", "application/json");

	if (error) res.status(error.status).send(error.message);
	else res.end(JSON.stringify(data));
});

app.get("/instagram_users", async (req, res) => {
	const { data, error } = getInstagramUsers();

	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Credentials", "true");
	res.setHeader("Content-Type", "application/json");

	if (error) res.status(error.status).send(error.message);
	else res.end(JSON.stringify(data));
});

app.post("/instagram_users/add", async (req, res) => {
	const user = req.body.user;
	if (!user) return res.status(500).send("Undefined user in request body.");

	const { data, error } = await addInstagramUser(user);

	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Credentials", "true");
	res.setHeader("Content-Type", "application/json");

	if (error) res.status(error.status).send(error.message);
	else res.end(JSON.stringify(data));
});

app.listen(port, () => {
	console.log(`Web server listening at http://localhost:${port}`);
});
