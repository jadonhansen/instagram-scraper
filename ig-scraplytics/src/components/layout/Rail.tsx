import { FunctionComponent } from "react";
import { FaHouse, FaUserGroup, FaDownload, FaListUl } from "react-icons/fa6";

interface Props {
	onOpenAccounts(): void;
	onOpenScrape(): void;
	onOpenFollowers(): void;
}

const Rail: FunctionComponent<Props> = ({ onOpenAccounts, onOpenScrape, onOpenFollowers }) => {
	const items = [
		{ label: "Dashboard", icon: <FaHouse />, onClick: undefined, active: true },
		{ label: "Accounts", icon: <FaUserGroup />, onClick: onOpenAccounts, active: false },
		{ label: "Followers and following", icon: <FaListUl />, onClick: onOpenFollowers, active: false },
		{ label: "Scrape", icon: <FaDownload />, onClick: onOpenScrape, active: false },
	];

	return (
		<nav className="rail" aria-label="Main">
			<div className="brand">
				<span className="brand-mark" aria-hidden="true">
					IG
				</span>
				<span className="brand-text">
					<span className="brand-name">Scraplytics</span>
					<span className="brand-sub">Dashboard</span>
				</span>
			</div>

			<ul className="rail-items">
				{items.map((item) => (
					<li key={item.label}>
						<button
							type="button"
							className={"rail-button" + (item.active ? " rail-button-active" : "")}
							aria-label={item.label}
							aria-current={item.active ? "page" : undefined}
							title={item.label}
							onClick={item.onClick}
						>
							{item.icon}
						</button>
					</li>
				))}
			</ul>
		</nav>
	);
};

export default Rail;
