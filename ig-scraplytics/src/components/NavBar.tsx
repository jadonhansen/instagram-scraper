import { FunctionComponent, useState } from "react";
import { FaUser } from "react-icons/fa";
import { FaTrowelBricks, FaDownload } from "react-icons/fa6";

import { useUserManager } from "../context/UserContext";
import UserSwitcherModal from "./UserSwitcherModal";
import ScrapeModal from "./ScrapeModal";
import "../styles/navbar.css";

interface Props {}

const NavBar: FunctionComponent<Props> = () => {
	const { selectedUser, users } = useUserManager();
	const [showUserSwitcherModal, setShowUserSwitcherModal] = useState(false);
	const [showScrapeModal, setShowScrapeModal] = useState(false);

	return (
		<header>
			<UserSwitcherModal modalOpen={showUserSwitcherModal} closeModal={() => setShowUserSwitcherModal(false)} />
			<ScrapeModal modalOpen={showScrapeModal} closeModal={() => setShowScrapeModal(false)} />

			<div className="icon">
				<FaTrowelBricks />
				<h2>IG Scraplytics</h2>
			</div>
			<div className="links">
				<h4 onClick={() => setShowScrapeModal(true)}>
					<FaDownload />
					Scrape
				</h4>
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
