import { FunctionComponent } from "react";

import Card, { LoadState } from "./Card";
import { formatCount } from "../../utils/format";
import { isReady, Loadable } from "../../hooks/useAccountStats";
import { UserPostRelationship } from "../../types/types";

interface Props {
	followers: Loadable<UserPostRelationship[]>;
	onOpenList(): void;
}

const buckets: { label: string; matches(likes: number): boolean }[] = [
	{ label: "0", matches: (likes) => likes === 0 },
	{ label: "1", matches: (likes) => likes === 1 },
	{ label: "2-4", matches: (likes) => likes >= 2 && likes <= 4 },
	{ label: "5-9", matches: (likes) => likes >= 5 && likes <= 9 },
	{ label: "10+", matches: (likes) => likes >= 10 },
];

const FollowersCard: FunctionComponent<Props> = ({ followers, onOpenList }) => {
	const ready = isReady(followers);
	const counts = ready
		? buckets.map((bucket) => followers.filter((f) => bucket.matches(f.numberOfPostsLiked)).length)
		: [];
	const max = Math.max(1, ...counts);
	const hasLikes = ready && followers.some((f) => f.numberOfPostsLiked > 0);

	return (
		<Card
			title="Followers"
			meta={
				<button type="button" className="link-button" onClick={onOpenList}>
					View all
				</button>
			}
		>
			<LoadState value={followers} />
			{ready && (
				<div className="stat-body">
					<div>
						<p className="stat-value">{formatCount(followers.length)}</p>
						<p className="stat-caption">Accounts following you</p>
					</div>

					{hasLikes ? (
						<figure className="histogram" aria-label="Followers by number of posts liked">
							<div className="histogram-bars">
								{counts.map((count, i) => (
									<div key={buckets[i].label} className="histogram-column">
										<span className="histogram-count">{formatCount(count)}</span>
										<div
											className="histogram-bar"
											style={{ height: `${Math.max(4, (count / max) * 100)}%` }}
										/>
										<span className="histogram-label">{buckets[i].label}</span>
									</div>
								))}
							</div>
							<figcaption className="stat-caption">Posts liked</figcaption>
						</figure>
					) : (
						<p className="stat-caption stat-aside">No post likes yet, so engagement is unknown.</p>
					)}
				</div>
			)}
		</Card>
	);
};

export default FollowersCard;
