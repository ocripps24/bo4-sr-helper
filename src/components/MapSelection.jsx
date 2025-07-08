import { Link } from "react-router-dom";
import "../styles/main.scss";

const maps = [
	{
		id: "voyage-of-despair",
		name: "Voyage of Despair",
		description: "Track clocks, outlets, and planet order",
		route: "/voyage-of-despair",
		available: true,
	},
	{
		id: "blood-of-the-dead",
		name: "Blood of the Dead",
		description: "Coming soon",
		route: "/blood-of-the-dead",
		available: false,
	},
	{
		id: "ix",
		name: "IX",
		description: "Coming soon",
		route: "/ix",
		available: false,
	},
];

function MapSelection() {
	return (
		<div className="map-selection">
			<div className="map-selection-header">
				<h2>Select a Map</h2>
				<p>
					Choose which BO4 Zombies map you want to track data for during your
					speedrun.
				</p>
			</div>

			<div className="map-grid">
				{maps.map((map) => (
					<div
						key={map.id}
						className={`map-card ${!map.available ? "map-card--disabled" : ""}`}
					>
						{map.available ? (
							<Link to={map.route} className="map-card-link">
								<div className="map-card-content">
									<h3 className="map-card-title">{map.name}</h3>
									<p className="map-card-description">{map.description}</p>
									<div className="map-card-arrow">→</div>
								</div>
							</Link>
						) : (
							<div className="map-card-content">
								<h3 className="map-card-title">{map.name}</h3>
								<p className="map-card-description">{map.description}</p>
								<div className="map-card-status">Coming Soon</div>
							</div>
						)}
					</div>
				))}
			</div>
		</div>
	);
}

export default MapSelection;
