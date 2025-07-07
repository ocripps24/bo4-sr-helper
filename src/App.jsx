import { Routes, Route } from "react-router-dom";
import MapSelection from "./components/MapSelection";
import VoyageOfDespair from "./components/VoyageOfDespair";
import "./App.css";

function App() {
	return (
		<div className="app">
			<header className="app-header">
				<h1>BO4 Speedrun Helper</h1>
			</header>

			<main className="app-main">
				<Routes>
					<Route path="/" element={<MapSelection />} />
					<Route path="/voyage-of-despair/*" element={<VoyageOfDespair />} />
				</Routes>
			</main>
		</div>
	);
}

export default App;
