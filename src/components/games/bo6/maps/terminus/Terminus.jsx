import { Link } from "react-router-dom";

function Terminus() {
	return (
		<div className="terminus-page">
			<div className="terminus-header">
				<div className="terminus-nav">
					<Link to="/bo6" className="btn btn-secondary">
						<span className="btn-text">← Back to BO6 Maps</span>
						<span className="btn-icon">←</span>
					</Link>
				</div>
			</div>

			<div className="terminus-content">
				<div className="placeholder-content">
					<h2>Terminus - Coming Soon</h2>
					<p>
						Advanced speedrun tools for the Terminus map are currently under
						development.
					</p>
					<p>
						This will include specialized tracking tools for Terminus-specific
						mechanics, similar to the clock/outlet/planet tracking available for
						Voyage of Despair.
					</p>

					<div className="planned-features">
						<h3>Planned Features:</h3>
						<ul>
							<li>Terminal sequence tracking</li>
							<li>Security system navigation</li>
							<li>Research facility objectives</li>
							<li>And more...</li>
						</ul>
					</div>

					<div className="development-note">
						<p>
							<strong>Development Status:</strong> Infrastructure complete,
							tools in progress.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Terminus;
