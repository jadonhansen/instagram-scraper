import { FunctionComponent, useEffect, useState } from "react";
import { useUserManager } from "../context/UserContext";
import FollowersModal from "./FollowersModal";
import { getFollowing, getOrderedFollowers } from "../api/instagramServer";
import { UserPostRelationship } from "../types/types";
import "../styles/overview.css";

const isDebug = true;

interface Props {}

const OverviewPanel: FunctionComponent<Props> = () => {
	const { selectedUser } = useUserManager();

	const [showModal, setShowModal] = useState<boolean>(false);

	const [followersList, setFollowersList] = useState<UserPostRelationship[] | undefined>(undefined);
	const [followersServerError, setFollowersServerError] = useState<Error | undefined>(undefined);
	const [followingList, setFollowingList] = useState<string[] | undefined>(undefined);
	const [followingServerError, setFollowingServerError] = useState<Error | undefined>(undefined);

	useEffect(() => {
		setFollowersServerError(undefined);
		setFollowingServerError(undefined);
		getData(selectedUser);
	}, [selectedUser]);

	const getData = async (user: string | undefined) => {
		if (!user) return;

		const followersData = await getOrderedFollowers(user);
		const followingData = await getFollowing(user);

		if (followersData.error) setFollowersServerError(followersData.error);
		else setFollowersList(followersData.data);

		if (followingData.error) setFollowingServerError(followingData.error);
		else setFollowingList(followingData.data);
	};

	const calculateScore = (): number => {
		if (followersList) {
			const numOfGhosts = followersList.filter((follower) => {
				return follower.numberOfPostsLiked !== 0;
			}).length;

			if (isDebug) console.log("calculateScore(): number of ghosts", numOfGhosts);
			if (isDebug) console.log("calculateScore(): number of followers", followersList.length);

			return numOfGhosts == 0 ? 0 : Math.floor((numOfGhosts / followersList.length) * 100);
		}
		return 0;
	};

	return (
		<div className="panel overview-panel">
			<FollowersModal
				followersList={followersList}
				followersServerError={followersServerError}
				followingList={followingList}
				followingServerError={followingServerError}
				closeModal={() => setShowModal(false)}
				modalOpen={showModal}
			></FollowersModal>

			<div>
				<h3>Overview</h3>

				<div className="profile-info">
					<img src="" alt="profile photo" />
					<div>
						<p onClick={() => setShowModal(true)} className="link">
							{followersList ? followersList.length : 0}{" "}
							{followersList?.length == 1 ? "follower" : "followers"}
						</p>
						<p onClick={() => setShowModal(true)} className="link link-mt">
							{followingList ? followingList.length : 0} following
						</p>
					</div>
				</div>
			</div>
			<h4 className="score">
				{calculateScore()}% <span className="score-info">account score</span>
				<span className="tooltip">The percentage of followers that engage with your content</span>
			</h4>
		</div>
	);
};

export default OverviewPanel;
