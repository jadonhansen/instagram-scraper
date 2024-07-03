import { FunctionComponent, ReactNode, useEffect, useState } from "react";
import { getGhostFollowers } from "../api/instagramServer";

interface Props {}

const GhostsPanel: FunctionComponent<Props> = () => {
	const [dataList, setDataList] = useState<string[] | undefined>(undefined);
	const [serverError, setServerError] = useState<Error | undefined>(undefined);

	useEffect(() => {
		getData();
	}, []);

	const getData = async () => {
		const res = await getGhostFollowers();

		if (Array.isArray(res)) setDataList(res);
		else setServerError(res);
	};

	const listOfUsers = (list: string[]): ReactNode => {
		const arr: ReactNode[] = list.map((item) => {
			return <p className="username">{item}</p>;
		});

		if (arr.length > 0) return arr;
		return <p>No users found.</p>;
	};

	return (
		<div className="panel">
			<h4>Ghost Followers</h4>
			<p>Users who follow you but do not engage with your content.</p>

			{dataList !== undefined ? (
				<div className="fans-list">{listOfUsers(dataList)}</div>
			) : serverError !== undefined ? (
				<p>Error {JSON.stringify(serverError)}</p>
			) : (
				<p>Loading...</p>
			)}
		</div>
	);
};

export default GhostsPanel;
