import { FunctionComponent } from "react";

interface Props {}

const UnfollowersPanel: FunctionComponent<Props> = () => {
	return (
		<div className="panel">
			<h4>Unfollowers</h4>
			<p>Users who do not follow you back.</p>
		</div>
	);
};

export default UnfollowersPanel;
