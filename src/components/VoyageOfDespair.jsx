import { useState, useCallback } from "react";
import {
	Link,
	Routes,
	Route,
	useNavigate,
	useLocation,
} from "react-router-dom";
import ClockSection from "./voyage/ClockSection";
import OutletSection from "./voyage/OutletSection";
import PlanetSection from "./voyage/PlanetSection";
import "../styles/main.scss";

const STEPS = [
	{
		id: "clocks",
		name: "Clocks",
		path: "/voyage-of-despair/clocks",
		component: ClockSection,
	},
	{
		id: "outlets",
		name: "Outlets",
		path: "/voyage-of-despair/outlets",
		component: OutletSection,
	},
	{
		id: "planets",
		name: "Planets",
		path: "/voyage-of-despair/planets",
		component: PlanetSection,
	},
];

function VoyageOfDespair() {
	const [clockData, setClockData] = useState({});
	const [outletData, setOutletData] = useState({});
	const [planetData, setPlanetData] = useState([]);

	const navigate = useNavigate();
	const location = useLocation();

	// Default to clocks step if no specific step
	const currentPath = location.pathname;
	const currentStepIndex = STEPS.findIndex((step) => step.path === currentPath);

	// If no step found (e.g., on base path), default to clocks (index 0)
	const activeStepIndex = currentStepIndex >= 0 ? currentStepIndex : 0;
	const currentStep = STEPS[activeStepIndex];

	const handleReset = () => {
		if (
			window.confirm(
				"Are you sure you want to reset all data? This cannot be undone."
			)
		) {
			setClockData({});
			setOutletData({});
			setPlanetData([]);
			// Clear localStorage
			localStorage.removeItem("voyage-clock-data");
			localStorage.removeItem("voyage-outlet-data");
			localStorage.removeItem("voyage-planet-data");
		}
	};

	const goToStep = (stepPath) => {
		navigate(stepPath);
	};

	const goToNext = () => {
		if (activeStepIndex < STEPS.length - 1) {
			navigate(STEPS[activeStepIndex + 1].path);
		}
	};

	const goToPrevious = () => {
		if (activeStepIndex > 0) {
			navigate(STEPS[activeStepIndex - 1].path);
		}
	};

	const getStepData = (stepId) => {
		switch (stepId) {
			case "clocks":
				return clockData;
			case "outlets":
				return outletData;
			case "planets":
				return planetData;
			default:
				return {};
		}
	};

	const handleClockChange = useCallback((data) => setClockData(data), []);
	const handleOutletChange = useCallback((data) => setOutletData(data), []);
	const handlePlanetChange = useCallback((data) => setPlanetData(data), []);

	const getStepOnChange = (stepId) => {
		switch (stepId) {
			case "clocks":
				return handleClockChange;
			case "outlets":
				return handleOutletChange;
			case "planets":
				return handlePlanetChange;
			default:
				return () => {};
		}
	};

	return (
		<div className="voyage-page">
			<div className="voyage-header">
				<div className="voyage-nav">
					<Link to="/" className="btn btn-secondary">
						← Back to Maps
					</Link>
					<button onClick={handleReset} className="btn btn-secondary reset-btn">
						Reset All Data
					</button>
				</div>

				{/* Step Navigation - Only tabs now */}
				<div className="step-navigation">
					<div className="step-tabs">
						{STEPS.map((step, index) => (
							<button
								key={step.id}
								onClick={() => goToStep(step.path)}
								className={`step-tab ${
									activeStepIndex === index ? "step-tab--active" : ""
								}`}
							>
								<span className="step-number">{index + 1}</span>
								<span className="step-name">{step.name}</span>
							</button>
						))}
					</div>
				</div>
			</div>

			<div className="voyage-content">
				<Routes>
					{/* Default route - show ClockSection when no sub-path */}
					<Route
						path="/"
						element={
							<ClockSection
								data={getStepData("clocks")}
								onChange={getStepOnChange("clocks")}
							/>
						}
					/>
					{STEPS.map((step) => {
						const StepComponent = step.component;
						return (
							<Route
								key={step.id}
								path={step.path.replace("/voyage-of-despair", "")}
								element={
									<StepComponent
										data={getStepData(step.id)}
										onChange={getStepOnChange(step.id)}
									/>
								}
							/>
						);
					})}
				</Routes>
			</div>

			{/* Step Controls - Now at bottom of page */}
			<div className="step-controls">
				<button
					onClick={goToPrevious}
					disabled={activeStepIndex === 0}
					className="btn btn-secondary"
				>
					← Previous
				</button>
				<button
					onClick={goToNext}
					disabled={activeStepIndex === STEPS.length - 1}
					className="btn btn-primary"
				>
					Next →
				</button>
			</div>
		</div>
	);
}

export default VoyageOfDespair;
