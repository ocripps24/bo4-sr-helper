import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "../../styles/main.scss";

function SettingsPage() {
	const location = useLocation();

	// Determine return path based on navigation state or fallback
	const getReturnPath = () => {
		// First, try to use the state passed from navigation
		if (location.state?.returnTo) {
			return location.state.returnTo;
		}

		// Fallback: try document.referrer
		const referrer = document.referrer;
		const currentOrigin = window.location.origin;

		if (referrer && referrer.startsWith(currentOrigin)) {
			const referrerPath = referrer.replace(currentOrigin, "");
			// If it's a voyage page but not settings, return there
			if (
				referrerPath.startsWith("/voyage-of-despair") &&
				!referrerPath.includes("/settings")
			) {
				return referrerPath;
			}
		}

		// Final fallback to clocks
		return "/voyage-of-despair/clocks";
	};

	const returnPath = getReturnPath();

	// Load initial settings from localStorage
	const getInitialClockSettings = () => {
		try {
			const saved = localStorage.getItem("voyage-clocks-settings");
			if (saved) {
				return JSON.parse(saved);
			}
		} catch (e) {
			console.error("Failed to parse clock settings:", e);
		}
		// Return defaults if nothing saved or error
		return {
			displayFormat: "time",
			inputMethod: "sliders",
		};
	};

	const getInitialSiteSettings = () => {
		try {
			const saved = localStorage.getItem("site-wide-settings");
			if (saved) {
				return JSON.parse(saved);
			}
		} catch (e) {
			console.error("Failed to parse site settings:", e);
		}
		// Return defaults if nothing saved or error
		return {
			darkMode: false,
		};
	};

	// All settings for the current map (Voyage of Despair)
	const [clockSettings, setClockSettings] = useState(getInitialClockSettings);

	// Site-wide settings
	const [siteSettings, setSiteSettings] = useState(getInitialSiteSettings);

	// Settings are now loaded directly in useState initialization

	// Save settings to localStorage when they change
	useEffect(() => {
		localStorage.setItem(
			"voyage-clocks-settings",
			JSON.stringify(clockSettings)
		);
	}, [clockSettings]);

	useEffect(() => {
		localStorage.setItem("site-wide-settings", JSON.stringify(siteSettings));
	}, [siteSettings]);

	const handleClockSettingChange = (setting, value) => {
		setClockSettings((prev) => ({ ...prev, [setting]: value }));
		// Dispatch custom event to notify other components
		window.dispatchEvent(
			new CustomEvent("clockSettingsChanged", {
				detail: { setting, value },
			})
		);
	};

	const handleSiteSettingChange = (setting, value) => {
		setSiteSettings((prev) => ({ ...prev, [setting]: value }));
	};

	return (
		<div className="settings-page">
			<div className="settings-header">
				<h2>Settings</h2>
				<Link to={returnPath} className="btn btn-primary">
					Save & Close
				</Link>
			</div>

			<div className="settings-content">
				{/* Map-specific Settings */}
				<div className="settings-section">
					<h3>Voyage of Despair Settings</h3>
					<p className="settings-description">
						These settings apply to all pages within Voyage of Despair.
						Configure everything for this map in one place.
					</p>

					{/* Clock Page Settings */}
					<div className="settings-card">
						<h4>Clock Page Settings</h4>

						<div className="setting-group">
							<label htmlFor="display-format">Display Format:</label>
							<select
								id="display-format"
								value={clockSettings.displayFormat}
								onChange={(e) =>
									handleClockSettingChange("displayFormat", e.target.value)
								}
								className="setting-select"
							>
								<option value="time">Time Format (01:45)</option>
								<option value="movements">Integer Format (+1/-3)</option>
							</select>
							<span className="setting-note">
								How times are displayed throughout the clock interface
							</span>
						</div>

						<div className="setting-group">
							<label htmlFor="input-method">Input Method:</label>
							<select
								id="input-method"
								value={clockSettings.inputMethod}
								onChange={(e) =>
									handleClockSettingChange("inputMethod", e.target.value)
								}
								className="setting-select"
							>
								<option value="sliders">Sliders (---o---)</option>
								<option value="steppers">Steppers (-/+)</option>
								<option value="buttons">Button Layout</option>
								<option value="text">Text Fields</option>
							</select>
							<span className="setting-note">
								How you input time values for each clock location
							</span>
						</div>
					</div>
				</div>

				{/* Site-wide Settings */}
				<div className="settings-section">
					<h3>Site-wide Settings</h3>
					<p className="settings-description">
						These settings apply across the entire application.
					</p>

					<div className="settings-card">
						<div className="setting-group">
							<label htmlFor="dark-mode">Dark Mode:</label>
							<select
								id="dark-mode"
								value={siteSettings.darkMode ? "enabled" : "disabled"}
								onChange={(e) =>
									handleSiteSettingChange(
										"darkMode",
										e.target.value === "enabled"
									)
								}
								className="setting-select"
								disabled
							>
								<option value="disabled">Disabled</option>
								<option value="enabled">Enabled (Coming Soon)</option>
							</select>
							<span className="setting-note">Coming in a future update</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default SettingsPage;
