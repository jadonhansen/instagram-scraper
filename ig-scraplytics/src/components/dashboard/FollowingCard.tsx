import { FunctionComponent } from "react";

import Card, { LoadState } from "./Card";
import { formatCount } from "../../utils/format";
import { isReady, Loadable } from "../../hooks/useAccountStats";

interface Props {
	following: Loadable<string[]>;
	unfollowers: Loadable<string[]>;
	onOpenList(): void;
}

const FollowingCard: FunctionComponent<Props> = ({ following, unfollowers, onOpenList }) => {
	const ready = isReady(following);
	const notBack = isReady(unfollowers) ? unfollowers.length : undefined;
	const followBack = ready && notBack !== undefined ? following.length - notBack : undefined;
	const followBackPercent =
		ready && followBack !== undefined && following.length > 0 ? (followBack / following.length) * 100 : 0;

	return (
		<Card
			title="Following"
			meta={
				<button type="button" className="link-button" onClick={onOpenList}>
					View all
				</button>
			}
		>
			<LoadState value={following} />
			{ready && (
				<div className="stat-body">
					<div>
						<p className="stat-value">{formatCount(following.length)}</p>
						<p className="stat-caption">Accounts you follow</p>
					</div>

					{followBack !== undefined && notBack !== undefined && (
						<div className="split">
							<div
								className="split-bar"
								role="img"
								aria-label={`${followBack} follow you back, ${notBack} do not`}
							>
								<div className="split-fill" style={{ width: `${followBackPercent}%` }} />
							</div>
							<dl className="split-legend">
								<div>
									<dt>
										<span className="swatch swatch-accent" aria-hidden="true" />
										Follow you back
									</dt>
									<dd>{formatCount(followBack)}</dd>
								</div>
								<div>
									<dt>
										<span className="swatch swatch-track" aria-hidden="true" />
										Don't
									</dt>
									<dd>{formatCount(notBack)}</dd>
								</div>
							</dl>
						</div>
					)}
				</div>
			)}
		</Card>
	);
};

export default FollowingCard;
