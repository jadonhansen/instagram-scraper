import { ApiResponse } from "../types/types";

const baseUrl = "http://localhost:3000";
const isDebug = true;

// const headers = new Headers({ "Content-Type": "application/json" });
const fetchOptions: RequestInit = {
	method: "GET",
	// credentials: "include",
	// headers: { "Content-Type": "application/json" },
	mode: "cors",
};

export async function getGhostFollowers(): Promise<ApiResponse<string[], Error>> {
	const res = await fetch(`${baseUrl}/ghost_followers`, fetchOptions);

	if (res.ok) {
		const data = await res.json();
		if (isDebug) console.log("getGhostFollowers()", data);
		return { data, error: undefined };
	} else {
		console.log(["-", res]);

		if (isDebug) console.log("getGhostFollowers()", res);
		const error = new Error(res.statusText);
		return { data: undefined, error };
	}
}

export async function getFans(): Promise<ApiResponse<string[], Error>> {
	const res = await fetch(`${baseUrl}/fans`, fetchOptions);

	if (res.ok) {
		const data = await res.json();
		if (isDebug) console.log("getFans()", data);
		return { data, error: undefined };
	} else {
		if (isDebug) console.log("getFans()", res);
		const error = new Error(res.statusText);
		return { data: undefined, error };
	}
}

export async function getUnfollowers(): Promise<ApiResponse<string[], Error>> {
	const res = await fetch(`${baseUrl}/unfollowers`, fetchOptions);

	if (res.ok) {
		const data = await res.json();
		if (isDebug) console.log("getUnfollowers()", data);
		return { data, error: undefined };
	} else {
		if (isDebug) console.log("getUnfollowers()", res);
		const error = new Error(res.statusText);
		return { data: undefined, error };
	}
}

export async function getOrderedFollowers(): Promise<ApiResponse<string[], Error>> {
	const res = await fetch(`${baseUrl}/ordered_followers`, fetchOptions);

	if (res.ok) {
		const data = await res.json();
		if (isDebug) console.log("getOrderedFollowers()", data);
		return { data, error: undefined };
	} else {
		if (isDebug) console.log("getOrderedFollowers()", res);
		const error = new Error(res.statusText);
		return { data: undefined, error };
	}
}

export async function testServer(): Promise<ApiResponse<string[], Error>> {
	const res = await fetch(`${baseUrl}/`, fetchOptions);

	if (res.ok) {
		const data = await res.json();
		if (isDebug) console.log("testServer()", data);
		return { data, error: undefined };
	} else {
		if (isDebug) console.log("testServer()", res);
		const error = new Error(res.statusText);
		return { data: undefined, error };
	}
}
