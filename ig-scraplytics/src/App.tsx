import { useState } from "react";
import { FaPlus, FaUserGroup } from "react-icons/fa6";

import Rail from "./components/layout/Rail.tsx";
import FollowersCard from "./components/dashboard/FollowersCard.tsx";
import FollowingCard from "./components/dashboard/FollowingCard.tsx";
import FansCard from "./components/dashboard/FansCard.tsx";
import ScoreGauge from "./components/dashboard/ScoreGauge.tsx";
import UserListCard from "./components/dashboard/UserListCard.tsx";
import FollowersModal from "./components/FollowersModal.tsx";
import ScrapeModal from "./components/ScrapeModal.tsx";
import UserSwitcherModal from "./components/UserSwitcherModal.tsx";
import { UserProvider, useUserManager } from "./context/UserContext.tsx";
import { isReady, useAccountStats } from "./hooks/useAccountStats.ts";

import "./styles/layout.css";
import "./styles/cards.css";

function Dashboard() {
	const { selectedUser, users } = useUserManager();
	const stats = useAccountStats();

	const [accountsOpen, setAccountsOpen] = useState(false);
	const [scrapeOpen, setScrapeOpen] = useState(false);
	const [followersOpen, setFollowersOpen] = useState(false);

	return (
		<div className="app-shell">
			<UserSwitcherModal modalOpen={accountsOpen} closeModal={() => setAccountsOpen(false)} />
			<ScrapeModal modalOpen={scrapeOpen} closeModal={() => setScrapeOpen(false)} />
			<FollowersModal
				modalOpen={followersOpen}
				closeModal={() => setFollowersOpen(false)}
				followersList={isReady(stats.followers) ? stats.followers : undefined}
				followersServerError={stats.followers instanceof Error ? stats.followers : undefined}
				followingList={isReady(stats.following) ? stats.following : undefined}
				followingServerError={stats.following instanceof Error ? stats.following : undefined}
			/>

			<Rail
				onOpenAccounts={() => setAccountsOpen(true)}
				onOpenScrape={() => setScrapeOpen(true)}
				onOpenFollowers={() => setFollowersOpen(true)}
			/>

			<div className="main">
				<header className="topbar">
					<div className="greeting">
						<h1>{selectedUser ? `Hey, ${selectedUser}` : "Hey there"}</h1>
						<p>
							{selectedUser
								? "Who follows you, who engages, and who never followed back."
								: users
									? "Pick an account to see its stats."
									: "Scrape an account to get started."}
						</p>
					</div>

					<div className="topbar-actions">
						<button
							type="button"
							className="icon-button"
							aria-label="Scrape an account"
							title="Scrape an account"
							onClick={() => setScrapeOpen(true)}
						>
							<FaPlus />
						</button>
						<button type="button" className="account-pill" onClick={() => setAccountsOpen(true)}>
							<span className="avatar" aria-hidden="true">
								{selectedUser ? selectedUser[0].toUpperCase() : <FaUserGroup />}
							</span>
							<span className="account-text">
								<span className="account-name">{selectedUser ?? "No account"}</span>
								<span className="account-sub">Switch account</span>
							</span>
						</button>
					</div>
				</header>

				<div className="toolbar">
					<button type="button" className="button button-primary" onClick={() => setScrapeOpen(true)}>
						Scrape
					</button>
				</div>

				{selectedUser ? (
					<main className="dashboard-grid">
						<FollowersCard followers={stats.followers} onOpenList={() => setFollowersOpen(true)} />
						<FollowingCard
							following={stats.following}
							unfollowers={stats.unfollowers}
							onOpenList={() => setFollowersOpen(true)}
						/>
						<FansCard fans={stats.fans} />
						<ScoreGauge followers={stats.followers} />
						<UserListCard
							title="Ghost followers"
							description="Follow you but never liked a scraped post."
							users={stats.ghosts}
							noDataMessage="No data. There are no post likes for this account yet, so ghost followers cannot be worked out."
						/>
						<UserListCard
							title="Unfollowers"
							description="You follow them, they don't follow you back."
							users={stats.unfollowers}
						/>
					</main>
				) : (
					<main className="empty-state">
						<p>{users ? "No account selected." : "No accounts yet."}</p>
						<button
							type="button"
							className="button button-primary"
							onClick={() => (users ? setAccountsOpen(true) : setScrapeOpen(true))}
						>
							{users ? "Choose an account" : "Scrape an account"}
						</button>
					</main>
				)}
			</div>
		</div>
	);
}

function App() {
	return (
		<UserProvider>
			<Dashboard />
		</UserProvider>
	);
}

export default App;
