import { FunctionComponent, useEffect, useState } from "react";

import { useUserManager } from "../context/UserContext";
import { getScrapeJob, startScrape } from "../api/instagramServer";
import { ScrapeJob } from "../types/types";
import "../styles/modal.css";
import "../styles/switcherModal.css";
import "../styles/scrapeModal.css";

const lastUsernameKey = "lastScrapeUsername";
const pollIntervalMs = 2000;

interface Props {
	modalOpen: boolean;
	closeModal(): void;
}

function readLastUsername(): string {
	try {
		return localStorage.getItem(lastUsernameKey) ?? "";
	} catch {
		return "";
	}
}

function saveLastUsername(username: string) {
	try {
		localStorage.setItem(lastUsernameKey, username);
	} catch {
		// storage blocked (private window): the field just starts empty next time
	}
}

function describeProgress(job: ScrapeJob): string {
	const { phase, fetched, total, message } = job.progress;
	if (message) return message;

	switch (phase) {
		case "starting":
			return "Opening the browser...";
		case "waiting_for_login":
			return "Log in to Instagram in the Chrome window that just opened. The scrape continues once you are in.";
		case "profile":
			return "Looking up the profile...";
		default:
			return `Scraping ${phase}: ${fetched} of ${total}`;
	}
}

const ScrapeModal: FunctionComponent<Props> = ({ modalOpen, closeModal }) => {
	const { users, selectedUser, addUser, setSelectedUser, refreshData } = useUserManager();

	const [inputText, setInputText] = useState<string>(readLastUsername);
	// never persisted: it is a live Instagram login
	const [sessionId, setSessionId] = useState<string>("");
	const [job, setJob] = useState<ScrapeJob | undefined>();
	const [requestError, setRequestError] = useState<string | undefined>();

	const running = job?.status === "running";

	useEffect(() => {
		if (!job || job.status !== "running") return;

		const timer = setTimeout(async () => {
			const { data, error } = await getScrapeJob(job.id);

			if (error) {
				setRequestError(`Lost track of the scrape: ${error.message}`);
				setJob(undefined);
				return;
			}

			setJob(data);
		}, pollIntervalMs);

		return () => clearTimeout(timer);
	}, [job]);

	useEffect(() => {
		if (job?.status !== "done") return;

		if (!users?.includes(job.username)) addUser(job.username);
		if (selectedUser === job.username) refreshData();
		else setSelectedUser(job.username);
		// only react to the job finishing, not to the user list it updates
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [job?.status]);

	const start = async () => {
		if (running || !inputText) return;
		setRequestError(undefined);

		const { data, error } = await startScrape(inputText, sessionId || undefined);

		if (error) {
			setRequestError(error.message);
			return;
		}

		saveLastUsername(inputText);
		setSessionId("");
		setJob(data);
	};

	const progressPercent =
		job && job.progress.total > 0 ? Math.min(100, (job.progress.fetched / job.progress.total) * 100) : 0;

	return (
		modalOpen && (
			<div className="modal-container">
				<div className="modal">
					<span onClick={() => closeModal()} className="close">
						&times;
					</span>

					<div className="content scrape-content">
						<h4>Scrape</h4>
						<p className="info">
							Scrapes followers and following for an Instagram account through your own logged-in Chrome
							session. A full scrape takes a few minutes because requests are spaced out to avoid rate
							limits. You can close this window while it runs.
						</p>

						<div className="add-user-section">
							<p className="sub-heading">Instagram username</p>
							<input
								className="search-input"
								type="text"
								value={inputText}
								placeholder="Username"
								disabled={running}
								onChange={(e) => setInputText(e.target.value.trim())}
							></input>
							<button disabled={running} onClick={() => start()}>
								Start
							</button>
							{requestError && <p className="error">{requestError}</p>}
						</div>

						<div className="add-user-section">
							<p className="sub-heading">Session from your browser (optional)</p>
							<p className="info session-help">
								Skip the login window by reusing your normal browser&apos;s login. On instagram.com,
								open DevTools, go to Application, then Cookies, then https://www.instagram.com, and copy
								the value of <code>sessionid</code>. You only need this once, or again when the session
								expires.
							</p>
							<input
								className="search-input"
								type="password"
								autoComplete="off"
								value={sessionId}
								placeholder="sessionid cookie"
								disabled={running}
								onChange={(e) => setSessionId(e.target.value.trim())}
							></input>
						</div>

						{job && (
							<div className="scrape-status">
								<p className="sub-heading">{job.username}</p>

								{job.status === "running" && (
									<>
										<p>{describeProgress(job)}</p>
										<div className="progress-track">
											<div className="progress-fill" style={{ width: `${progressPercent}%` }} />
										</div>
									</>
								)}

								{job.status === "done" && (
									<p>
										Done. Saved {job.summary?.followers ?? 0} followers and{" "}
										{job.summary?.following ?? 0} following. The panels now show this account.
									</p>
								)}

								{job.status === "error" && <p className="error">{job.error?.message}</p>}
							</div>
						)}
					</div>
				</div>
			</div>
		)
	);
};

export default ScrapeModal;
