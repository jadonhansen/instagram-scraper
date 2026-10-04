import { FunctionComponent } from "react";

import Card, { LoadState } from "./Card";
import { formatCount } from "../../utils/format";
import { isReady, Loadable } from "../../hooks/useAccountStats";

interface Props {
	fans: Loadable<string[]>;
}

const previewCount = 5;

const FansCard: FunctionComponent<Props> = ({ fans }) => {
	const ready = isReady(fans);

	return (
		<Card title="Fans">
			<LoadState value={fans} />
			{ready && (
				<div className="stat-body">
					<div>
						<p className="stat-value">{formatCount(fans.length)}</p>
						<p className="stat-caption">Like your posts but don't follow you</p>
					</div>

					{fans.length > 0 && (
						<ul className="name-list name-list-compact">
							{fans.slice(0, previewCount).map((fan) => (
								<li key={fan}>{fan}</li>
							))}
							{fans.length > previewCount && (
								<li className="name-list-more">+{formatCount(fans.length - previewCount)} more</li>
							)}
						</ul>
					)}
				</div>
			)}
		</Card>
	);
};

export default FansCard;
