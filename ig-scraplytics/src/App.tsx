import OverviewPanel from "./components/OverviewPanel.tsx";
import FansPanel from "./components/FansPanel.tsx";
import GhostsPanel from "./components/GhostsPanel.tsx";
import UnfollowersPanel from "./components/UnfollowersPanel.tsx";

import "./styles/panels.css";
import NavBar from "./components/NavBar.tsx";

function App() {
	return (
		<div className="app-container">
			<NavBar></NavBar>

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
