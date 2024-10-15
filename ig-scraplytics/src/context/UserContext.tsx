import React, { ReactNode, useContext, useState } from "react";

interface UserContext {
	selectedUser: string | undefined;
	users: string[] | undefined;
	addUser(user: string): void;
	setSelectedUser(user: string): void;
}

const context: UserContext = {
	selectedUser: undefined,
	users: undefined,
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
				addUser: addUser,
				setSelectedUser: setSelectedUser,
			}}
		>
			{children}
		</UserManager.Provider>
	);
}
