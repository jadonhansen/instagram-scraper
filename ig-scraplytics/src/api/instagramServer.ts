import { ApiResponse, UserPostRelationship } from "../types/types";

const baseUrl = "http://localhost:3000";
const isDebug = false;

const getFetchOptions: RequestInit = {
	method: "GET",
	mode: "cors",
};

// https://stackoverflow.com/questions/43262121/trying-to-use-fetch-and-pass-in-mode-no-cors
/**
 * No cors blocks the body
 */
const postFetchOptions: RequestInit = {
	method: "POST",
	// mode: "no-cors",
	headers: { "Content-Type": "application/json" },
};

export async function getInstagramUsers(): Promise<ApiResponse<string[], Error>> {
	const res = await fetch(`${baseUrl}/instagram_users`, getFetchOptions);

	if (res.ok) {
		const data = await res.json();
		if (isDebug) console.log("getInstagramUsers()", data);
		return { data, error: undefined };
	} else {
		if (isDebug) console.error("getInstagramUsers()", res);
		const error = new Error(res.statusText);
		return { data: undefined, error };
	}
}

export async function addInstagramUser(user: string): Promise<ApiResponse<string[], Error>> {
	const res = await fetch(`${baseUrl}/instagram_users/add`, {
		...postFetchOptions,
		body: JSON.stringify({ user: user }),
	});

	if (res.ok) {
		const data = await res.json();
		if (isDebug) console.log("addInstagramUser()", data);
		return { data, error: undefined };
	} else {
		if (isDebug) console.error("addInstagramUser()", res);
		const error = new Error(res.statusText);
		return { data: undefined, error };
	}
}

export async function getGhostFollowers(user: string): Promise<ApiResponse<string[], Error>> {
	const res = await fetch(`${baseUrl}/ghost_followers`, {
		...postFetchOptions,
		body: JSON.stringify({ user: user }),
	});

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

export async function getFans(user: string): Promise<ApiResponse<string[], Error>> {
	const res = await fetch(`${baseUrl}/fans`, {
		...postFetchOptions,
		body: JSON.stringify({ user: user }),
	});

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

export async function getUnfollowers(user: string): Promise<ApiResponse<string[], Error>> {
	const res = await fetch(`${baseUrl}/unfollowers`, {
		...postFetchOptions,
		body: JSON.stringify({ user: user }),
	});

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

export async function getOrderedFollowers(user: string): Promise<ApiResponse<UserPostRelationship[], Error>> {
	const res = await fetch(`${baseUrl}/ordered_followers`, {
		...postFetchOptions,
		body: JSON.stringify({ user: user }),
	});

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

export async function getFollowing(user: string): Promise<ApiResponse<string[], Error>> {
	const res = await fetch(`${baseUrl}/following`, {
		...postFetchOptions,
		body: JSON.stringify({ user: user }),
	});

	if (res.ok) {
		const data = await res.json();
		if (isDebug) console.log("getFollowing()", data);
		return { data, error: undefined };
	} else {
		if (isDebug) console.error("getFollowing()", res);
		const error = new Error(res.statusText);
		return { data: undefined, error };
	}
}

export async function testServer(): Promise<ApiResponse<string[], Error>> {
	const res = await fetch(`${baseUrl}/`, getFetchOptions);

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
