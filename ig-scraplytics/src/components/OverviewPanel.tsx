import { FunctionComponent, useEffect, useState } from "react";
import FollowersModal from "./FollowersModal";
import { getFollowing, getOrderedFollowers } from "../api/instagramServer";
import { UserPostRelationship } from "../types/types";

interface Props {}

const OverviewPanel: FunctionComponent<Props> = () => {
	const [showModal, setShowModal] = useState<boolean>(false);

	const [followersList, setFollowersList] = useState<UserPostRelationship[] | undefined>(undefined);
	const [followersServerError, setFollowersServerError] = useState<Error | undefined>(undefined);
	const [followingList, setFollowingList] = useState<string[] | undefined>(undefined);
	const [followingServerError, setFollowingServerError] = useState<Error | undefined>(undefined);

	useEffect(() => {
		getData();
	}, []);

	const getData = async () => {
		const followersData = await getOrderedFollowers();
		const followingData = await getFollowing();

		if (followersData.error) setFollowersServerError(followersData.error);
		else setFollowersList(followersData.data);

		if (followingData.error) setFollowingServerError(followingData.error);
		else setFollowingList(followingData.data);
	};

	return (
		<div className="panel">
			<FollowersModal
				followersList={followersList}
				followersServerError={followersServerError}
				followingList={followingList}
				followingServerError={followingServerError}
				closeModal={() => setShowModal(false)}
				modalOpen={showModal}
			></FollowersModal>

			<h3>Overview</h3>
			<p>profile photo, following counts, account score %</p>
			<p onClick={() => setShowModal(true)}>
				{followersList ? followersList.length : 0} {followersList?.length == 1 ? "follower" : "followers"}
			</p>
			<p onClick={() => setShowModal(true)}>{followingList ? followingList.length : 0} following</p>
		</div>
	);
};

export default OverviewPanel;
