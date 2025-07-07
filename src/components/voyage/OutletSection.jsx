import { useState, useEffect } from "react";
import "./ClockSection.css";

const OUTLET_LOCATIONS = [
	{ id: "state-rooms", name: "State Rooms" },
	{ id: "grand-stairs", name: "Grand Stairs" },
	{ id: "first-class", name: "1st Class" },
	{ id: "dining-room", name: "Dining Room" },
	{ id: "aft-deck", name: "Aft Deck" },
	{ id: "third-class", name: "3rd Class" },
];

const CATALYST_TYPES = [
	{ id: "electric", name: "Electric", color: "#3b82f6" },
	{ id: "fire", name: "Fire", color: "#ef4444" },
	{ id: "poison", name: "Poison", color: "#16a34a" },
	{ id: "water", name: "Water", color: "#06b6d4" },
];

const PORTAL_ORDER = [
	{ step: 1, catalyst: "poison", name: "Poison" },
	{ step: 2, catalyst: "water", name: "Water" },
	{ step: 3, catalyst: "electric", name: "Electric" },
	{ step: 4, catalyst: "fire", name: "Fire" },
];

function OutletSection({ data, onChange }) {
	const [localData, setLocalData] = useState(data);

	// Load from localStorage on mount or when parent data changes (reset)
	useEffect(() => {
		// Check if parent data is empty (indicating a reset)
		const isParentDataEmpty = !data || Object.keys(data).length === 0;

		if (isParentDataEmpty) {
			// Parent has been reset, check localStorage or use initial data
			const saved = localStorage.getItem("voyage-outlet-data");
			if (saved) {
				try {
					const parsedData = JSON.parse(saved);
					setLocalData(parsedData);
					onChange(parsedData);
				} catch (e) {
					console.error("Failed to parse outlet data:", e);
					const initial = {};
					setLocalData(initial);
					onChange(initial);
				}
			} else {
				const initial = {};
				setLocalData(initial);
				onChange(initial);
			}
		}
	}, [data]);

	// Save to localStorage and update parent when data changes
	useEffect(() => {
		localStorage.setItem("voyage-outlet-data", JSON.stringify(localData));
		onChange(localData);
	}, [localData, onChange]);

	const handleCatalystSelect = (locationId, catalystId) => {
		setLocalData((prev) => {
			const newData = { ...prev };

			// Remove this catalyst from any other location
			Object.keys(newData).forEach((key) => {
				if (newData[key] === catalystId) {
					delete newData[key];
				}
			});

			// Set the catalyst for this location
			if (catalystId) {
				newData[locationId] = catalystId;
			} else {
				delete newData[locationId];
			}

			return newData;
		});
	};

	const getUsedCatalysts = () => {
		return Object.values(localData);
	};

	const isCatalystUsed = (catalystId) => {
		return getUsedCatalysts().includes(catalystId);
	};

	const getLocationForCatalyst = (catalystId) => {
		const locationId = Object.keys(localData).find(
			(key) => localData[key] === catalystId
		);
		if (locationId) {
			const location = OUTLET_LOCATIONS.find((loc) => loc.id === locationId);
			return location ? location.name : null;
		}
		return null;
	};

	const assignedCount = Object.keys(localData).length;

	return (
		<div className="section-card">
			<div className="section-header">
				<h3>Outlet Locations & Catalysts</h3>
				<div className="section-status">
					{assignedCount}/4 catalysts assigned
				</div>
			</div>

			<p className="section-description">
				Select which catalyst zombie type appears at each outlet location. After
				killing the catalyst zombie, enter the portals in the specific order
				shown below.
			</p>

			{/* Outlet Selection Grid */}
			<div className="outlet-grid">
				{OUTLET_LOCATIONS.map((location) => {
					const selectedCatalyst = localData[location.id];
					const isLocationDisabled = !selectedCatalyst && assignedCount >= 4;

					return (
						<div
							key={location.id}
							className={`outlet-location ${
								selectedCatalyst ? "outlet-location--selected" : ""
							} ${isLocationDisabled ? "outlet-location--disabled" : ""}`}
						>
							<h4 className="outlet-location-title">{location.name}</h4>

							<div className="catalyst-buttons">
								{CATALYST_TYPES.map((catalyst) => {
									const isSelected = selectedCatalyst === catalyst.id;
									const isUsedElsewhere =
										isCatalystUsed(catalyst.id) && !isSelected;
									const isDisabled = isLocationDisabled || isUsedElsewhere;

									return (
										<button
											key={catalyst.id}
											onClick={() =>
												handleCatalystSelect(
													location.id,
													isSelected ? null : catalyst.id
												)
											}
											className={`catalyst-btn ${
												isSelected ? "catalyst-btn--selected" : ""
											} ${isDisabled ? "catalyst-btn--disabled" : ""}`}
											style={
												isSelected
													? {
															backgroundColor: catalyst.color,
															borderColor: catalyst.color,
															color: "white",
													  }
													: {}
											}
											disabled={isDisabled}
											title={catalyst.name}
										>
											{catalyst.name}
										</button>
									);
								})}
							</div>
						</div>
					);
				})}
			</div>

			{/* Portal Entry Order */}
			<div className="portal-order">
				<h4>Portal Entry Order:</h4>
				<div className="portal-order-list">
					{PORTAL_ORDER.map((portal) => {
						const location = getLocationForCatalyst(portal.catalyst);
						const catalyst = CATALYST_TYPES.find(
							(c) => c.id === portal.catalyst
						);

						return (
							<div
								key={portal.step}
								className={`portal-order-item ${
									location ? "portal-order-item--assigned" : ""
								}`}
							>
								<span className="portal-step">{portal.step}</span>
								<span
									className="portal-catalyst"
									style={
										location ? { color: catalyst.color, fontWeight: "600" } : {}
									}
								>
									{portal.name}
								</span>
								<span className="portal-location">
									{location ? `→ ${location}` : "→ Not assigned"}
								</span>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}

export default OutletSection;
