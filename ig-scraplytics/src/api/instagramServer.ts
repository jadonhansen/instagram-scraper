const baseUrl = "http://localhost:3000";
const isDebug = true;

const headers = new Headers({ "content-type": "application/json" });
const fetchOptions: RequestInit = {
	method: "GET",
	headers: headers
}

export async function getGhostFollowers(): Promise<string[] | Error> {
	try {
		const res = await fetch(`${baseUrl}/ghost_followers`, fetchOptions);

		if (res.ok) {
			const ret = await res.json();
			if (isDebug) console.log("getGhostFollowers()", ret);
			return ret;
		} else {
			if (isDebug) console.log("getGhostFollowers()", res);
			throw new Error(res.statusText);
		}
	} catch (error) {
		if (error) return { name: error?.toString(), message: error?.toString() };
		return { name: "Error getting ghost followers.", message: "Server unresponsive." };
	}
}

export async function getFans(): Promise<string[] | Error> {
	try {
		const res = await fetch(`${baseUrl}/fans`, fetchOptions);

		if (res.ok) {
			const ret = await res.json();
			if (isDebug) console.log("getFans()", ret);
			return ret;
		} else {
			if (isDebug) console.log("getFans()", res);
			throw new Error(res.statusText);
		}
	} catch (error) {
		if (error) return { name: error?.toString(), message: error?.toString() };
		return { name: "Error getting fans.", message: "Server unresponsive." };
	}
}

export async function getUnfollowers(): Promise<string[] | Error> {
	try {
		const res = await fetch(`${baseUrl}/unfollowers`, fetchOptions);

		if (res.ok) {
			const ret = await res.json();
			if (isDebug) console.log("getUnfollowers()", ret);
			return ret;
		} else {
			if (isDebug) console.log("getUnfollowers()", res);
			throw new Error(res.statusText);
		}
	} catch (error) {
		if (error) return { name: error?.toString(), message: error?.toString() };
		return { name: "Error getting unfollowers.", message: "Server unresponsive." };
	}
}

export async function getOrderedFollowers(): Promise<string[] | Error> {
	try {
		const res = await fetch(`${baseUrl}/ordered_followers`, fetchOptions);

		if (res.ok) {
			const ret = await res.json();
			if (isDebug) console.log("getOrderedFollowers()", ret);
			return ret;
		} else {
			if (isDebug) console.log("getOrderedFollowers()", res);
			throw new Error(res.statusText);
		}
	} catch (error) {
		if (error) return { name: error?.toString(), message: error?.toString() };
		return { name: "Error getting ordered followers.", message: "Server unresponsive." };
	}
}

export async function testServer(): Promise<string | Error> {
	try {
		const res = await fetch(`${baseUrl}/`, fetchOptions);

		if (res.ok) {
			const ret = await res.json();
			if (isDebug) console.log("testServer()", ret);
			return ret;
		} else {
			if (isDebug) console.log("testServer()", res);
			throw new Error(res.statusText);
		}
	} catch (error) {
		if (error) return { name: error?.toString(), message: error?.toString() };
		return { name: "Error communicating with the server.", message: "Server unresponsive." };
	}
}