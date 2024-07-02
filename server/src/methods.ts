import { Error } from "./interfaces";
import { getDataFromFile } from "./queries";

const followersTxt = "../../db/followers.txt";
const followingTxt = "../../db/following.txt";
const postLikesTxt = "../../db/postLikes.txt";

// find followers who do not like any of your posts
export async function findGhostFollowers(): Promise<string[] | Error> {
	const followers: string[] | Error = await getDataFromFile(followersTxt);
	const postLikes = await getDataFromFile(postLikesTxt);

	if (!Array.isArray(followers)) return followers;
	if (!Array.isArray(postLikes)) return postLikes;

	// do calculations
	return [""];
}

// find users who like your posts but do not follow you
export async function findFans(): Promise<string[] | Error> {
	const followers = await getDataFromFile(followersTxt);
	const postLikes = await getDataFromFile(postLikesTxt);

	if (!Array.isArray(followers)) return followers;
	if (!Array.isArray(postLikes)) return postLikes;

	// do calculations
	return [""];
}

// find users who do not follow you back
export async function findUnfollowers(): Promise<string[] | Error> {
	const followers = await getDataFromFile(followersTxt);
	const following = await getDataFromFile(followingTxt);

	if (!Array.isArray(followers)) return followers;
	if (!Array.isArray(following)) return following;

	// do calculations
	return [""];
}

// order your followers from the most interactive to the least interactive
export async function orderedFollowers(): Promise<string[] | Error> {
	const followers = await getDataFromFile(followersTxt);
	const postLikes = await getDataFromFile(postLikesTxt);

	if (!Array.isArray(followers)) return followers;
	if (!Array.isArray(postLikes)) return postLikes;

	// do calculations
	return [""];
}
