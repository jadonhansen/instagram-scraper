import { FunctionComponent } from "react";

interface Props {}

const FansPanel: FunctionComponent<Props> = () => {
	return (
		<div className="panel">
			<h4>Fans</h4>
			<p>Users who do not follow you but engage with your content.</p>
		</div>
	);
};

export default FansPanel;
