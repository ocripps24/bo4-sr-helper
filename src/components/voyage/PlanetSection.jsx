import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
	DndContext,
	closestCenter,
	KeyboardSensor,
	PointerSensor,
	TouchSensor,
	MouseSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
	useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
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

// Sortable Planet Item Component
function SortablePlanetItem({
	planet,
	index,
	displayNumber,
	isLastSun,
	isLastPlanet,
	onRemove,
}) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id: planet });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			className={`planet-order-item ${isLastSun ? "planet-final" : ""} ${
				isDragging ? "planet-order-item--dragging" : ""
			}`}
			title={isLastSun ? "Sun (Final step)" : "Drag to reorder"}
		>
			<span className="planet-number">{displayNumber}</span>
			<div className="planet-info">
				<span className="planet-name">
					{planet} - {PLANET_LOCATIONS[planet]}
				</span>
			</div>
			{!isLastSun && (
				<div className="planet-actions">
					<button
						className="drag-handle"
						{...attributes}
						{...listeners}
						title="Drag to reorder"
						type="button"
					>
						⋮⋮
					</button>
					{isLastPlanet && (
						<button
							onClick={() => onRemove(index)}
							className="delete-btn"
							title="Remove last planet"
							type="button"
						>
							✕
						</button>
					)}
				</div>
			)}
		</div>
	);
}

function PlanetSection({ data, onChange }) {
	const [localData, setLocalData] = useState(data);
	const isInitializing = useRef(true);

	// Configure sensors for @dnd-kit
	const sensors = useSensors(
		useSensor(MouseSensor, {
			activationConstraint: {
				distance: 5, // Small distance for mouse
			},
		}),
		useSensor(TouchSensor, {
			activationConstraint: {
				delay: 250, // 250ms delay for touch
				tolerance: 5, // 5px tolerance during delay
			},
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

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

	const addPlanet = useCallback(
		(planet) => {
			if (!localData.includes(planet)) {
				setLocalData((prev) => [...prev, planet]);
			}
		},
		[localData]
	);

	const removePlanet = useCallback((index) => {
		setLocalData((prev) => prev.filter((_, i) => i !== index));
	}, []);

	const handleDragEnd = useCallback((event) => {
		const { active, over } = event;

		if (active.id !== over?.id) {
			setLocalData((items) => {
				const oldIndex = items.indexOf(active.id);
				const newIndex = items.indexOf(over.id);

				return arrayMove(items, oldIndex, newIndex);
			});
		}
	}, []);

	const clearAll = useCallback(() => {
		setLocalData([]);
	}, []);

	const availablePlanets = useMemo(() => {
		return PLANETS.filter((planet) => !localData.includes(planet));
	}, [localData]);

	// Get display order with Sun automatically added at the end
	const displayOrder = useMemo(() => {
		const order = [...localData];
		// Always add Sun at the end (step 9)
		order.push("Sun");
		return order;
	}, [localData]);

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
			{availablePlanets.length > 0 && (
				<div className="available-planets">
					<h4>Available Planets:</h4>
					<div className="planet-grid">
						{availablePlanets.map((planet) => (
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
				<DndContext
					sensors={sensors}
					collisionDetection={closestCenter}
					onDragEnd={handleDragEnd}
				>
					<SortableContext
						items={localData}
						strategy={verticalListSortingStrategy}
					>
						<div className="planet-order-list">
							{displayOrder.map((planet, index) => {
								const isLastSun =
									planet === "Sun" && index === displayOrder.length - 1;
								const isLastPlanet =
									!isLastSun && index === localData.length - 1; // Last user-added planet
								// For Sun, always show 9 regardless of current index
								const displayNumber = isLastSun ? 9 : index + 1;

								return (
									<SortablePlanetItem
										key={planet}
										planet={planet}
										index={index}
										displayNumber={displayNumber}
										isLastSun={isLastSun}
										isLastPlanet={isLastPlanet}
										onRemove={removePlanet}
									/>
								);
							})}
						</div>
					</SortableContext>
				</DndContext>
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
