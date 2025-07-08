import { useState, useEffect, useRef } from "react";
import "../../styles/main.scss";

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
	const isInitializing = useRef(true);
	const [draggedIndex, setDraggedIndex] = useState(null);

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
				} catch (e) {
					console.error("Failed to parse planet data:", e);
					const initial = [];
					setLocalData(initial);
				}
			} else {
				const initial = [];
				setLocalData(initial);
			}
		}
		isInitializing.current = true;
	}, [data]);

	// Save to localStorage and update parent when data changes
	useEffect(() => {
		localStorage.setItem("voyage-planet-data", JSON.stringify(localData));

		// Only call onChange after initial load is complete
		if (!isInitializing.current) {
			onChange(localData);
		} else {
			isInitializing.current = false;
		}
	}, [localData]); // Removed onChange from dependencies to prevent infinite loop

	const addPlanet = (planet) => {
		if (!localData.includes(planet)) {
			setLocalData((prev) => [...prev, planet]);
		}
	};

	const removePlanet = (index) => {
		setLocalData((prev) => prev.filter((_, i) => i !== index));
	};

	const reorderPlanets = (fromIndex, toIndex) => {
		setLocalData((prev) => {
			const newData = [...prev];
			const planet = newData.splice(fromIndex, 1)[0];
			newData.splice(toIndex, 0, planet);
			return newData;
		});
	};

	const handleDragStart = (e, index) => {
		setDraggedIndex(index);
		e.dataTransfer.effectAllowed = "move";
	};

	const handleDragOver = (e) => {
		e.preventDefault();
		e.dataTransfer.dropEffect = "move";
	};

	const handleDrop = (e, dropIndex) => {
		e.preventDefault();
		if (draggedIndex !== null && draggedIndex !== dropIndex) {
			reorderPlanets(draggedIndex, dropIndex);
		}
		setDraggedIndex(null);
	};

	const handleDragEnd = () => {
		setDraggedIndex(null);
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
		// Always add Sun at the end (step 9)
		order.push("Sun");
		return order;
	};

	const displayOrder = getDisplayOrder();

	return (
		<div className="section-card">
			<div className="section-header">
				<h3>
					<span className="section-title__full">Planet Order</span>
					<span className="section-title__short">Planets</span>
				</h3>
				<div className="section-status">
					<span className="section-status__full">
						{localData.length}/8 planets ordered
					</span>
					<span className="section-status__short">{localData.length}/8</span>
				</div>
			</div>

			<p className="section-description">
				Record the order of planets as they appear. Sun is automatically added
				as the final step.
			</p>

			{/* Available planets - only show when there are planets available */}
			{getAvailablePlanets().length > 0 && (
				<div className="available-planets">
					<h4>Available Planets:</h4>
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
				</div>
			)}

			{/* Current planet order */}
			<div className="planet-order">
				<h4>Current Order:</h4>
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
								} ${
									draggedIndex === index ? "planet-order-item--dragging" : ""
								}`}
								draggable={!isLastSun}
								onDragStart={(e) => !isLastSun && handleDragStart(e, index)}
								onDragOver={handleDragOver}
								onDrop={(e) => handleDrop(e, index)}
								onDragEnd={handleDragEnd}
								onClick={() => !isLastSun && removePlanet(index)}
								title={
									isLastSun
										? "Sun (Final step)"
										: "Click to remove, drag to reorder"
								}
							>
								<span className="planet-number">{displayNumber}</span>
								<div className="planet-info">
									<span className="planet-name">
										{planet} - {PLANET_LOCATIONS[planet]}
									</span>
								</div>
								{!isLastSun && (
									<div className="planet-actions">
										<span className="drag-handle">⋮⋮</span>
									</div>
								)}
							</div>
						);
					})}
				</div>
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
