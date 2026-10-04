import { FunctionComponent, useEffect, useState } from "react";

import { useUserManager } from "../context/UserContext";
import { getScrapeJob, startScrape, stopScrape } from "../api/instagramServer";
import { ScrapeJob } from "../types/types";
import "../styles/modal.css";
import "../styles/switcherModal.css";
import "../styles/scrapeModal.css";
import { useCloseOnEscape } from "../hooks/useCloseOnEscape";

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
	const { phase, fetched, total } = job.progress;

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
	useCloseOnEscape(modalOpen, closeModal);
	const { users, selectedUser, addUser, setSelectedUser, refreshData } = useUserManager();

	const [inputText, setInputText] = useState<string>(readLastUsername);
	// never persisted: it is a live Instagram login
	const [sessionId, setSessionId] = useState<string>("");
	const [job, setJob] = useState<ScrapeJob | undefined>();
	const [requestError, setRequestError] = useState<string | undefined>();
	const [stopping, setStopping] = useState(false);

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
		setStopping(false);
		setJob(data);
	};

	const stop = async () => {
		if (!job || stopping) return;
		setStopping(true);

		const { error } = await stopScrape(job.id);
		if (error) {
			setRequestError(`Could not stop the scrape: ${error.message}`);
			setStopping(false);
		}
	};

	const progressPercent =
		job && job.progress.total > 0 ? Math.min(100, (job.progress.fetched / job.progress.total) * 100) : 0;

	return (
		modalOpen && (
			<div
				className="modal-container"
				// clicks on the dimmed backdrop close the modal; clicks inside the panel do not
				onClick={(e) => e.target === e.currentTarget && closeModal()}
			>
				<div className="modal">
					<button type="button" aria-label="Close" onClick={() => closeModal()} className="close">
						&times;
					</button>

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
								aria-label="Instagram username to scrape"
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
								aria-label="Instagram sessionid cookie"
								disabled={running}
								onChange={(e) => setSessionId(e.target.value.trim())}
							></input>
						</div>

						{job && (
							<div className="scrape-status">
								<p className="sub-heading">{job.username}</p>

								{job.status === "running" && (
									<>
										<p>{stopping ? "Stopping..." : describeProgress(job)}</p>
										{job.progress.message && !stopping && (
											<p className="info">{job.progress.message}</p>
										)}
										<div className="progress-track">
											<div className="progress-fill" style={{ width: `${progressPercent}%` }} />
										</div>
										<button className="stop-button" disabled={stopping} onClick={() => stop()}>
											Stop
										</button>
									</>
								)}

								{job.status === "done" && (
									<p>
										Done. Saved {job.summary?.followers ?? 0} followers and{" "}
										{job.summary?.following ?? 0} following. The panels now show this account.
									</p>
								)}

								{job.status === "cancelled" && <p>{job.error?.message}</p>}

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
