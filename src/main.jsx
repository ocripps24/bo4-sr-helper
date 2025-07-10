import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./styles/main.scss";

// Handle GitHub Pages SPA redirect
const urlParams = new URLSearchParams(window.location.search);
const redirect = urlParams.get("redirect");
if (redirect) {
	// Remove the redirect parameter and navigate to the intended route
	window.history.replaceState({}, "", "/" + redirect);
}

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<BrowserRouter
			basename="/"
			future={{
				v7_startTransition: true,
				v7_relativeSplatPath: true,
			}}
		>
			<App />
		</BrowserRouter>
	</React.StrictMode>
);
