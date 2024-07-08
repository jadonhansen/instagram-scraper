import { FunctionComponent, useEffect, useState } from "react";
import FollowersModal from "./FollowersModal";
import { getFollowing, getOrderedFollowers } from "../api/instagramServer";
import { UserPostRelationship } from "../types/types";
import "../styles/overview.css";

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
				50% <span>account score</span>
			</h4>
		</div>
	);
};

export default OverviewPanel;
