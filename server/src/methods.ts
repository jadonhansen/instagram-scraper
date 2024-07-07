import { QueryResponse } from "./types";
import { queryTextFile } from "./queries";

const followersTxt = "../../db/followers.txt";
const followingTxt = "../../db/following.txt";
const postLikesTxt = "../../db/postLikes.txt";
const isDebug = true;

// find followers who do not like any of your posts
export async function findGhostFollowers(): Promise<QueryResponse<string[]>> {
	const followers = await queryTextFile(followersTxt);
	const postLikes = await queryTextFile(postLikesTxt);

	if (followers.error) return { error: followers.error, data: undefined };
	if (postLikes.error) return { error: postLikes.error, data: undefined };

	const arrFollowers = followers.data.split("\n");
	const arrPostLikes = postLikes.data.split("\n");

	if (isDebug) {
		console.log("\n\n--- findGhostFollowers() method ---");
		console.log("Followers arr len: ", arrFollowers.length);
		console.log("Post likes arr len: ", arrPostLikes.length); // TODO: incorrect length
	}

	return { data: ["findGhostFollowers"], error: undefined };
}

// find users who like your posts but do not follow you
export async function findFans(): Promise<QueryResponse<string[]>> {
	const followers = await queryTextFile(followersTxt);
	const postLikes = await queryTextFile(postLikesTxt);

	if (followers.error) return { error: followers.error, data: undefined };
	if (postLikes.error) return { error: postLikes.error, data: undefined };

	const arrFollowers = followers.data.split("\n");
	const arrPostLikes = postLikes.data.split("\n");

	if (isDebug) {
		console.log("\n\n--- findFans() method ---");
		console.log("Followers arr len: ", arrFollowers.length);
		console.log("Post likes arr len: ", arrPostLikes.length);
	}

	// do calculations
	return { data: ["findFans"], error: undefined };
}

// find users who do not follow you back
export async function findUnfollowers(): Promise<QueryResponse<string[]>> {
	const followers = await queryTextFile(followersTxt);
	const following = await queryTextFile(followingTxt);

	if (followers.error) return { error: followers.error, data: undefined };
	if (following.error) return { error: following.error, data: undefined };

	const arrFollowers = followers.data.split("\n");
	const arrFollowing = following.data.split("\n");

	if (isDebug) {
		console.log("\n\n--- findUnfollowers() method ---");
		console.log("Followers arr len: ", arrFollowers.length);
		console.log("Following arr len: ", arrFollowing.length);
	}

	// do calculations
	return { data: ["findUnfollowers"], error: undefined };
}

// order your followers from the most interactive to the least interactive
export async function orderedFollowers(): Promise<QueryResponse<string[]>> {
	const followers = await queryTextFile(followersTxt);
	const postLikes = await queryTextFile(postLikesTxt);

	if (followers.error) return { error: followers.error, data: undefined };
	if (postLikes.error) return { error: postLikes.error, data: undefined };

	const arrFollowers = followers.data.split("\n");
	const arrPostLikes = postLikes.data.split("\n");

	if (isDebug) {
		console.log("\n\n--- orderedFollowers() method ---");
		console.log("Followers arr len: ", arrFollowers.length);
		console.log("Post likes arr len: ", arrPostLikes.length);
	}

	// do calculations
	return { data: ["orderedFollowers"], error: undefined };
}

// just returns a list of users you follow
export async function findFollowing(): Promise<QueryResponse<string[]>> {
	const following = await queryTextFile(followingTxt);

	if (following.error) return following;

	const arrFollowing = following.data.split("\n");

	if (isDebug) {
		console.log("\n\n--- findFollowing() method ---");
		console.log("Following arr len: ", arrFollowing.length);
	}

	return { data: arrFollowing, error: undefined };
}
