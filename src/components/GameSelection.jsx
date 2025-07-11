import { Link } from "react-router-dom";
import { getAvailableGames } from "../data/games";
import "../styles/main.scss";

function GameSelection() {
	const availableGames = getAvailableGames();

	return (
		<div className="game-selection">
			<div className="game-selection-header">
				<h2>Select a Game</h2>
				<p>
					Choose which Call of Duty Zombies game you want to access speedrun
					tools for.
				</p>
			</div>

			<div className="game-grid">
				{availableGames.map((game) => (
					<div key={game.id} className="game-card">
						<Link to={game.route} className="game-card-link">
							<div className="game-card-content">
								<div className="game-card-header">
									<h3 className="game-card-title">{game.name}</h3>
									<span className="game-card-year">{game.releaseYear}</span>
								</div>
								<p className="game-card-description">{game.description}</p>
								<div className="game-card-footer">
									<span className="game-card-full-name">{game.fullName}</span>
									<div className="game-card-arrow">→</div>
								</div>
							</div>
						</Link>
					</div>
				))}
			</div>
		</div>
	);
}

export default GameSelection;
