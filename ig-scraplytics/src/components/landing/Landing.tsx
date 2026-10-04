import { FunctionComponent } from "react";

import "../../styles/landing.css";

interface Props {
	onAddAccount(): void;
}

const stats = [
	{
		title: "Ghost followers",
		body: "People who follow you but never like anything you post.",
	},
	{
		title: "Fans",
		body: "People who like your posts without following you.",
	},
	{
		title: "Unfollowers",
		body: "Accounts you follow that don't follow you back.",
	},
	{
		title: "Account score",
		body: "The share of your followers who actually engage.",
	},
];

const steps = [
	{
		title: "Add your account",
		body: "Enter your Instagram username. Nothing is posted or changed on your profile.",
	},
	{
		title: "Scrape in your own browser",
		body: "Chrome opens on your machine and you log in there. The app reads your follower lists at a slow, human pace.",
	},
	{
		title: "Read your stats",
		body: "Your dashboard sorts everyone into followers, fans, ghosts and unfollowers, ready to search.",
	},
];

const Landing: FunctionComponent<Props> = ({ onAddAccount }) => {
	return (
		<div className="landing">
			<header className="landing-header">
				<img src="/app-icon.svg" alt="" width={40} height={40} />
				<span className="landing-brand">IG Scraplytics</span>
			</header>

			<main>
				<section className="landing-hero">
					<div className="landing-hero-text">
						<h1>See who really engages with your Instagram.</h1>
						<p>
							Find the followers who never interact, the fans who don't follow back, and the accounts that
							stopped following you. Everything runs locally from your own logged-in browser.
						</p>
						<button type="button" className="button button-primary landing-cta" onClick={onAddAccount}>
							Add your account
						</button>
					</div>

					<figure className="landing-preview" aria-label="Example account score">
						<p className="landing-preview-label">Example</p>
						<svg viewBox="0 0 300 170" className="landing-gauge" aria-hidden="true">
							{Array.from({ length: 41 }, (_, i) => {
								const fraction = i / 40;
								const angle = Math.PI * (1 - fraction);
								const long = i % 5 === 0;
								const r1 = 120;
								const r2 = long ? 98 : 106;
								return (
									<line
										key={i}
										x1={150 + r2 * Math.cos(angle)}
										y1={150 - r2 * Math.sin(angle)}
										x2={150 + r1 * Math.cos(angle)}
										y2={150 - r1 * Math.sin(angle)}
										className={fraction <= 0.62 ? "tick tick-lit" : "tick"}
									/>
								);
							})}
						</svg>
						<p className="landing-preview-value">62%</p>
						<figcaption>of followers liked at least one post</figcaption>
					</figure>
				</section>

				<section className="landing-section" aria-labelledby="landing-stats-heading">
					<h2 id="landing-stats-heading">What you'll see</h2>
					<ul className="landing-stats">
						{stats.map((stat) => (
							<li key={stat.title}>
								<h3>{stat.title}</h3>
								<p>{stat.body}</p>
							</li>
						))}
					</ul>
				</section>

				<section className="landing-section" aria-labelledby="landing-steps-heading">
					<h2 id="landing-steps-heading">How it works</h2>
					<ol className="landing-steps">
						{steps.map((step) => (
							<li key={step.title}>
								<h3>{step.title}</h3>
								<p>{step.body}</p>
							</li>
						))}
					</ol>
				</section>

				<section className="landing-closing">
					<p>Your login stays in a Chrome profile on this computer. Nothing is sent anywhere else.</p>
					<button type="button" className="button button-primary" onClick={onAddAccount}>
						Add your account
					</button>
				</section>
			</main>
		</div>
	);
};

export default Landing;
