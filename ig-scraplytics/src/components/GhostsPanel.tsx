import { FunctionComponent, ReactNode, useEffect, useState } from "react";
import { getGhostFollowers } from "../api/instagramServer";
import { useUserManager } from "../context/UserContext";
import SearchFeature from "./SearchFeature";

interface Props {}

const GhostsPanel: FunctionComponent<Props> = () => {
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

		const { data, error } = await getGhostFollowers(user);

		if (error) {
			setServerError(error);
			setDataList(undefined);
			setSearchResults(undefined);
		} else setDataList(data);
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
		if (serverError) return <p className="error">{serverError.message}. Please rescrape data.</p>;
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
			<h4>Ghost Followers {dataList && "(" + dataList.length + ")"}</h4>
			<p className="info">Users who follow you but do not engage with your content.</p>
			<SearchFeature searchResults={(res) => setSearchResults(res)} searchableList={dataList}></SearchFeature>

			{selectedUser && displayContent()}
		</div>
	);
};

export default GhostsPanel;
