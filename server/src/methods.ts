import { QueryResponse, UserPostRelationship } from "./types";
import { queryDirectoryFolders, queryTextFile } from "./queries";

const instagramUsersFolder = "../../db";
const followersTxt = "followers.txt";
const followingTxt = "following.txt";
const postLikesTxt = "postLikes.txt";

const isDebug = true;

// find followers who do not like any of your posts
export async function findGhostFollowers(user: string): Promise<QueryResponse<string[]>> {
	const folderPath = instagramUsersFolder + "/" + user;

	const followers = await queryTextFile(folderPath + "/" + followersTxt);
	const postLikes = await queryTextFile(folderPath + "/" + postLikesTxt);

	if (followers.error) return { error: followers.error, data: undefined };
	if (postLikes.error) return { error: postLikes.error, data: undefined };

	const arrFollowers = followers.data.split("\n");
	const arrPostLikes = postLikes.data.split("\n");

	// removes undefined newline from first element
	if (arrFollowers[0].includes("undefined")) arrFollowers[0] = arrFollowers[0].replace("undefined", "");
	if (arrPostLikes[0].includes("undefined")) arrPostLikes[0] = arrPostLikes[0].replace("undefined", "");

	if (isDebug) {
		console.log("\n\n--- findGhostFollowers() method ---");
		console.log("Followers arr len: ", arrFollowers.length);
		console.log("Post likes arr len: ", arrPostLikes.length);
	}

	const uniquePostLikes = [...new Set(arrPostLikes)];

	// removes followers who have liked your posts
	const ghosts = arrFollowers.filter((follower) => {
		return !uniquePostLikes.includes(follower);
	});

	if (isDebug) console.log("Number of ghost followers: ", ghosts.length);

	return { data: ghosts, error: undefined };
}

// find users who like your posts but do not follow you
export async function findFans(user: string): Promise<QueryResponse<string[]>> {
	const folderPath = instagramUsersFolder + "/" + user;

	const followers = await queryTextFile(folderPath + "/" + followersTxt);
	const postLikes = await queryTextFile(folderPath + "/" + postLikesTxt);

	if (followers.error) return { error: followers.error, data: undefined };
	if (postLikes.error) return { error: postLikes.error, data: undefined };

	const arrFollowers = followers.data.split("\n");
	const arrPostLikes = postLikes.data.split("\n");

	// removes undefined newline from first element
	if (arrFollowers[0].includes("undefined")) arrFollowers[0] = arrFollowers[0].replace("undefined", "");
	if (arrPostLikes[0].includes("undefined")) arrPostLikes[0] = arrPostLikes[0].replace("undefined", "");

	if (isDebug) {
		console.log("\n\n--- findFans() method ---");
		console.log("Followers arr len: ", arrFollowers.length);
		console.log("Post likes arr len: ", arrPostLikes.length);
	}

	const uniquePostLikes = [...new Set(arrPostLikes)];

	// removes users who are followers
	const fans = uniquePostLikes.filter((user) => {
		return !arrFollowers.includes(user);
	});

	if (isDebug) console.log("Number of fans: ", fans.length);

	return { data: fans, error: undefined };
}

// find users who do not follow you back
export async function findUnfollowers(user: string): Promise<QueryResponse<string[]>> {
	const folderPath = instagramUsersFolder + "/" + user;

	const followers = await queryTextFile(folderPath + "/" + followersTxt);
	const following = await queryTextFile(folderPath + "/" + followingTxt);

	if (followers.error) return { error: followers.error, data: undefined };
	if (following.error) return { error: following.error, data: undefined };

	const arrFollowers = followers.data.split("\n");
	const arrFollowing = following.data.split("\n");

	// removes undefined newline from first element
	if (arrFollowers[0].includes("undefined")) arrFollowers[0] = arrFollowers[0].replace("undefined", "");
	if (arrFollowing[0].includes("undefined")) arrFollowing[0] = arrFollowing[0].replace("undefined", "");

	if (isDebug) {
		console.log("\n\n--- findUnfollowers() method ---");
		console.log("Followers arr len: ", arrFollowers.length);
		console.log("Following arr len: ", arrFollowing.length);
	}

	// removes users who follow me back
	const unfollowers = arrFollowing.filter((followingUser) => {
		return !arrFollowers.includes(followingUser);
	});

	if (isDebug) console.log("Number of unfollowers: ", unfollowers.length);

	return { data: unfollowers, error: undefined };
}

// order your followers from the most interactive to the least interactive
export async function orderedFollowers(user: string): Promise<QueryResponse<UserPostRelationship[]>> {
	const folderPath = instagramUsersFolder + "/" + user;

	const followers = await queryTextFile(folderPath + "/" + followersTxt);
	const postLikes = await queryTextFile(folderPath + "/" + postLikesTxt);

	if (followers.error) return { error: followers.error, data: undefined };
	if (postLikes.error) return { error: postLikes.error, data: undefined };

	const arrFollowers = followers.data.split("\n");
	const arrPostLikes = postLikes.data.split("\n");

	// removes undefined newline from first element
	if (arrFollowers[0].includes("undefined")) arrFollowers[0] = arrFollowers[0].replace("undefined", "");
	if (arrPostLikes[0].includes("undefined")) arrPostLikes[0] = arrPostLikes[0].replace("undefined", "");

	if (isDebug) {
		console.log("\n\n--- orderedFollowers() method ---");
		console.log("Followers arr len: ", arrFollowers.length);
		console.log("Post likes arr len: ", arrPostLikes.length);
	}

	// gets number of post likes for each follower
	const relationships: UserPostRelationship[] = arrFollowers.map((follower) => {
		const numOfLikes = arrPostLikes.filter((liker) => liker === follower).length;
		return { user: follower, numberOfPostsLiked: numOfLikes };
	});

	const sorted = relationships.sort((a, b) => {
		return b.numberOfPostsLiked - a.numberOfPostsLiked;
	});

	if (isDebug) console.log("Number of ordered followers: ", sorted.length);

	return { data: sorted, error: undefined };
}

// just returns a list of users you follow
export async function findFollowing(user: string): Promise<QueryResponse<string[]>> {
	const folderPath = instagramUsersFolder + "/" + user;

	const following = await queryTextFile(folderPath + "/" + followingTxt);

	if (following.error) return following;

	const arrFollowing = following.data.split("\n");

	// removes undefined newline from first element
	if (arrFollowing[0].includes("undefined")) arrFollowing[0] = arrFollowing[0].replace("undefined", "");

	if (isDebug) {
		console.log("\n\n--- findFollowing() method ---");
		console.log("Following arr len: ", arrFollowing.length);
	}

	return { data: arrFollowing, error: undefined };
}

// returns a list of instagram profiles, according to the directories in the db folder
export function getInstagramUsers(): QueryResponse<string[]> {
	const users = queryDirectoryFolders(instagramUsersFolder);

	if (users.error) return users;

	if (isDebug) {
		console.log("\n\n--- getInstagramUsers() method ---");
		console.log("Instagram users arr: ", users.data);
	}

	return { data: users.data, error: undefined };
}
