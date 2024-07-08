import { FunctionComponent, useState } from "react";
import FollowersModal from "./FollowersModal";

interface Props {}

const OverviewPanel: FunctionComponent<Props> = () => {
	const [showModal, setShowModal] = useState<boolean>(false);

	return (
		<div className="panel">
			<FollowersModal closeModal={() => setShowModal(false)} modalOpen={showModal}></FollowersModal>

			<h3>Overview</h3>
			<p>profile photo, following counts, account score %</p>
			<p onClick={() => setShowModal(true)}>View followers</p>
		</div>
	);
};

export default OverviewPanel;
