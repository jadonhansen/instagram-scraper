import { FunctionComponent, ReactNode, useEffect, useState } from "react";
import { getFans } from "../api/instagramServer";
import { useUserManager } from "../context/UserContext";
import SearchFeature from "./SearchFeature";

interface Props {}

const FansPanel: FunctionComponent<Props> = () => {
	const { selectedUser } = useUserManager();

	const [dataList, setDataList] = useState<string[] | undefined>(undefined);
	const [serverError, setServerError] = useState<Error | undefined>(undefined);
	const [searchResults, setSearchResults] = useState<string[] | undefined>(undefined);

	useEffect(() => {
		getData(selectedUser);
	}, [selectedUser]);

	const getData = async (user: string | undefined) => {
		if (!user) return;

		const { data, error } = await getFans(user);

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
		<div className="panel fans-panel">
			<h4>Fans {dataList && "(" + dataList.length + ")"}</h4>
			<p className="info">Users who do not follow you but engage with your content.</p>
			<SearchFeature searchResults={(res) => setSearchResults(res)} searchableList={dataList}></SearchFeature>

			{serverError !== undefined && <p>Error {JSON.stringify(serverError)}</p>}
			{!dataList && !searchResults && !serverError && <p>Loading...</p>}
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

export default FansPanel;
