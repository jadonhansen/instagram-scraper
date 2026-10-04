import { FunctionComponent } from "react";

import { LoadState } from "./Card";
import { formatCount } from "../../utils/format";
import { isReady, Loadable } from "../../hooks/useAccountStats";
import { UserPostRelationship } from "../../types/types";

interface Props {
	followers: Loadable<UserPostRelationship[]>;
}

const tickCount = 41;
const radius = 120;
const center = { x: 150, y: 150 };

// angle 180deg (left) to 0deg (right) along the top half of the circle
function pointOnArc(fraction: number, r: number) {
	const angle = Math.PI * (1 - fraction);
	return { x: center.x + r * Math.cos(angle), y: center.y - r * Math.sin(angle) };
}

const ScoreGauge: FunctionComponent<Props> = ({ followers }) => {
	const ready = isReady(followers);
	const engaged = ready ? followers.filter((f) => f.numberOfPostsLiked > 0).length : 0;
	const hasLikes = engaged > 0;
	const score = ready && hasLikes ? Math.round((engaged / followers.length) * 100) : undefined;
	const litTicks = score === undefined ? 0 : Math.round((score / 100) * (tickCount - 1)) + 1;
	const needle = pointOnArc(score === undefined ? 0 : score / 100, radius - 34);

	return (
		<section className="card gauge-card" aria-label="Account score">
			<header className="card-header">
				<h2 className="card-title">Account score</h2>
			</header>

			<LoadState value={followers} />

			{ready && (
				<div className="gauge">
					<svg
						viewBox="0 0 300 170"
						className="gauge-svg"
						role="img"
						aria-label={score === undefined ? "No score yet" : `${score}% of followers engage`}
					>
						{Array.from({ length: tickCount }, (_, i) => {
							const fraction = i / (tickCount - 1);
							const outer = pointOnArc(fraction, radius);
							const inner = pointOnArc(fraction, radius - (i % 5 === 0 ? 22 : 14));
							return (
								<line
									key={i}
									x1={inner.x}
									y1={inner.y}
									x2={outer.x}
									y2={outer.y}
									className={i < litTicks ? "gauge-tick gauge-tick-lit" : "gauge-tick"}
								/>
							);
						})}
						{score !== undefined && (
							<line x1={center.x} y1={center.y} x2={needle.x} y2={needle.y} className="gauge-needle" />
						)}
					</svg>

					<p className="gauge-value">{score === undefined ? "No data" : `${score}%`}</p>
					<p className="gauge-label">Engaged followers</p>
					<p className="stat-caption gauge-caption">
						{score === undefined
							? "Appears once post likes have been scraped."
							: `${formatCount(engaged)} of ${formatCount(followers.length)} followers liked at least one scraped post.`}
					</p>
				</div>
			)}
		</section>
	);
};

export default ScoreGauge;
