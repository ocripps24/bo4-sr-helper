import { Link } from "react-router-dom";
import "../styles/main.scss";

function NotFound() {
	return (
		<div className="not-found-container">
			<div className="not-found-content">
				<div className="error-code">404</div>
				<div className="message">Page Not Found</div>
				<div className="description">
					The page you're looking for doesn't exist.
				</div>
				<Link to="/" className="home-link">
					Go to Homepage
				</Link>
			</div>
		</div>
	);
}

export default NotFound;
