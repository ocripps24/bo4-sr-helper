import { useState, useEffect } from "react";
import "./ClockSection.css";

const PLANETS = [
	"Mercury",
	"Venus",
	"Moon",
	"Mars",
	"Jupiter",
	"Saturn",
	"Uranus",
	"Neptune",
];

const PLANET_LOCATIONS = {
	Mercury: "Mailrooms",
	Venus: "Millionaire Suite",
	Moon: "Lower Grand Stairs",
	Mars: "Boiler Room",
	Jupiter: "Engine Room",
	Saturn: "Bridge",
	Uranus: "State Rooms",
	Neptune: "Aft Deck",
	Sun: "Forecastle/Spawn",
};

function PlanetSection({ data, onChange }) {
	const [localData, setLocalData] = useState(data);

	// Load from localStorage on mount or when parent data changes (reset)
	useEffect(() => {
		// Check if parent data is empty (indicating a reset)
		const isParentDataEmpty =
			!data || (Array.isArray(data) && data.length === 0);

		if (isParentDataEmpty) {
			// Parent has been reset, check localStorage or use initial data
			const saved = localStorage.getItem("voyage-planet-data");
			if (saved) {
				try {
					const parsedData = JSON.parse(saved);
					setLocalData(parsedData);
					onChange(parsedData);
				} catch (e) {
					console.error("Failed to parse planet data:", e);
					const initial = [];
					setLocalData(initial);
					onChange(initial);
				}
			} else {
				const initial = [];
				setLocalData(initial);
				onChange(initial);
			}
		}
	}, [data]);

	// Save to localStorage and update parent when data changes
	useEffect(() => {
		localStorage.setItem("voyage-planet-data", JSON.stringify(localData));
		onChange(localData);
	}, [localData, onChange]);

	const addPlanet = (planet) => {
		if (!localData.includes(planet)) {
			setLocalData((prev) => [...prev, planet]);
		}
	};

	const removePlanet = (index) => {
		setLocalData((prev) => prev.filter((_, i) => i !== index));
	};

	const movePlanet = (fromIndex, toIndex) => {
		setLocalData((prev) => {
			const newData = [...prev];
			const planet = newData.splice(fromIndex, 1)[0];
			newData.splice(toIndex, 0, planet);
			return newData;
		});
	};

	const clearAll = () => {
		setLocalData([]);
	};

	const getAvailablePlanets = () => {
		return PLANETS.filter((planet) => !localData.includes(planet));
	};

	// Get display order with Sun automatically added at the end
	const getDisplayOrder = () => {
		const order = [...localData];
		// Always add Sun at the end if we have any planets
		if (order.length > 0) {
			order.push("Sun");
		}
		return order;
	};

	const displayOrder = getDisplayOrder();

	return (
		<div className="section-card">
			<div className="section-header">
				<h3>Planet Order</h3>
				<div className="section-status">
					{localData.length}/8 planets ordered
				</div>
			</div>

			<p className="section-description">
				Record the order of planets as they appear. Sun is automatically added
				as the final step.
			</p>

			{/* Available planets */}
			<div className="available-planets">
				<h4>Available Planets:</h4>
				{getAvailablePlanets().length === 0 ? (
					<div className="no-planets">All planets have been added</div>
				) : (
					<div className="planet-grid">
						{getAvailablePlanets().map((planet) => (
							<button
								key={planet}
								onClick={() => addPlanet(planet)}
								className="planet-btn"
							>
								{planet}
							</button>
						))}
					</div>
				)}
			</div>

			{/* Current planet order */}
			<div className="planet-order">
				<h4>Current Order:</h4>
				{displayOrder.length === 0 ? (
					<div className="planet-order-empty">No planets added yet</div>
				) : (
					<div className="planet-order-list">
						{displayOrder.map((planet, index) => {
							const isLastSun =
								planet === "Sun" && index === displayOrder.length - 1;
							// For Sun, always show 9 regardless of current index
							const displayNumber = isLastSun ? 9 : index + 1;
							return (
								<div
									key={`${planet}-${index}`}
									className={`planet-order-item ${
										isLastSun ? "planet-final" : ""
									}`}
								>
									<span className="planet-number">{displayNumber}</span>
									<div className="planet-info">
										<span className="planet-name">
											{planet} - {PLANET_LOCATIONS[planet]}
										</span>
									</div>
									{!isLastSun && (
										<div className="planet-controls">
											{index > 0 && (
												<button
													onClick={() => movePlanet(index, index - 1)}
													className="move-btn"
													aria-label="Move up"
												>
													↑
												</button>
											)}
											{index < localData.length - 1 && (
												<button
													onClick={() => movePlanet(index, index + 1)}
													className="move-btn"
													aria-label="Move down"
												>
													↓
												</button>
											)}
											<button
												onClick={() => removePlanet(index)}
												className="remove-btn"
												aria-label="Remove planet"
											>
												×
											</button>
										</div>
									)}
								</div>
							);
						})}
					</div>
				)}

				{localData.length > 0 && (
					<button onClick={clearAll} className="btn btn-secondary clear-btn">
						Clear All
					</button>
				)}
			</div>
		</div>
	);
}

export default PlanetSection;
