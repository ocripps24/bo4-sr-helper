import React, { useState, useEffect, useRef, useCallback } from "react";
import "./ClockSection.css";
import { SYMBOL_ICONS, SYMBOL_NAMES } from "./SymbolIcons";

const CLOCK_LOCATIONS = [
	{ id: "mailrooms", name: "Mailrooms" },
	{ id: "bridge", name: "Bridge" },
	{ id: "grand-stairs", name: "Grand Stairs" },
	{ id: "first-class", name: "1st Class" },
	{ id: "galley", name: "Galley" },
	{ id: "third-class", name: "3rd Class" },
];

const SYMBOLS = [
	"triangle-up",
	"triangle-down",
	"triangle-up-dash",
	"triangle-down-dash",
];

// Movement limits for each symbol type
const MOVEMENT_LIMITS = {
	"triangle-up": { min: -5, max: 5 },
	"triangle-down": { min: -5, max: 5 },
	"triangle-up-dash": { min: -3, max: 3 },
	"triangle-down-dash": { min: -3, max: 3 },
};

// Convert movement to time
const movementToTime = (movement, type) => {
	if (type === "hour") {
		// Hour dial: 0 = 12, +1 = 1, +2 = 2, ..., -1 = 11, -2 = 10
		let hour = (12 + movement) % 12;
		if (hour === 0) hour = 12;
		return hour.toString();
	} else {
		// Minute dial: 0 = 00, +1 = 05, +2 = 10, ..., -1 = 55, -2 = 50
		let minute = (movement * 5 + 60) % 60;
		return minute.toString().padStart(2, "0");
	}
};

// Convert time to movement
const timeToMovement = (timeValue, type) => {
	if (!timeValue || timeValue === "") return 0;

	const numValue = parseInt(timeValue);
	if (isNaN(numValue)) return 0;

	if (type === "hour") {
		let hour = numValue;
		if (hour === 12) hour = 0;
		// Movement from 12: 1 = +1, 2 = +2, ..., 11 = -1, 10 = -2
		return hour <= 6 ? hour : hour - 12;
	} else {
		let minute = numValue;
		// Movement from 00: 05 = +1, 10 = +2, ..., 55 = -1, 50 = -2
		return minute <= 30 ? minute / 5 : (minute - 60) / 5;
	}
};

// Initialize all locations with empty values
const getInitialData = () => {
	const initialData = {};
	CLOCK_LOCATIONS.forEach((location) => {
		initialData[location.id] = {
			hour: "",
			minute: "",
			symbol: "",
			hourMovement: 0,
			minuteMovement: 0,
		};
	});
	return initialData;
};

function ClockSection({ data, onChange }) {
	const [localData, setLocalData] = useState(data || getInitialData());
	const isInitializing = useRef(true);

	// UI preference states
	const [displayFormat, setDisplayFormat] = useState("time"); // 'time' or 'movements'
	const [inputMethod, setInputMethod] = useState(() => {
		// Default to buttons for screens under 1200px
		if (typeof window !== "undefined" && window.innerWidth < 1200) {
			return "buttons";
		}
		return "sliders";
	}); // 'sliders', 'steppers', 'text', 'buttons'

	// Load from localStorage on mount or when parent data changes (reset)
	useEffect(() => {
		// Check if parent data is empty (indicating a reset)
		const isParentDataEmpty = !data || Object.keys(data).length === 0;

		if (isParentDataEmpty) {
			// Parent has been reset, check localStorage or use initial data
			const saved = localStorage.getItem("voyage-clock-data");
			if (saved) {
				try {
					const parsedData = JSON.parse(saved);
					// Convert old time format to new hour/minute format if needed
					const convertedData = {};
					CLOCK_LOCATIONS.forEach((location) => {
						if (parsedData[location.id]) {
							const clockData = parsedData[location.id];
							if (clockData.time && !clockData.hour && !clockData.minute) {
								// Convert "3:15" format to separate hour/minute
								const timeParts = clockData.time.split(":");
								const hour = timeParts[0] || "";
								const minute = timeParts[1] || "";
								convertedData[location.id] = {
									hour,
									minute,
									symbol:
										clockData.symbol === "triangle"
											? "triangle-up"
											: clockData.symbol || "",
									hourMovement: timeToMovement(hour, "hour"),
									minuteMovement: timeToMovement(minute, "minute"),
								};
							} else {
								// Already in new format or empty
								const hour = clockData.hour || "";
								const minute = clockData.minute || "";
								convertedData[location.id] = {
									hour,
									minute,
									symbol:
										clockData.symbol === "triangle"
											? "triangle-up"
											: clockData.symbol || "",
									hourMovement:
										clockData.hourMovement !== undefined
											? clockData.hourMovement
											: timeToMovement(hour, "hour"),
									minuteMovement:
										clockData.minuteMovement !== undefined
											? clockData.minuteMovement
											: timeToMovement(minute, "minute"),
								};
							}
						} else {
							convertedData[location.id] = {
								hour: "",
								minute: "",
								symbol: "",
								hourMovement: 0,
								minuteMovement: 0,
							};
						}
					});
					setLocalData(convertedData);
				} catch (e) {
					console.error("Failed to parse clock data:", e);
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
		localStorage.setItem("voyage-clock-data", JSON.stringify(localData));

		// Only call onChange after initial load is complete
		if (!isInitializing.current) {
			onChange(localData);
		} else {
			isInitializing.current = false;
		}
	}, [localData]); // Removed onChange from dependencies to prevent infinite loop

	const handleHourChange = (locationId, hour) => {
		// Allow only numbers and limit to reasonable hour values
		if (hour === "" || (/^\d{1,2}$/.test(hour) && parseInt(hour) <= 12)) {
			const hourMovement = timeToMovement(hour, "hour");
			setLocalData((prev) => ({
				...prev,
				[locationId]: { ...prev[locationId], hour, hourMovement },
			}));
		}
	};

	const handleMinuteChange = (locationId, minute) => {
		// Allow only numbers and limit to 0-59
		if (minute === "" || (/^\d{1,2}$/.test(minute) && parseInt(minute) <= 59)) {
			const minuteMovement = timeToMovement(minute, "minute");
			setLocalData((prev) => ({
				...prev,
				[locationId]: { ...prev[locationId], minute, minuteMovement },
			}));
		}
	};

	const handleMovementChange = (locationId, movement, type) => {
		const timeValue = movementToTime(movement, type);
		if (type === "hour") {
			setLocalData((prev) => {
				const currentData = prev[locationId] || {};
				// Ensure minute has a value if minute movement exists but no minute time
				const ensuredMinute =
					currentData.minute ||
					(currentData.minuteMovement !== undefined
						? movementToTime(currentData.minuteMovement || 0, "minute")
						: movementToTime(0, "minute"));

				return {
					...prev,
					[locationId]: {
						...currentData,
						hour: timeValue,
						hourMovement: movement,
						minute: ensuredMinute,
						minuteMovement:
							currentData.minuteMovement !== undefined
								? currentData.minuteMovement
								: 0,
					},
				};
			});
		} else {
			setLocalData((prev) => {
				const currentData = prev[locationId] || {};
				// Ensure hour has a value if hour movement exists but no hour time
				const ensuredHour =
					currentData.hour ||
					(currentData.hourMovement !== undefined
						? movementToTime(currentData.hourMovement || 0, "hour")
						: movementToTime(0, "hour"));

				return {
					...prev,
					[locationId]: {
						...currentData,
						minute: timeValue,
						minuteMovement: movement,
						hour: ensuredHour,
						hourMovement:
							currentData.hourMovement !== undefined
								? currentData.hourMovement
								: 0,
					},
				};
			});
		}
	};

	const handleSymbolChange = (locationId, symbol) => {
		setLocalData((prev) => ({
			...prev,
			[locationId]: { ...prev[locationId], symbol },
		}));
	};

	const getUsedSymbols = () => {
		return Object.values(localData)
			.map((clock) => clock.symbol)
			.filter((symbol) => symbol !== "");
	};

	const getAvailableSymbols = (currentSymbol) => {
		const used = getUsedSymbols();
		return SYMBOLS.filter(
			(symbol) => symbol === currentSymbol || !used.includes(symbol)
		);
	};

	// Count locations that have complete data (hour, minute, and symbol)
	const getActiveLocationsCount = () => {
		return Object.values(localData).filter(
			(clock) => clock.hour !== "" && clock.minute !== "" && clock.symbol !== ""
		).length;
	};

	// Get clocks that have complete data (hour, minute, and symbol)
	const getCompleteClocks = () => {
		return Object.entries(localData)
			.filter(
				([locationId, clock]) =>
					clock.hour !== "" && clock.minute !== "" && clock.symbol !== ""
			)
			.map(([locationId, clock]) => ({
				locationId,
				locationName:
					CLOCK_LOCATIONS.find((loc) => loc.id === locationId)?.name ||
					locationId,
				...clock,
			}));
	};

	const activeCount = getActiveLocationsCount();
	const completeClocks = getCompleteClocks();

	// Group clocks by symbol type for helper section
	const getClocksBySymbol = () => {
		const clocksBySymbol = {};
		completeClocks.forEach((clock) => {
			clocksBySymbol[clock.symbol] = clock;
		});
		return clocksBySymbol;
	};

	const clocksBySymbol = getClocksBySymbol();

	// Movement slider component
	const MovementSlider = ({ locationId, type, movement, symbol, onChange }) => {
		const [isDragging, setIsDragging] = useState(false);
		const [tempValue, setTempValue] = useState(movement);
		const limits = symbol ? MOVEMENT_LIMITS[symbol] : { min: -5, max: 5 };
		const timeValue = movementToTime(isDragging ? tempValue : movement, type);

		const handleSliderChange = useCallback(
			(e) => {
				const newValue = parseInt(e.target.value);
				setTempValue(newValue);
				if (!isDragging) {
					onChange(locationId, newValue, type);
				}
			},
			[locationId, type, onChange, isDragging]
		);

		const handleMouseDown = useCallback(() => {
			setIsDragging(true);
			setTempValue(movement);
		}, [movement]);

		const handleMouseUp = useCallback(() => {
			if (isDragging) {
				onChange(locationId, tempValue, type);
				setIsDragging(false);
			}
		}, [isDragging, locationId, tempValue, type, onChange]);

		// Update temp value when external movement changes
		useEffect(() => {
			if (!isDragging) {
				setTempValue(movement);
			}
		}, [movement, isDragging]);

		return (
			<div className="movement-slider">
				<label className="movement-label">
					{type === "hour" ? "Hour" : "Minute"} Movement:
				</label>
				<div className="slider-container">
					<span className="slider-limit">{limits.min}</span>
					<input
						type="range"
						min={limits.min}
						max={limits.max}
						step="1"
						value={isDragging ? tempValue : movement}
						onChange={handleSliderChange}
						onMouseDown={handleMouseDown}
						onMouseUp={handleMouseUp}
						onTouchStart={handleMouseDown}
						onTouchEnd={handleMouseUp}
						className="movement-range"
					/>
					<span className="slider-limit">{limits.max}</span>
				</div>
				<div className="movement-display">
					{displayFormat === "movements"
						? `${(isDragging ? tempValue : movement) >= 0 ? "+" : ""}${
								isDragging ? tempValue : movement
						  }`
						: timeValue}
				</div>
			</div>
		);
	};

	// Movement stepper component
	const MovementStepper = ({
		locationId,
		type,
		movement,
		symbol,
		onChange,
	}) => {
		const limits = symbol ? MOVEMENT_LIMITS[symbol] : { min: -5, max: 5 };
		const timeValue = movementToTime(movement, type);

		return (
			<div className="movement-stepper">
				<label className="movement-label">
					{type === "hour" ? "Hour" : "Minute"} Movement:
				</label>
				<div className="stepper-container">
					<button
						onClick={() =>
							onChange(locationId, Math.max(limits.min, movement - 1), type)
						}
						disabled={movement <= limits.min}
						className="stepper-btn"
					>
						−
					</button>
					<div className="stepper-display">
						{displayFormat === "movements"
							? `${movement >= 0 ? "+" : ""}${movement}`
							: timeValue}
					</div>
					<button
						onClick={() =>
							onChange(locationId, Math.min(limits.max, movement + 1), type)
						}
						disabled={movement >= limits.max}
						className="stepper-btn"
					>
						+
					</button>
				</div>
				<div className="stepper-time">
					{displayFormat === "movements" ? `= ${timeValue}` : ""}
				</div>
			</div>
		);
	};

	// Movement buttons component
	const MovementButtons = ({
		locationId,
		symbol,
		hourMovement,
		minuteMovement,
		onChange,
	}) => {
		const limits = symbol ? MOVEMENT_LIMITS[symbol] : { min: -5, max: 5 };
		const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
		const [showingMinutes, setShowingMinutes] = useState(false);

		useEffect(() => {
			const handleResize = () => {
				const mobile = window.innerWidth < 768;
				setIsMobile(mobile);
				if (!mobile) setShowingMinutes(false); // Reset to hour view on desktop
			};
			window.addEventListener("resize", handleResize);
			return () => window.removeEventListener("resize", handleResize);
		}, []);

		// Generate buttons for the movement range
		const generateButtons = (currentMovement, type) => {
			const buttons = [];
			for (let movement = limits.min; movement <= limits.max; movement++) {
				const timeValue = movementToTime(movement, type);
				const isSelected = currentMovement === movement;

				buttons.push(
					<button
						key={movement}
						onClick={() => {
							onChange(locationId, movement, type);
							// On mobile, after selecting hour, show minute buttons
							if (isMobile && type === "hour") {
								setShowingMinutes(true);
							}
						}}
						className={`movement-btn ${
							isSelected ? "movement-btn--selected" : ""
						}`}
						title={`${movement >= 0 ? "+" : ""}${movement} = ${timeValue}`}
					>
						{displayFormat === "movements"
							? `${movement >= 0 ? "+" : ""}${movement}`
							: timeValue}
					</button>
				);
			}
			return buttons;
		};

		// Mobile: Show either hour or minute buttons
		if (isMobile) {
			if (!showingMinutes) {
				// Show hour buttons
				return (
					<div className="movement-buttons">
						<div className="movement-buttons-header">
							<label className="movement-label">Hour:</label>
							{hourMovement !== 0 && (
								<button
									onClick={() => setShowingMinutes(true)}
									className="switch-btn"
								>
									Set Minutes →
								</button>
							)}
						</div>
						<div className="movement-buttons-grid">
							{generateButtons(hourMovement || 0, "hour")}
						</div>
					</div>
				);
			} else {
				// Show minute buttons
				return (
					<div className="movement-buttons">
						<div className="movement-buttons-header">
							<button
								onClick={() => setShowingMinutes(false)}
								className="switch-btn"
							>
								← Back to Hours
							</button>
							<label className="movement-label">Minute:</label>
						</div>
						<div className="movement-buttons-grid">
							{generateButtons(minuteMovement || 0, "minute")}
						</div>
					</div>
				);
			}
		}

		// Desktop: Show both hour and minute buttons
		return (
			<div className="movement-buttons">
				<div className="movement-buttons-section">
					<label className="movement-label">Hour:</label>
					<div className="movement-buttons-grid">
						{generateButtons(hourMovement || 0, "hour")}
					</div>
				</div>
				<div className="movement-buttons-section">
					<label className="movement-label">Minute:</label>
					<div className="movement-buttons-grid">
						{generateButtons(minuteMovement || 0, "minute")}
					</div>
				</div>
			</div>
		);
	};

	return (
		<div className="section-card">
			<div className="section-header">
				<h3>
					<span className="section-title__full">Clock Locations & Times</span>
					<span className="section-title__short">Clocks</span>
				</h3>
				<div className="section-status">
					<span className="section-status__full">
						{completeClocks.length}/4 clocks complete
					</span>
					<span className="section-status__short">
						{completeClocks.length}/4
					</span>
				</div>
			</div>

			<p className="section-description">
				Record times and symbols for active clocks. Enter hour and minute
				separately. Each symbol can only be used once.
			</p>

			<div className="clock-grid">
				{CLOCK_LOCATIONS.map((location) => {
					const clockData = localData[location.id] || {
						hour: "",
						minute: "",
						symbol: "",
						hourMovement: 0,
						minuteMovement: 0,
					};

					// Ensure we don't show converted values for empty data in text inputs
					const displayHour = clockData.hour || "";
					const displayMinute = clockData.minute || "";
					const availableSymbols = getAvailableSymbols(clockData.symbol);
					const hasData =
						clockData.hour !== "" &&
						clockData.minute !== "" &&
						clockData.symbol !== "";

					return (
						<div
							key={location.id}
							className={`clock-location ${
								hasData ? "clock-location--active" : ""
							}`}
						>
							<div className="clock-location-header">
								<h4>{location.name}</h4>
							</div>

							<div className="clock-inputs">
								{/* Symbol Selection - Always First */}
								<div className="input-group">
									<label className="symbol-label">Symbol:</label>
									<div className="symbol-picker">
										{SYMBOLS.map((symbol) => {
											const IconComponent = SYMBOL_ICONS[symbol];
											const isSymbolSelected = clockData.symbol === symbol;
											const isDisabled = !availableSymbols.includes(symbol);
											const usedSymbols = getUsedSymbols();
											const isSymbolUsedElsewhere =
												usedSymbols.includes(symbol) && !isSymbolSelected;
											const shouldFade =
												isSymbolUsedElsewhere ||
												(clockData.symbol && clockData.symbol !== symbol);

											return (
												<button
													key={symbol}
													onClick={() =>
														handleSymbolChange(location.id, symbol)
													}
													className={`symbol-btn ${
														isSymbolSelected ? "symbol-btn--selected" : ""
													} ${isDisabled ? "symbol-btn--disabled" : ""} ${
														shouldFade && !isDisabled ? "symbol-btn--faded" : ""
													}`}
													disabled={isDisabled}
													title={SYMBOL_NAMES[symbol]}
													type="button"
												>
													<IconComponent size={32} />
												</button>
											);
										})}
									</div>
								</div>

								{/* Time/Movement Inputs */}
								{inputMethod === "text" && (
									<div className="time-inputs">
										<div className="input-group">
											<label
												htmlFor={`hour-${location.id}`}
												className="time-label"
											>
												Hour:
											</label>
											<input
												id={`hour-${location.id}`}
												type="text"
												value={displayHour}
												onChange={(e) =>
													handleHourChange(location.id, e.target.value)
												}
												placeholder="Hour"
												className="time-input time-input--small"
												maxLength="2"
											/>
										</div>
										<div className="input-group">
											<label
												htmlFor={`minute-${location.id}`}
												className="time-label"
											>
												Minute:
											</label>
											<input
												id={`minute-${location.id}`}
												type="text"
												value={displayMinute}
												onChange={(e) =>
													handleMinuteChange(location.id, e.target.value)
												}
												placeholder="Minute"
												className="time-input time-input--small"
												maxLength="2"
											/>
										</div>
									</div>
								)}

								{inputMethod === "sliders" && (
									<div className="movement-inputs">
										<MovementSlider
											locationId={location.id}
											type="hour"
											movement={clockData.hourMovement || 0}
											symbol={clockData.symbol}
											onChange={handleMovementChange}
										/>
										<MovementSlider
											locationId={location.id}
											type="minute"
											movement={clockData.minuteMovement || 0}
											symbol={clockData.symbol}
											onChange={handleMovementChange}
										/>
									</div>
								)}

								{inputMethod === "steppers" && (
									<div className="movement-inputs">
										<MovementStepper
											locationId={location.id}
											type="hour"
											movement={clockData.hourMovement || 0}
											symbol={clockData.symbol}
											onChange={handleMovementChange}
										/>
										<MovementStepper
											locationId={location.id}
											type="minute"
											movement={clockData.minuteMovement || 0}
											symbol={clockData.symbol}
											onChange={handleMovementChange}
										/>
									</div>
								)}

								{inputMethod === "buttons" && (
									<div className="movement-inputs">
										<MovementButtons
											locationId={location.id}
											symbol={clockData.symbol}
											hourMovement={clockData.hourMovement || 0}
											minuteMovement={clockData.minuteMovement || 0}
											onChange={handleMovementChange}
										/>
									</div>
								)}
							</div>
						</div>
					);
				})}
			</div>

			{/* Helper Section */}
			{completeClocks.length > 0 && (
				<div className="clock-helper">
					<h4>Lever Settings Guide</h4>
					<p className="helper-description">
						Use the collected clock data to set levers in these 3 locations:
					</p>

					<div className="helper-locations">
						{/* Bridge - All symbols, use minutes */}
						<div className="helper-location">
							<h5>1. Bridge - 4 Levers (Use Minutes)</h5>
							<div className="helper-levers">
								{[
									"triangle-up-dash",
									"triangle-down",
									"triangle-down-dash",
									"triangle-up",
								].map((symbol) => {
									const clock = clocksBySymbol[symbol];
									const IconComponent = SYMBOL_ICONS[symbol];
									return (
										<div
											key={symbol}
											className={`helper-lever ${
												clock
													? "helper-lever--available"
													: "helper-lever--missing"
											}`}
										>
											<div className="helper-symbol">
												<IconComponent size={24} />
											</div>
											<div className="helper-data">
												{clock ? `${clock.minute || "?"}` : "?"}
											</div>
										</div>
									);
								})}
							</div>
						</div>

						{/* Poop Deck - Dash symbols, use hours */}
						<div className="helper-location">
							<h5>2. Poop Deck - 2 Levers (Use Hours)</h5>
							<div className="helper-levers helper-levers--two">
								<div className="helper-lever-pair">
									<span className="lever-position">Left:</span>
									<div
										className={`helper-lever ${
											clocksBySymbol["triangle-up-dash"]
												? "helper-lever--available"
												: "helper-lever--missing"
										}`}
									>
										<div className="helper-symbol">
											{React.createElement(SYMBOL_ICONS["triangle-up-dash"], {
												size: 24,
											})}
										</div>
										<div className="helper-data">
											{clocksBySymbol["triangle-up-dash"]?.hour || "?"}
										</div>
									</div>
								</div>
								<div className="helper-lever-pair">
									<span className="lever-position">Right:</span>
									<div
										className={`helper-lever ${
											clocksBySymbol["triangle-down-dash"]
												? "helper-lever--available"
												: "helper-lever--missing"
										}`}
									>
										<div className="helper-symbol">
											{React.createElement(SYMBOL_ICONS["triangle-down-dash"], {
												size: 24,
											})}
										</div>
										<div className="helper-data">
											{clocksBySymbol["triangle-down-dash"]?.hour || "?"}
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* Boiler Room - Non-dash symbols, use hours */}
						<div className="helper-location">
							<h5>3. Boiler Room - 2 Levers (Use Hours)</h5>
							<div className="helper-levers helper-levers--two">
								<div className="helper-lever-pair">
									<span className="lever-position">Left:</span>
									<div
										className={`helper-lever ${
											clocksBySymbol["triangle-up"]
												? "helper-lever--available"
												: "helper-lever--missing"
										}`}
									>
										<div className="helper-symbol">
											{React.createElement(SYMBOL_ICONS["triangle-up"], {
												size: 24,
											})}
										</div>
										<div className="helper-data">
											{clocksBySymbol["triangle-up"]?.hour || "?"}
										</div>
									</div>
								</div>
								<div className="helper-lever-pair">
									<span className="lever-position">Right:</span>
									<div
										className={`helper-lever ${
											clocksBySymbol["triangle-down"]
												? "helper-lever--available"
												: "helper-lever--missing"
										}`}
									>
										<div className="helper-symbol">
											{React.createElement(SYMBOL_ICONS["triangle-down"], {
												size: 24,
											})}
										</div>
										<div className="helper-data">
											{clocksBySymbol["triangle-down"]?.hour || "?"}
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* UI Preference Controls */}
			<div className="clock-preferences">
				<h4>Display Options</h4>
				<div className="preference-controls">
					<div className="preference-group">
						<label htmlFor="display-format">Display Format:</label>
						<select
							id="display-format"
							value={displayFormat}
							onChange={(e) => setDisplayFormat(e.target.value)}
							className="preference-select"
						>
							<option value="time">Time Format (1:45)</option>
							<option value="movements">Movement Format (+1/-3)</option>
						</select>
					</div>

					<div className="preference-group">
						<label htmlFor="input-method">Input Method:</label>
						<select
							id="input-method"
							value={inputMethod}
							onChange={(e) => setInputMethod(e.target.value)}
							className="preference-select"
						>
							<option value="sliders">Movement Sliders</option>
							<option value="steppers">Movement Steppers</option>
							<option value="buttons">Button Layout</option>
							<option value="text">Text Input Fields</option>
						</select>
					</div>
				</div>
			</div>
		</div>
	);
}

export default ClockSection;
