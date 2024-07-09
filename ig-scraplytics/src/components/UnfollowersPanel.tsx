import { FunctionComponent, ReactNode, useEffect, useState } from "react";
import { getUnfollowers } from "../api/instagramServer";
import SearchFeature from "./SearchFeature";

interface Props {}

const UnfollowersPanel: FunctionComponent<Props> = () => {
	const [dataList, setDataList] = useState<string[] | undefined>(undefined);
	const [serverError, setServerError] = useState<Error | undefined>(undefined);
	const [searchResults, setSearchResults] = useState<string[] | undefined>(undefined);

	useEffect(() => {
		getData();
	}, []);

	const getData = async () => {
		const { data, error } = await getUnfollowers();

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

	return (
		<div className="panel">
			<h4>Unfollowers {dataList && "(" + dataList.length + ")"}</h4>
			<p className="info">Users who do not follow you back.</p>
			<SearchFeature searchResults={(res) => setSearchResults(res)} searchableList={dataList}></SearchFeature>

			{serverError !== undefined && <p>Error {JSON.stringify(serverError)}</p>}
			{!dataList && !searchResults && <p>Loading...</p>}
			{searchResults && (
				<>
					{searchResults.length > 0 && (
						<p>
							{searchResults.length} result{searchResults.length !== 1 && "s"}
						</p>
					)}
					<div className="list">{listOfUsers(searchResults)}</div>
				</>
			)}
			{!searchResults && dataList && <div className="list">{listOfUsers(dataList)}</div>}
		</div>
	);
};

export default UnfollowersPanel;
