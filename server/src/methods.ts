import { QueryResponse } from "./types";
import { queryTextFile } from "./queries";

const followersTxt = "../../db/followers.txt";
const followingTxt = "../../db/following.txt";
const postLikesTxt = "../../db/postLikes.txt";

// find followers who do not like any of your posts
export async function findGhostFollowers(): Promise<QueryResponse<string[]>> {
	const followers = await queryTextFile(followersTxt);
	const postLikes = await queryTextFile(postLikesTxt);

	if (followers.error) return { error: followers.error, data: undefined };
	if (postLikes.error) return { error: postLikes.error, data: undefined };

	// do calculations
	return { data: ["findGhostFollowers"], error: undefined };
}

// find users who like your posts but do not follow you
export async function findFans(): Promise<QueryResponse<string[]>> {
	const followers = await queryTextFile(followersTxt);
	const postLikes = await queryTextFile(postLikesTxt);

	if (followers.error) return { error: followers.error, data: undefined };
	if (postLikes.error) return { error: postLikes.error, data: undefined };

	// do calculations
	return { data: ["findFans"], error: undefined };
}

// find users who do not follow you back
export async function findUnfollowers(): Promise<QueryResponse<string[]>> {
	const followers = await queryTextFile(followersTxt);
	const following = await queryTextFile(followingTxt);

	if (followers.error) return { error: followers.error, data: undefined };
	if (following.error) return { error: following.error, data: undefined };

	// do calculations
	return { data: ["findUnfollowers"], error: undefined };
}

// order your followers from the most interactive to the least interactive
export async function orderedFollowers(): Promise<QueryResponse<string[]>> {
	const followers = await queryTextFile(followersTxt);
	const postLikes = await queryTextFile(postLikesTxt);

	if (followers.error) return { error: followers.error, data: undefined };
	if (postLikes.error) return { error: postLikes.error, data: undefined };

	// do calculations
	return { data: ["orderedFollowers"], error: undefined };
}

// just returns a list of users you follow
export async function findFollowing(): Promise<QueryResponse<string[]>> {
	const followers = await queryTextFile(followingTxt);
	return followers;
}
