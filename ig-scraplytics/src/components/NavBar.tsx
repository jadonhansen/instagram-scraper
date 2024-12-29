import { FunctionComponent, useState } from "react";
import { FaUser } from "react-icons/fa";
import { FaTrowelBricks } from "react-icons/fa6";

import { useUserManager } from "../context/UserContext";
import UserSwitcherModal from "./UserSwitcherModal";
import "../styles/navbar.css";

interface Props {}

const NavBar: FunctionComponent<Props> = () => {
	const { selectedUser, users } = useUserManager();
	const [showUserSwitcherModal, setShowUserSwitcherModal] = useState(false);

	return (
		<header>
			<UserSwitcherModal modalOpen={showUserSwitcherModal} closeModal={() => setShowUserSwitcherModal(false)} />

			<div className="icon">
				<FaTrowelBricks />
				<h2>IG Scraplytics</h2>
			</div>
			<div className="links">
				<h4 onClick={() => setShowUserSwitcherModal(true)}>
					<FaUser />
					{!users && !selectedUser && "Add User"}
					{!selectedUser && users && "Select User"}
					{selectedUser && "Switch User (" + selectedUser + ")"}
				</h4>
			</div>
		</header>
	);
};

export default NavBar;
