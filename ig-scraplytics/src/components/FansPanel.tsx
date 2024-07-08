import { FunctionComponent, ReactNode, useEffect, useState } from "react";
import { getFans } from "../api/instagramServer";

interface Props {}

const FansPanel: FunctionComponent<Props> = () => {
	const [dataList, setDataList] = useState<string[] | undefined>(undefined);
	const [serverError, setServerError] = useState<Error | undefined>(undefined);

	useEffect(() => {
		getData();
	}, []);

	const getData = async () => {
		const { data, error } = await getFans();

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
			<h4>Fans {dataList && "(" + dataList.length + ")"}</h4>
			<p className="info">Users who do not follow you but engage with your content.</p>

			{dataList !== undefined ? (
				<div className="list">{listOfUsers(dataList)}</div>
			) : serverError !== undefined ? (
				<p>Error {JSON.stringify(serverError)}</p>
			) : (
				<p>Loading...</p>
			)}
		</div>
	);
};

export default FansPanel;
