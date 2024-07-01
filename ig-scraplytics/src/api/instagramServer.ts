const baseUrl = "localhost:3000";
const isDebug = true;

export async function getGhostFollowers(): Promise<string[] | Error> {
	const res = await fetch(`${baseUrl}/ghost_followers`);
	const ret = await res.json();

	if (isDebug) console.log("getGhostFollowers()", ret);
	return ret;
}

export async function getFans(): Promise<string[] | Error> {
	const res = await fetch(`${baseUrl}/fans`);
	const ret = await res.json();

	if (isDebug) console.log("getFans()", ret);
	return ret;
}

export async function getUnfollowers(): Promise<string[] | Error> {
	const res = await fetch(`${baseUrl}/unfollowers`);
	const ret = await res.json();

	if (isDebug) console.log("getUnfollowers()", ret);
	return ret;
}

export async function getOrderedFollowers(): Promise<string[] | Error> {
	const res = await fetch(`${baseUrl}/ordered_followers`);
	const ret = await res.json();

	if (isDebug) console.log("getOrderedFollowers()", ret);
	return ret;
}

export async function testServer(): Promise<string | Error> {
	const res = await fetch(`${baseUrl}/`);
	const ret = await res.json();

	if (isDebug) console.log("testServer()", ret);
	return ret;
}