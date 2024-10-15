import { FunctionComponent, ReactNode, useEffect, useState } from "react";
import { getUnfollowers } from "../api/instagramServer";
import SearchFeature from "./SearchFeature";
import { useUserManager } from "../context/UserContext";

interface Props {}

const UnfollowersPanel: FunctionComponent<Props> = () => {
	const { selectedUser } = useUserManager();

	const [dataList, setDataList] = useState<string[] | undefined>(undefined);
	const [serverError, setServerError] = useState<Error | undefined>(undefined);
	const [searchResults, setSearchResults] = useState<string[] | undefined>(undefined);

	useEffect(() => {
		setServerError(undefined);
		getData(selectedUser);
	}, [selectedUser]);

	const getData = async (user: string | undefined) => {
		if (!user) return;

		const { data, error } = await getUnfollowers(user);

		if (error) setServerError(error);
		else setDataList(data);
	};

	const listOfUsers = (list: string[]): ReactNode => {
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

	const displayContent = () => {
		if (serverError) return <p className="error">{serverError.message}</p>;
		if (!dataList && !searchResults) return <p>Loading...</p>;
		if (!searchResults && dataList) return <div className="list">{listOfUsers(dataList)}</div>;

		if (searchResults && searchResults.length > 0) {
			return (
				<>
					<p>
						{searchResults.length} result{searchResults.length !== 1 && "s"}
					</p>
					<div className="list">{listOfUsers(searchResults)}</div>
				</>
			);
		}
	};

	return (
		<div className="panel">
			<h4>Unfollowers {dataList && "(" + dataList.length + ")"}</h4>
			<p className="info">Users who do not follow you back.</p>
			<SearchFeature searchResults={(res) => setSearchResults(res)} searchableList={dataList}></SearchFeature>

			{selectedUser && displayContent()}
		</div>
	);
};

export default UnfollowersPanel;
