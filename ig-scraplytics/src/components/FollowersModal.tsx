import { FunctionComponent, ReactNode, useEffect, useState } from "react";
import { getOrderedFollowers } from "../api/instagramServer";

interface Props {}

const FollowersModal: FunctionComponent<Props> = () => {
	const [dataList, setDataList] = useState<string[] | undefined>(undefined);
	const [serverError, setServerError] = useState<Error | undefined>(undefined);

	useEffect(() => {
		getData();
	}, []);

	const getData = async () => {
		const { data, error } = await getOrderedFollowers();

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
			<h4>Ordered Followers</h4>
			<p>Followers are ordered from the most to the least interactive (out of the scraped posts).</p>

			{dataList !== undefined ? (
				<div className="ordered-followers-list">{listOfUsers(dataList)}</div>
			) : serverError !== undefined ? (
				<p>Error {JSON.stringify(serverError)}</p>
			) : (
				<p>Loading...</p>
			)}
		</div>
	);
};

export default FollowersModal;
