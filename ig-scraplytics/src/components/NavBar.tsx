import { FunctionComponent } from "react";
import icon from "../assets/scraper-icon-dark-mode.svg";

import "../styles/navbar.css";

interface Props {}

const NavBar: FunctionComponent<Props> = () => {
	return (
		<header>
			<img src={icon} className="app-icon" />
			<h2>IG Scraplytics</h2>
		</header>
	);
};

export default NavBar;
