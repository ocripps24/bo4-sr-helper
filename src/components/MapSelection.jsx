import { Link } from "react-router-dom";
import { getGameById } from "../data/games";
import { BO4_MAPS } from "../data/bo4/maps";
import { BO6_MAPS } from "../data/bo6/maps";
import "../styles/main.scss";

const getMapsByGame = (gameId) => {
	switch (gameId) {
		case "bo4":
			return BO4_MAPS;
		case "bo6":
			return BO6_MAPS;
		default:
			return [];
	}
};

function MapSelection({ gameId }) {
	const game = getGameById(gameId);
	const maps = getMapsByGame(gameId);

	if (!game) {
		return (
			<div className="map-selection">
				<div className="map-selection-header">
					<h2>Game Not Found</h2>
					<p>The requested game could not be found.</p>
					<Link to="/" className="btn btn-primary">
						← Back to Game Selection
					</Link>
				</div>
			</div>
		);
	}
	return (
		<div className="map-selection">
			<div className="map-selection-header">
				<Link to="/" className="btn btn-secondary back-btn">
					← Back to Games
				</Link>
				<h2>Select a {game.name} Map</h2>
				<p>
					Choose which {game.name} Zombies map you want to access speedrun tools
					for.
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
									<div className="map-card-header">
										<h3 className="map-card-title">{map.name}</h3>
										{map.difficulty && (
											<span className={`map-card-difficulty ${map.difficulty}`}>
												{map.difficulty}
											</span>
										)}
									</div>
									<p className="map-card-description">{map.description}</p>
									{map.tools && map.tools.length > 0 && (
										<div className="map-card-tools">
											<span className="tools-label">Tools:</span>
											<span className="tools-list">{map.tools.join(", ")}</span>
										</div>
									)}
									<div className="map-card-arrow">→</div>
								</div>
							</Link>
						) : (
							<div className="map-card-content">
								<div className="map-card-header">
									<h3 className="map-card-title">{map.name}</h3>
									{map.difficulty && (
										<span className={`map-card-difficulty ${map.difficulty}`}>
											{map.difficulty}
										</span>
									)}
								</div>
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
