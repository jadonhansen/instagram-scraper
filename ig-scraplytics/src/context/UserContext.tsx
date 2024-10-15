import React, { ReactNode, useContext, useEffect, useState } from "react";
import { getInstagramUsers } from "../api/instagramServer";

interface UserContext {
	selectedUser: string | undefined;
	users: string[] | undefined;
	serverError: Error | undefined;
	addUser(user: string): void;
	setSelectedUser(user: string): void;
}

const context: UserContext = {
	selectedUser: undefined,
	users: undefined,
	serverError: undefined,
	addUser: () => {},
	setSelectedUser: () => {},
};

const UserManager = React.createContext(context);

export function useUserManager() {
	return useContext(UserManager);
}

type Props = {
	children?: ReactNode;
};

export function UserProvider({ children }: Props) {
	const [selectedUser, setSelectedUser] = useState<string | undefined>();
	const [users, setUsers] = useState<string[] | undefined>();
	const [serverError, setServerError] = useState<Error | undefined>(undefined);

	useEffect(() => {
		getUsers();
	}, []);

	const getUsers = async () => {
		const { data, error } = await getInstagramUsers();

		if (error) setServerError(error);
		else {
			if (data.length === 0) {
				setServerError(new Error("No users found in the database folder."));
				return;
			}
			setUsers(data);
		}
	};

	function addUser(user: string) {
		const temp = users ? [...users] : [];
		temp.push(user);

		setUsers(temp);
	}

	return (
		<UserManager.Provider
			value={{
				selectedUser: selectedUser,
				users: users,
				serverError: serverError,
				addUser: addUser,
				setSelectedUser: setSelectedUser,
			}}
		>
			{children}
		</UserManager.Provider>
	);
}
