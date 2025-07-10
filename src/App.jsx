import { Routes, Route, useLocation } from "react-router-dom";
import MapSelection from "./components/MapSelection";
import VoyageOfDespair from "./components/VoyageOfDespair";
import NotFound from "./components/NotFound";
import "./styles/main.scss";

function App() {
	const location = useLocation();

	// Determine the current page title based on the route
	const getPageTitle = () => {
		if (location.pathname.includes("/voyage-of-despair")) {
			return "Voyage of Despair";
		}
		return "BO4 Speedrun Helper";
	};

	return (
		<div className="app">
			<header className="app-header">
				<h1>{getPageTitle()}</h1>
			</header>

			<main className="app-main">
				<Routes>
					<Route path="/" element={<MapSelection />} />
					<Route path="/voyage-of-despair/*" element={<VoyageOfDespair />} />
					<Route path="*" element={<NotFound />} />
				</Routes>
			</main>
		</div>
	);
}

export default App;
