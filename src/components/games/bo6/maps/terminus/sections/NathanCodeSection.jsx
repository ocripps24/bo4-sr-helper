import { useState, useEffect, useRef } from "react";

// Define the three locations and their value ranges
const CODE_LOCATIONS = [
	{
		id: "clock",
		name: "Clock (Interrogation Room)",
		description: "Hour hand of clock in Quick-Revive room",
		min: 1,
		max: 9,
	},
	{
		id: "card",
		name: "Card (Mess)",
		description: "Playing card on board (Ace = 1)",
		min: 1,
		max: 9,
	},
	{
		id: "sign",
		name: "Sign (Engineering)",
		description: "Sign on the wall",
		min: 0,
		max: 9,
	},
];

// Initialize with empty values
const getInitialData = () => {
	const initialData = {};
	CODE_LOCATIONS.forEach((location) => {
		initialData[location.id] = "";
	});
	return initialData;
};

function NathanCodeSection({
	data,
	onChange,
	onNext,
	onPrevious,
	currentStep,
	totalSteps,
}) {
	const [localData, setLocalData] = useState(data || getInitialData());
	const isInitializing = useRef(true);

	// Load from localStorage on mount or when parent data changes (reset)
	useEffect(() => {
		// Check if parent data is empty (indicating a reset)
		const isParentDataEmpty = !data || Object.keys(data).length === 0;

		if (isParentDataEmpty) {
			// Parent has been reset, check localStorage or use initial data
			const saved = localStorage.getItem("terminus-nathan-code-data");
			if (saved) {
				try {
					const parsedData = JSON.parse(saved);
					setLocalData(parsedData);
				} catch (e) {
					console.error("Failed to parse Nathan code data:", e);
					const initial = getInitialData();
					setLocalData(initial);
				}
			} else {
				const initial = getInitialData();
				setLocalData(initial);
			}
		}
		isInitializing.current = true;
	}, [data]);

	// Save to localStorage and update parent when data changes
	useEffect(() => {
		localStorage.setItem(
			"terminus-nathan-code-data",
			JSON.stringify(localData)
		);

		// Only call onChange after initial load is complete
		if (!isInitializing.current) {
			onChange(localData);
		} else {
			isInitializing.current = false;
		}
	}, [localData, onChange]);

	// Handle input changes with validation
	const handleInputChange = (locationId, value) => {
		// Find the location to get min/max values
		const location = CODE_LOCATIONS.find((loc) => loc.id === locationId);
		if (!location) return;

		// Allow empty string or valid numbers within range
		if (
			value === "" ||
			(Number.isInteger(Number(value)) &&
				Number(value) >= location.min &&
				Number(value) <= location.max)
		) {
			setLocalData((prevData) => ({
				...prevData,
				[locationId]: value,
			}));
		}
	};

	// Get completion status
	const getCompletionStatus = () => {
		const completedCount = CODE_LOCATIONS.filter(
			(location) =>
				localData[location.id] !== "" && localData[location.id] !== undefined
		).length;
		return {
			completed: completedCount,
			total: CODE_LOCATIONS.length,
			isComplete: completedCount === CODE_LOCATIONS.length,
		};
	};

	// Get the final code in correct order
	const getFinalCode = () => {
		const { isComplete } = getCompletionStatus();
		if (!isComplete) return null;

		return `${localData.clock}${localData.card}${localData.sign}`;
	};

	const status = getCompletionStatus();
	const finalCode = getFinalCode();

	return (
		<div className="nathan-code-section">
			<div className="section-header">
				<h2>Nathan Code</h2>
				<p className="section-description">
					Collect three numbers from around the map to form the Nathan Code. The
					numbers must be entered in the order: Clock → Card → Sign.
				</p>
			</div>

			<div className="code-inputs">
				{CODE_LOCATIONS.map((location) => (
					<div key={location.id} className="code-input-group">
						<div className="input-label">
							<h3>{location.name}</h3>
							<p className="input-description">{location.description}</p>
							<span className="input-range">
								Range: {location.min}-{location.max}
							</span>
						</div>

						<div className="input-container">
							<input
								type="number"
								min={location.min}
								max={location.max}
								value={localData[location.id] || ""}
								onChange={(e) => handleInputChange(location.id, e.target.value)}
								placeholder={`${location.min}-${location.max}`}
								className="code-input"
							/>
						</div>
					</div>
				))}
			</div>

			<div className="code-summary">
				<div className="completion-status">
					<h3>Progress</h3>
					<div className="progress-bar">
						<div
							className="progress-fill"
							style={{ width: `${(status.completed / status.total) * 100}%` }}
						></div>
					</div>
					<span className="progress-text">
						{status.completed} of {status.total} numbers collected
					</span>
				</div>

				{finalCode && (
					<div className="final-code">
						<h3>Nathan Code</h3>
						<div className="code-display">
							<span className="code-number">{finalCode}</span>
						</div>
						<p className="code-note">
							Enter this code when prompted during the main quest.
						</p>
					</div>
				)}
			</div>

			<div className="section-tips">
				<h3>Tips</h3>
				<ul>
					<li>
						<strong>Clock:</strong> Look at the hour hand position in the
						Interrogation Room (where Quick-Revive is located)
					</li>
					<li>
						<strong>Card:</strong> Find the playing card on the board in the
						Mess area (remember: Ace = 1)
					</li>
					<li>
						<strong>Sign:</strong> Check the wall sign in the Engineering area
					</li>
					<li>
						<strong>Order:</strong> The code is always entered as
						Clock-Card-Sign, regardless of the order you collect them
					</li>
				</ul>
			</div>
		</div>
	);
}

export default NathanCodeSection;
