import { FunctionComponent, ReactNode, useState } from "react";
import { UserPostRelationship } from "../types/types";
import { useUserManager } from "../context/UserContext";
import "../styles/modal.css";
import SearchFeature from "./SearchFeature";

interface Props {
	modalOpen: boolean;
	closeModal(): void;
	followersList: UserPostRelationship[] | undefined;
	followersServerError: Error | undefined;
	followingList: string[] | undefined;
	followingServerError: Error | undefined;
}

const FollowersModal: FunctionComponent<Props> = ({
	modalOpen,
	followersServerError,
	followersList,
	followingList,
	followingServerError,
	closeModal,
}) => {
	const { selectedUser } = useUserManager();
	const [followingSearchResults, setFingSearchResults] = useState<string[] | undefined>(undefined);

	const listOfFollowers = (list: UserPostRelationship[]): ReactNode => {
		const arr: ReactNode[] = list.map((item, i) => {
			return (
				<div key={item.user + i}>
					{item.numberOfPostsLiked == 0 && list[i - 1].numberOfPostsLiked !== 0 && (
						<p className="ghost-followers-info">These are ghost followers</p>
					)}
					<p
						id={i.toString()}
						className={
							"username" +
							(i > 0 && item.numberOfPostsLiked !== list[i - 1].numberOfPostsLiked ? " mb" : "")
						}
					>
						{item.numberOfPostsLiked} - {item.user}
					</p>
				</div>
			);
		});

		if (arr.length > 0) return arr;
		return <p>No users found.</p>;
	};

	const listOfFollowing = (list: string[]): ReactNode => {
		const arr: ReactNode[] = list.map((item, i) => {
			return (
				<p key={item + i} className="username">
					{item}
				</p>
			);
		});

		if (arr.length > 0) return arr;
		return <p>No users found.</p>;
	};

	const displayFollowing = () => {
		if (followingServerError) return <p className="error">{followingServerError.message}. Please rescrape data.</p>;
		if (!followingList && !followingSearchResults) return <p>Loading...</p>;
		if (!followingSearchResults && followingList)
			return <div className="list">{listOfFollowing(followingList)}</div>;

		if (followingSearchResults && followingSearchResults.length > 0) {
			return (
				<>
					<p>
						{followingSearchResults.length} result{followingSearchResults.length !== 1 && "s"}
					</p>
					<div className="list">{listOfFollowing(followingSearchResults)}</div>
				</>
			);
		}
	};

	const displayFollowers = () => {
		if (followersServerError) return <p className="error">{followersServerError.message}. Please rescrape data.</p>;
		if (followersList) return <div className="list">{listOfFollowers(followersList)}</div>;
		return <p>Loading...</p>;
	};

	return (
		modalOpen && (
			<div className="modal-container">
				<div className="modal">
					<span onClick={() => closeModal()} className="close">
						&times;
					</span>

					<div className="grid">
						<div className="col">
							<h4>Ordered Followers {followersList && "(" + followersList.length + ")"}</h4>
							<p className="info">
								Followers are ordered from the most to the least interactive (out of the scraped posts).
							</p>

							{selectedUser && displayFollowers()}
						</div>
						<div className="col">
							<h4>Following {followingList && "(" + followingList.length + ")"}</h4>
							<p className="info">Users you follow.</p>
							<SearchFeature
								searchResults={(res) => setFingSearchResults(res)}
								searchableList={followingList}
							></SearchFeature>

							{selectedUser && displayFollowing()}
						</div>
					</div>
				</div>
			</div>
		)
	);
};

export default FollowersModal;
