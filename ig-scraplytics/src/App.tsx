import OverviewPanel from "./components/OverviewPanel.tsx";
import FansPanel from "./components/FansPanel.tsx";
import GhostsPanel from "./components/GhostsPanel.tsx";
import UnfollowersPanel from "./components/UnfollowersPanel.tsx";

import "./styles/panels.css";

function App() {
	return (
		<div className="app-container">
			<h2>IG Scraplytics</h2>
			<OverviewPanel></OverviewPanel>

			<div className="grid">
				<GhostsPanel></GhostsPanel>
				<UnfollowersPanel></UnfollowersPanel>
				<FansPanel></FansPanel>
			</div>
		</div>
	);
}

export default App;
