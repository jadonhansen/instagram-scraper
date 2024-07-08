import { ApiResponse, UserPostRelationship } from "../types/types";

const baseUrl = "http://localhost:3000";
const isDebug = true;

const fetchOptions: RequestInit = {
	method: "GET",
	mode: "cors",
};

export async function getGhostFollowers(): Promise<ApiResponse<string[], Error>> {
	const res = await fetch(`${baseUrl}/ghost_followers`, fetchOptions);

	if (res.ok) {
		const data = await res.json();
		if (isDebug) console.log("getGhostFollowers()", data);
		return { data, error: undefined };
	} else {
		if (isDebug) console.error("getGhostFollowers()", res);
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
		if (isDebug) console.error("getFans()", res);
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
		if (isDebug) console.error("getUnfollowers()", res);
		const error = new Error(res.statusText);
		return { data: undefined, error };
	}
}

export async function getOrderedFollowers(): Promise<ApiResponse<UserPostRelationship[], Error>> {
	const res = await fetch(`${baseUrl}/ordered_followers`, fetchOptions);

	if (res.ok) {
		const data = await res.json();
		if (isDebug) console.log("getOrderedFollowers()", data);
		return { data, error: undefined };
	} else {
		if (isDebug) console.error("getOrderedFollowers()", res);
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
		if (isDebug) console.error("testServer()", res);
		const error = new Error(res.statusText);
		return { data: undefined, error };
	}
}
