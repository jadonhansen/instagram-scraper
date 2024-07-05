import { Error } from "./types";
import { getDataFromFile } from "./queries";

const followersTxt = "../../db/followers.txt";
const followingTxt = "../../db/following.txt";
const postLikesTxt = "../../db/postLikes.txt";

// find followers who do not like any of your posts
export async function findGhostFollowers(): Promise<string[] | Error> {
	const followers = await getDataFromFile(followersTxt);
	const postLikes = await getDataFromFile(postLikesTxt);

	if (followers.error) return followers.error;
	if (postLikes.error) return postLikes.error;

	// do calculations
	return ["findGhostFollowers"];
}

// find users who like your posts but do not follow you
export async function findFans(): Promise<string[] | Error> {
	const followers = await getDataFromFile(followersTxt);
	const postLikes = await getDataFromFile(postLikesTxt);

	if (followers.error) return followers.error;
	if (postLikes.error) return postLikes.error;

	// do calculations
	return ["findFans"];
}

// find users who do not follow you back
export async function findUnfollowers(): Promise<string[] | Error> {
	const followers = await getDataFromFile(followersTxt);
	const following = await getDataFromFile(followingTxt);

	if (followers.error) return followers.error;
	if (following.error) return following.error;

	// do calculations
	return ["findUnfollowers"];
}

// order your followers from the most interactive to the least interactive
export async function orderedFollowers(): Promise<string[] | Error> {
	const followers = await getDataFromFile(followersTxt);
	const postLikes = await getDataFromFile(postLikesTxt);

	if (followers.error) return followers.error;
	if (postLikes.error) return postLikes.error;

	// do calculations
	return ["orderedFollowers"];
}

// just returns a list of users you follow
export async function findFollowing(): Promise<string[] | Error> {
	const followers = await getDataFromFile(followingTxt);

	if (followers.error) return followers.error;

	return ["findFollowing"];
}
