import React, { useState, useEffect } from "react";
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

// Initialize all locations with empty values
const getInitialData = () => {
	const initialData = {};
	CLOCK_LOCATIONS.forEach((location) => {
		initialData[location.id] = { hour: "", minute: "", symbol: "" };
	});
	return initialData;
};

function ClockSection({ data, onChange }) {
	const [localData, setLocalData] = useState(data || getInitialData());

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
								convertedData[location.id] = {
									hour: timeParts[0] || "",
									minute: timeParts[1] || "",
									symbol:
										clockData.symbol === "triangle"
											? "triangle-up"
											: clockData.symbol || "",
								};
							} else {
								// Already in new format or empty
								convertedData[location.id] = {
									hour: clockData.hour || "",
									minute: clockData.minute || "",
									symbol:
										clockData.symbol === "triangle"
											? "triangle-up"
											: clockData.symbol || "",
								};
							}
						} else {
							convertedData[location.id] = { hour: "", minute: "", symbol: "" };
						}
					});
					setLocalData(convertedData);
					onChange(convertedData);
				} catch (e) {
					console.error("Failed to parse clock data:", e);
					const initial = getInitialData();
					setLocalData(initial);
					onChange(initial);
				}
			} else {
				const initial = getInitialData();
				setLocalData(initial);
				onChange(initial);
			}
		}
	}, [data]);

	// Save to localStorage and update parent when data changes
	useEffect(() => {
		localStorage.setItem("voyage-clock-data", JSON.stringify(localData));
		onChange(localData);
	}, [localData, onChange]);

	const handleHourChange = (locationId, hour) => {
		// Allow only numbers and limit to reasonable hour values
		if (hour === "" || (/^\d{1,2}$/.test(hour) && parseInt(hour) <= 12)) {
			setLocalData((prev) => ({
				...prev,
				[locationId]: { ...prev[locationId], hour },
			}));
		}
	};

	const handleMinuteChange = (locationId, minute) => {
		// Allow only numbers and limit to 0-59
		if (minute === "" || (/^\d{1,2}$/.test(minute) && parseInt(minute) <= 59)) {
			setLocalData((prev) => ({
				...prev,
				[locationId]: { ...prev[locationId], minute },
			}));
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

	// Count locations that have any data (hour, minute, or symbol)
	const getActiveLocationsCount = () => {
		return Object.values(localData).filter(
			(clock) => clock.hour !== "" || clock.minute !== "" || clock.symbol !== ""
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

	return (
		<div className="section-card">
			<div className="section-header">
				<h3>Clock Locations & Times</h3>
				<div className="section-status">
					{completeClocks.length}/4 clocks complete
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
					};
					const availableSymbols = getAvailableSymbols(clockData.symbol);
					const hasData =
						clockData.hour !== "" ||
						clockData.minute !== "" ||
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
								<div className="time-inputs">
									<div className="input-group">
										<label htmlFor={`hour-${location.id}`}>Hour:</label>
										<input
											id={`hour-${location.id}`}
											type="text"
											value={clockData.hour}
											onChange={(e) =>
												handleHourChange(location.id, e.target.value)
											}
											placeholder="9"
											className="time-input time-input--small"
											maxLength="2"
										/>
									</div>
									<div className="input-group">
										<label htmlFor={`minute-${location.id}`}>Minute:</label>
										<input
											id={`minute-${location.id}`}
											type="text"
											value={clockData.minute}
											onChange={(e) =>
												handleMinuteChange(location.id, e.target.value)
											}
											placeholder="15"
											className="time-input time-input--small"
											maxLength="2"
										/>
									</div>
								</div>

								<div className="input-group">
									<label>Symbol:</label>
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
													<IconComponent size={38} />
												</button>
											);
										})}
									</div>
								</div>
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
								{SYMBOLS.map((symbol) => {
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

						{/* Third Location - Non-dash symbols, use hours */}
						<div className="helper-location">
							<h5>3. Third Location - 2 Levers (Use Hours)</h5>
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
		</div>
	);
}

export default ClockSection;
