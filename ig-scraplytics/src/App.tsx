import OverviewPanel from "./components/OverviewPanel.tsx";
import FansPanel from "./components/FansPanel.tsx";
import GhostsPanel from "./components/GhostsPanel.tsx";
import UnfollowersPanel from "./components/UnfollowersPanel.tsx";

import "./styles/panels.css";

function App() {
	return (
		<div className="app-container">
			<h2>IG Scraplytics</h2>

			<div className="grid">
				<div>
					<OverviewPanel></OverviewPanel>
					<FansPanel></FansPanel>
				</div>
				<GhostsPanel></GhostsPanel>
				<UnfollowersPanel></UnfollowersPanel>
			</div>
		</div>
	);
}

export default App;
