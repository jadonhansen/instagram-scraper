import { FunctionComponent, useEffect, useState } from "react";
import { getInstagramUsers } from "../api/instagramServer";
import "../styles/modal.css";

interface Props {
	modalOpen: boolean;
	closeModal(): void;
}

const UserSwitcherModal: FunctionComponent<Props> = ({ modalOpen, closeModal }) => {
	const [userList, setUserList] = useState<string[] | undefined>(undefined);
	const [serverError, setServerError] = useState<Error | undefined>(undefined);

	useEffect(() => {
		getData();
	}, []);

	const getData = async () => {
		const { data, error } = await getInstagramUsers();

		if (error) setServerError(error);
		else setUserList(data);
	};

	return (
		modalOpen && (
			<div className="modal-container">
				<div className="modal">
					<span onClick={() => closeModal()} className="close">
						&times;
					</span>

					<div className="content">
						<h4>Users</h4>
						<p className="info">Choose one of your Instagram users to process data from.</p>

						{serverError !== undefined && <p>Error {JSON.stringify(serverError)}</p>}
						{!userList && !serverError && <p>Loading...</p>}

						{userList &&
							userList.length > 0 &&
							userList.map((user: string, i: number) => {
								return (
									<p key={i} className="username">
										{user}
									</p>
								);
							})}

						{userList?.length == 0 && <p>No users found in the database folder.</p>}
					</div>
				</div>
			</div>
		)
	);
};

export default UserSwitcherModal;
