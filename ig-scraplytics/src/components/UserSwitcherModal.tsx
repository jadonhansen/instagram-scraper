import { FunctionComponent, useState } from "react";
import { useUserManager } from "../context/UserContext";
import "../styles/modal.css";
import "../styles/switcherModal.css";

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

	const addInstagramUser = () => {
		if (loading) return;
		setInputError(undefined);

		if (inputText && inputText.length > 0) {
			if (users?.includes(inputText)) setInputError("This user already exists.");
			else {
				setLoading(true);
				// TODO: API CALL
				addUser(inputText);
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
							<button onClick={() => addInstagramUser()}>Add</button>
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
