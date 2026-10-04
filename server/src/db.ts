import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// relative to server/src, because queryTextFile() joins paths onto its own __dirname
export const instagramUsersFolder = "../../db";
export const instagramUsersFolderPath = path.join(__dirname, instagramUsersFolder);

export const followersTxt = "followers.txt";
export const followingTxt = "following.txt";
export const postLikesTxt = "postLikes.txt";
