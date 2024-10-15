import OverviewPanel from "./components/OverviewPanel.tsx";
import FansPanel from "./components/FansPanel.tsx";
import GhostsPanel from "./components/GhostsPanel.tsx";
import UnfollowersPanel from "./components/UnfollowersPanel.tsx";
import NavBar from "./components/NavBar.tsx";
import { UserProvider } from "./context/UserContext.tsx";

import "./styles/panels.css";

function App() {
	return (
		<UserProvider>
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
		</UserProvider>
	);
}

export default App;
