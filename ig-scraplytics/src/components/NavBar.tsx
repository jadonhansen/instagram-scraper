import { FunctionComponent, useState } from "react";
import icon from "../assets/scraper-icon-dark-mode.svg";

import UserSwitcherModal from "./UserSwitcherModal";
import "../styles/navbar.css";

interface Props {}

const NavBar: FunctionComponent<Props> = () => {
	const [showUserSwitcherModal, setShowUserSwitcherModal] = useState(false);

	return (
		<header>
			<UserSwitcherModal modalOpen={showUserSwitcherModal} closeModal={() => setShowUserSwitcherModal(false)} />

			<div className="icon">
				<img src={icon} className="app-icon" />
				<h2>IG Scraplytics</h2>
			</div>
			<div className="links">
				<h4 onClick={() => setShowUserSwitcherModal(true)}>Switch User</h4>
			</div>
		</header>
	);
};

export default NavBar;
