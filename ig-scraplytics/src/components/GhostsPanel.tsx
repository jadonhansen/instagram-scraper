import { FunctionComponent } from "react";

interface Props {}

const GhostsPanel: FunctionComponent<Props> = () => {
	return (
		<div className="panel">
			<h4>Ghost Followers</h4>
			<p>Users who follow you but do not engage with your content.</p>
		</div>
	);
};

export default GhostsPanel;
