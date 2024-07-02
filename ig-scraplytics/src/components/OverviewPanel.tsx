import { FunctionComponent } from "react";

interface Props {}

const OverviewPanel: FunctionComponent<Props> = () => {
	return (
		<div className="panel">
			<h3>Overview</h3>
			<p>profile photo, following counts, account score %</p>
		</div>
	);
};

export default OverviewPanel;
