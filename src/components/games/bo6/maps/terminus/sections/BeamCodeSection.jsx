import { useState, useEffect, useRef } from "react";
import { BeamSymbols, SYMBOL_DATA, getSymbolValue } from "./BeamSymbols";

const SYMBOL_LOCATIONS = [
	{ id: "x", name: "X", description: "Laptop with X sticker" },
	{ id: "y", name: "Y", description: "Laptop with Y sticker" },
	{ id: "z", name: "Z", description: "Laptop with Z sticker" },
];

function BeamCodeSection({
	data,
	onChange,
	onNext,
	onPrevious,
	currentStep,
	totalSteps,
}) {
	const [localData, setLocalData] = useState(data || {});
	const isInitializing = useRef(true);

	// Load from localStorage on mount or when parent data changes (reset)
	useEffect(() => {
		// Check if parent data is empty (indicating a reset)
		const isParentDataEmpty = !data || Object.keys(data).length === 0;

		if (isParentDataEmpty) {
			// Parent has been reset, check localStorage or use initial data
			const saved = localStorage.getItem("terminus-beam-code-data");
			if (saved) {
				try {
					const parsedData = JSON.parse(saved);
					setLocalData(parsedData);
				} catch (e) {
					console.error("Failed to parse beam code data:", e);
					setLocalData({});
				}
			} else {
				setLocalData({});
			}
		}
		isInitializing.current = true;
	}, [data]);

	// Save to localStorage and update parent when data changes
	useEffect(() => {
		localStorage.setItem("terminus-beam-code-data", JSON.stringify(localData));

		// Only call onChange after initial load is complete
		if (!isInitializing.current) {
			onChange(localData);
		} else {
			isInitializing.current = false;
		}
	}, [localData]); // Removed onChange from dependencies to prevent infinite loop

	const handleSymbolSelect = (locationId, symbolId) => {
		setLocalData((prevData) => ({
			...prevData,
			[locationId]: symbolId,
		}));
	};

	// Calculate equation results
	const calculateEquations = () => {
		const x = getSymbolValue(localData.x);
		const y = getSymbolValue(localData.y);
		const z = getSymbolValue(localData.z);

		if (x === null || y === null || z === null) return null;

		const equation1 = 2 * x + 11;
		const equation2 = 2 * z + y - 5;
		const equation3 = y + z - x;

		return {
			equation1,
			equation2,
			equation3,
			x,
			y,
			z,
		};
	};

	// Get completion status
	const getCompletionStatus = () => {
		const completedCount = SYMBOL_LOCATIONS.filter(
			(location) => localData[location.id]
		).length;
		return {
			completed: completedCount,
			total: SYMBOL_LOCATIONS.length,
			isComplete: completedCount === SYMBOL_LOCATIONS.length,
		};
	};

	const status = getCompletionStatus();
	const results = calculateEquations();

	return (
		<div className="beam-code-section">
			<div className="section-header">
				<h2>Beam Code</h2>
				<p className="section-description">
					Find the 3 laptops with X, Y, Z stickers and record the symbols they
					display.
				</p>
			</div>

			<div className="symbol-selection">
				{SYMBOL_LOCATIONS.map((location) => (
					<div key={location.id} className="symbol-input-group">
						<div className="input-label">
							<h3>{location.name}</h3>
							<p className="input-description">{location.description}</p>
						</div>

						<div className="symbol-grid">
							{SYMBOL_DATA.map((symbol) => (
								<button
									key={symbol.id}
									className={`symbol-button ${
										localData[location.id] === symbol.id ? "selected" : ""
									}`}
									onClick={() => handleSymbolSelect(location.id, symbol.id)}
								>
									{BeamSymbols[symbol.id]}
								</button>
							))}
						</div>
					</div>
				))}
			</div>

			{results && (
				<div className="equation-results">
					<h3>Terminal Sequence</h3>
					<div className="results-grid">
						<div className="result-item">
							<span className="result-number">{results.equation1}</span>
							<span className="result-label">First Input</span>
						</div>
						<div className="result-item">
							<span className="result-number">{results.equation2}</span>
							<span className="result-label">Second Input</span>
						</div>
						<div className="result-item">
							<span className="result-number">{results.equation3}</span>
							<span className="result-label">Third Input</span>
						</div>
					</div>
				</div>
			)}

			<div className="section-tips">
				<h3>How to Use</h3>
				<ul>
					<li>
						<strong>Step 1:</strong> Find 3 laptops around the map with X, Y, Z
						stickers
					</li>
					<li>
						<strong>Step 2:</strong> Turn on each laptop to reveal a symbol
					</li>
					<li>
						<strong>Step 3:</strong> Click the matching symbol above for each
						laptop
					</li>
					<li>
						<strong>Step 4:</strong> Enter the calculated numbers into the
						terminal in order
					</li>
				</ul>
			</div>
		</div>
	);
}

export default BeamCodeSection;
