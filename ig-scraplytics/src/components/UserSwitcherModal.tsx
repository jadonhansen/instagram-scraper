import { FaUser } from "react-icons/fa";
import { FunctionComponent, useState } from "react";

import { useUserManager } from "../context/UserContext";
import "../styles/modal.css";
import "../styles/switcherModal.css";
import { addInstagramUser } from "../api/instagramServer";

interface Props {
	modalOpen: boolean;
	closeModal(): void;
}

const UserSwitcherModal: FunctionComponent<Props> = ({ modalOpen, closeModal }) => {
	const { users, selectedUser, serverError, setSelectedUser, addUser } = useUserManager();

	const [inputText, setInputText] = useState<string>("");
	const [inputError, setInputError] = useState<string | undefined>();
	const [loading, setLoading] = useState(false);

	const selectUser = (user: string) => {
		if (selectedUser === user) return;

		setSelectedUser(user);
		setInputError(undefined);
		setInputText("");
		closeModal();
	};

	const add = async () => {
		if (loading) return;
		setInputError(undefined);

		if (inputText && inputText.length > 0) {
			if (users?.includes(inputText)) setInputError("This user already exists.");
			else {
				setLoading(true);
				const { error, data } = await addInstagramUser(inputText);

				if (data) {
					addUser(inputText);
					setInputText("");
				}

				if (error) {
					setInputError(`Oops! Error adding user: ${error}`);
				}

				setLoading(false);
			}
		}
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

						<div className="add-user-section">
							<p className="sub-heading">Add a user</p>
							<input
								className="search-input"
								type="text"
								value={inputText}
								placeholder="Username"
								onChange={(e) => setInputText(e.target.value.trim())}
							></input>
							<button onClick={() => add()}>Add</button>
							{inputError && <p className="error">{inputError}</p>}
						</div>

						<p className="sub-heading">Current users</p>

						{serverError !== undefined ? (
							<p className="error">{serverError.message}</p>
						) : users && users.length > 0 ? (
							users.map((user: string, i: number) => {
								return (
									<p
										key={i}
										className={selectedUser === user ? "selected-username" : "username"}
										onClick={() => selectUser(user)}
									>
										<FaUser />
										{user}
									</p>
								);
							})
						) : (
							<p>Loading...</p>
						)}
					</div>
				</div>
			</div>
		)
	);
};

export default UserSwitcherModal;
