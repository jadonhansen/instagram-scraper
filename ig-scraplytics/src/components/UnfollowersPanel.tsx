import { FunctionComponent, ReactNode, useEffect, useState } from "react";
import { getUnfollowers } from "../api/instagramServer";

interface Props {}

const UnfollowersPanel: FunctionComponent<Props> = () => {
	const [dataList, setDataList] = useState<string[] | undefined>(undefined);
	const [serverError, setServerError] = useState<Error | undefined>(undefined);

	useEffect(() => {
		getData();
	}, []);

	const getData = async () => {
		const { data, error } = await getUnfollowers();

		if (error) setServerError(error);
		else setDataList(data);
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
			<h4>Unfollowers</h4>
			<p>Users who do not follow you back.</p>

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

export default UnfollowersPanel;
