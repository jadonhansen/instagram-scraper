import React, { ReactNode, useContext, useEffect, useState } from "react";
import { getInstagramUsers } from "../api/instagramServer";

interface UserContext {
	selectedUser: string | undefined;
	users: string[] | undefined;
	serverError: Error | undefined;
	// bumped after a scrape rewrites the selected user's files, so panels refetch
	dataVersion: number;
	addUser(user: string): void;
	refreshData(): void;
	setSelectedUser(user: string): void;
}

const context: UserContext = {
	selectedUser: undefined,
	users: undefined,
	serverError: undefined,
	dataVersion: 0,
	addUser: () => {},
	refreshData: () => {},
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
	const [dataVersion, setDataVersion] = useState(0);

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
		setServerError(undefined);
	}

	function refreshData() {
		setDataVersion((version) => version + 1);
	}

	return (
		<UserManager.Provider
			value={{
				selectedUser: selectedUser,
				users: users,
				serverError: serverError,
				dataVersion: dataVersion,
				addUser: addUser,
				refreshData: refreshData,
				setSelectedUser: setSelectedUser,
			}}
		>
			{children}
		</UserManager.Provider>
	);
}
