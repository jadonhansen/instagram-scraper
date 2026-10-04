import { FunctionComponent, useState } from "react";

import Card, { LoadState } from "./Card";
import { formatCount } from "../../utils/format";
import SearchFeature from "../SearchFeature";
import { isReady, Loadable } from "../../hooks/useAccountStats";

interface Props {
	title: string;
	description: string;
	users: Loadable<string[] | null>;
	noDataMessage?: string;
}

const UserListCard: FunctionComponent<Props> = ({ title, description, users, noDataMessage }) => {
	const [searchResults, setSearchResults] = useState<string[] | undefined>(undefined);

	const list = isReady(users) ? users : undefined;
	const shown = searchResults ?? list ?? [];

	return (
		<Card
			title={title}
			className="list-card"
			meta={list && <span className="count-badge">{formatCount(list.length)}</span>}
		>
			<p className="card-description">{description}</p>

			<LoadState value={users} />

			{users === null && <p className="card-status">{noDataMessage}</p>}

			{list && (
				<>
					<SearchFeature
						label={`Search ${title.toLowerCase()}`}
						searchResults={(res) => setSearchResults(res)}
						searchableList={list}
					/>
					{searchResults && (
						<p className="card-status" aria-live="polite">
							{searchResults.length} result{searchResults.length !== 1 && "s"}
						</p>
					)}
					{shown.length > 0 ? (
						<ul className="name-list">
							{shown.map((user, i) => (
								<li key={user + i}>{user}</li>
							))}
						</ul>
					) : (
						!searchResults && <p className="card-status">No users found.</p>
					)}
				</>
			)}
		</Card>
	);
};

export default UserListCard;
