import { useState, useCallback } from "react";
import {
	Link,
	Routes,
	Route,
	useNavigate,
	useLocation,
} from "react-router-dom";
// We'll create this component next
import NathanCodeSection from "./sections/NathanCodeSection";
import BeamCodeSection from "./sections/BeamCodeSection";

const STEPS = [
	{
		id: "nathan-code",
		name: "Nathan Code",
		path: "/bo6/terminus/nathan-code",
		component: NathanCodeSection,
	},
	{
		id: "beam-code",
		name: "Beam Code",
		path: "/bo6/terminus/beam-code",
		component: BeamCodeSection,
	},
];

function Terminus() {
	// State management for each section
	const [nathanCodeData, setNathanCodeData] = useState({});
	const [beamCodeData, setBeamCodeData] = useState({});

	const navigate = useNavigate();
	const location = useLocation();

	// Get current step index
	const currentPath = location.pathname;
	const currentStepIndex = STEPS.findIndex((step) => step.path === currentPath);

	// Active step logic
	const getActiveStepIndex = () => {
		if (currentStepIndex >= 0) {
			return currentStepIndex;
		}
		// Default to first step if no match
		return 0;
	};

	const activeStepIndex = getActiveStepIndex();

	// Navigation functions
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

	// Data management functions
	const getStepData = (stepId) => {
		switch (stepId) {
			case "nathan-code":
				return nathanCodeData;
			case "beam-code":
				return beamCodeData;
			default:
				return {};
		}
	};

	const handleNathanCodeChange = useCallback(
		(data) => setNathanCodeData(data),
		[]
	);

	const handleBeamCodeChange = useCallback((data) => setBeamCodeData(data), []);

	const getStepOnChange = (stepId) => {
		switch (stepId) {
			case "nathan-code":
				return handleNathanCodeChange;
			case "beam-code":
				return handleBeamCodeChange;
			default:
				return () => {};
		}
	};

	// Reset function
	const handleReset = () => {
		if (
			window.confirm(
				"Are you sure you want to reset all data? This cannot be undone."
			)
		) {
			setNathanCodeData({});
			setBeamCodeData({});
			// Clear localStorage
			localStorage.removeItem("terminus-nathan-code-data");
			localStorage.removeItem("terminus-beam-code-data");
		}
	};

	return (
		<div className="terminus-page">
			<div className="terminus-header">
				<div className="terminus-nav">
					<Link to="/bo6" className="btn btn-secondary">
						<span className="btn-text">← Back to BO6 Maps</span>
						<span className="btn-icon">←</span>
					</Link>
					<div className="nav-right">
						<button
							onClick={handleReset}
							className="btn btn-secondary reset-btn"
						>
							<span className="btn-text">🗑️ Reset All Data</span>
							<span className="btn-icon">🗑️</span>
						</button>
					</div>
				</div>

				{/* Step Navigation */}
				<div className="step-navigation">
					<div className="step-tabs">
						{STEPS.map((step, index) => (
							<button
								key={step.id}
								onClick={() => goToStep(step.path)}
								className={`step-tab ${
									activeStepIndex === index ? "step-tab--active" : ""
								}`}
								disabled={!step.component} // Disable if component not ready
							>
								<span className="step-number">{index + 1}</span>
								<span className="step-name">{step.name}</span>
							</button>
						))}
					</div>
				</div>
			</div>

			<div className="terminus-content">
				<Routes>
					{/* Default route - show first available step */}
					<Route
						path="/"
						element={
							<NathanCodeSection
								data={getStepData("nathan-code")}
								onChange={getStepOnChange("nathan-code")}
								onNext={goToNext}
								onPrevious={goToPrevious}
								currentStep={activeStepIndex}
								totalSteps={STEPS.length}
							/>
						}
					/>

					{/* Individual step routes */}
					{STEPS.map((step) => (
						<Route
							key={step.id}
							path={step.id}
							element={
								step.component ? (
									<step.component
										data={getStepData(step.id)}
										onChange={getStepOnChange(step.id)}
										onNext={goToNext}
										onPrevious={goToPrevious}
										currentStep={activeStepIndex}
										totalSteps={STEPS.length}
									/>
								) : (
									<div className="placeholder-content">
										<h2>{step.name} - Coming Soon</h2>
										<p>This section is still under development.</p>
									</div>
								)
							}
						/>
					))}
				</Routes>

				{/* Navigation buttons */}
				<div className="terminus-navigation">
					<div className="navigation-buttons">
						<button
							onClick={goToPrevious}
							disabled={activeStepIndex === 0}
							className="btn btn-secondary nav-btn"
						>
							<span className="btn-text">← Previous</span>
							<span className="btn-icon">←</span>
						</button>

						<div className="step-indicator">
							<span className="current-step">{activeStepIndex + 1}</span>
							<span className="step-separator">of</span>
							<span className="total-steps">{STEPS.length}</span>
						</div>

						<button
							onClick={goToNext}
							disabled={activeStepIndex === STEPS.length - 1}
							className="btn btn-primary nav-btn"
						>
							<span className="btn-text">Next →</span>
							<span className="btn-icon">→</span>
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Terminus;
