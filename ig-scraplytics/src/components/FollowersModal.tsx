import { FunctionComponent, ReactNode } from "react";
import { UserPostRelationship } from "../types/types";
import "../styles/modal.css";

interface Props {
	modalOpen: boolean;
	closeModal(): void;
	followersList: UserPostRelationship[] | undefined;
	followersServerError: Error | undefined;
	followingList: string[] | undefined;
	followingServerError: Error | undefined;
}

const FollowersModal: FunctionComponent<Props> = ({ modalOpen, followersServerError, followersList, closeModal }) => {
	const listOfFollowers = (list: UserPostRelationship[]): ReactNode => {
		const arr: ReactNode[] = list.map((item, i) => {
			return (
				<p key={item.user + i} className="username">
					{item.numberOfPostsLiked} - {item.user}
				</p>
			);
		});

		if (arr.length > 0) return arr;
		return <p>No users found.</p>;
	};

	return (
		modalOpen && (
			<div className="modal-container">
				<div className="modal">
					<span onClick={() => closeModal()} className="close">
						&times;
					</span>
					<h3>Ordered Followers {followersList && "(" + followersList.length + ")"}</h3>
					<p className="info">
						Followers are ordered from the most to the least interactive (out of the scraped posts).
					</p>

					{followersList !== undefined ? (
						<div className="list">{listOfFollowers(followersList)}</div>
					) : followersServerError !== undefined ? (
						<p>Error {JSON.stringify(followersServerError)}</p>
					) : (
						<p>Loading...</p>
					)}
				</div>
			</div>
		)
	);
};

export default FollowersModal;
