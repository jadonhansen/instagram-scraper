import { useEffect, useState } from "react";

import { getFans, getFollowing, getGhostFollowers, getOrderedFollowers, getUnfollowers } from "../api/instagramServer";
import { useUserManager } from "../context/UserContext";
import { UserPostRelationship } from "../types/types";

// undefined = loading, Error = request failed
export type Loadable<T> = T | Error | undefined;

export interface AccountStats {
	followers: Loadable<UserPostRelationship[]>;
	following: Loadable<string[]>;
	fans: Loadable<string[]>;
	// null when there is no post likes data to compare against
	ghosts: Loadable<string[] | null>;
	unfollowers: Loadable<string[]>;
}

const empty: AccountStats = {
	followers: undefined,
	following: undefined,
	fans: undefined,
	ghosts: undefined,
	unfollowers: undefined,
};

export function isReady<T>(value: Loadable<T>): value is T {
	return value !== undefined && !(value instanceof Error);
}

// Fetches every stat for the selected account once, so all cards read from the same snapshot.
export function useAccountStats(): AccountStats {
	const { selectedUser, dataVersion } = useUserManager();
	const [stats, setStats] = useState<AccountStats>(empty);

	useEffect(() => {
		setStats(empty);
		if (!selectedUser) return;

		let cancelled = false;
		const load = (key: keyof AccountStats, request: Promise<{ data: unknown; error: Error | undefined }>) => {
			request
				// fetch rejects when the server is not running at all
				.catch((error: unknown) => ({
					data: undefined,
					error: error instanceof Error ? error : new Error(String(error)),
				}))
				.then(({ data, error }) => {
					if (!cancelled) setStats((prev) => ({ ...prev, [key]: error ?? data }));
				});
		};

		load("followers", getOrderedFollowers(selectedUser));
		load("following", getFollowing(selectedUser));
		load("fans", getFans(selectedUser));
		load("ghosts", getGhostFollowers(selectedUser));
		load("unfollowers", getUnfollowers(selectedUser));

		return () => {
			cancelled = true;
		};
	}, [selectedUser, dataVersion]);

	return stats;
}
