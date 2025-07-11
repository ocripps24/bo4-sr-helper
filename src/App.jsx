import { Routes, Route, useLocation } from "react-router-dom";
import GameSelection from "./components/GameSelection";
import MapSelection from "./components/MapSelection";
import VoyageOfDespair from "./components/games/bo4/maps/voyage-of-despair/VoyageOfDespair";
import Terminus from "./components/games/bo6/maps/terminus/Terminus";
import NotFound from "./components/NotFound";
import { getGameById } from "./data/games";
import "./styles/main.scss";

function App() {
	const location = useLocation();

	// Determine the current page title based on the route
	const getPageTitle = () => {
		const path = location.pathname;

		// Handle specific map pages
		if (path.includes("/voyage-of-despair")) {
			return "Voyage of Despair";
		}
		if (path.includes("/terminus")) {
			return "Terminus";
		}

		// Handle game selection pages
		if (path.startsWith("/bo4")) {
			const game = getGameById("bo4");
			return path === "/bo4" ? `${game.name} - Select Map` : game.name;
		}
		if (path.startsWith("/bo6")) {
			const game = getGameById("bo6");
			return path === "/bo6" ? `${game.name} - Select Map` : game.name;
		}

		// Default
		return "Call of Duty Zombies Speedrun Helper";
	};

	return (
		<div className="app">
			<header className="app-header">
				<h1>{getPageTitle()}</h1>
			</header>

			<main className="app-main">
				<Routes>
					{/* Root - Game Selection */}
					<Route path="/" element={<GameSelection />} />

					{/* BO4 Routes */}
					<Route path="/bo4" element={<MapSelection gameId="bo4" />} />
					<Route
						path="/bo4/voyage-of-despair/*"
						element={<VoyageOfDespair />}
					/>

					{/* BO6 Routes */}
					<Route path="/bo6" element={<MapSelection gameId="bo6" />} />
					<Route path="/bo6/terminus/*" element={<Terminus />} />

					{/* Legacy route redirect for existing bookmarks */}
					<Route path="/voyage-of-despair/*" element={<VoyageOfDespair />} />

					{/* 404 */}
					<Route path="*" element={<NotFound />} />
				</Routes>
			</main>
		</div>
	);
}

export default App;
