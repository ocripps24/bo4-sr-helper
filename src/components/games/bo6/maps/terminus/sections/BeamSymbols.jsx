// Beam Code Symbols - SVG Components
// Each symbol corresponds to a specific number value

export const BeamSymbols = {
	// Symbol 0 - Regular circle (25% smaller)
	symbol0: (
		<svg viewBox="0 0 100 100" className="beam-symbol">
			<circle
				cx="50"
				cy="50"
				r="19"
				fill="none"
				stroke="currentColor"
				strokeWidth="3"
			/>
		</svg>
	),

	// Symbol 11 - Two overlapping circles (white above, black below, rotated 45°)
	symbol11: (
		<svg viewBox="0 0 100 100" className="beam-symbol">
			<g transform="translate(50,50) rotate(45)">
				{/* Black filled circle below */}
				<circle
					cx="0"
					cy="12"
					r="18"
					fill="currentColor"
					stroke="currentColor"
					strokeWidth="2"
				/>
				{/* White unfilled circle above */}
				<circle
					cx="0"
					cy="-12"
					r="18"
					fill="none"
					stroke="currentColor"
					strokeWidth="3"
				/>
			</g>
		</svg>
	),

	// Symbol 10 - Black filled circle at top, white circle below vertically (10% smaller)
	symbol10: (
		<svg viewBox="0 0 100 100" className="beam-symbol">
			{/* Black filled circle at top */}
			<circle
				cx="50"
				cy="37"
				r="16"
				fill="currentColor"
				stroke="currentColor"
				strokeWidth="2"
			/>
			{/* White unfilled circle below */}
			<circle
				cx="50"
				cy="63"
				r="16"
				fill="none"
				stroke="currentColor"
				strokeWidth="3"
			/>
		</svg>
	),

	// Symbol 20 - Base shape: four tight ovals touching at center, rotated 90° (20% larger)
	symbol20: (
		<svg viewBox="0 0 100 100" className="beam-symbol">
			<g transform="translate(50,50) rotate(90)">
				{/* Top oval - filled */}
				<ellipse
					cx="0"
					cy="-14"
					rx="7"
					ry="14"
					fill="currentColor"
					stroke="currentColor"
					strokeWidth="2"
				/>
				{/* Right oval - outline */}
				<ellipse
					cx="14"
					cy="0"
					rx="14"
					ry="7"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
				/>
				{/* Bottom oval - filled */}
				<ellipse
					cx="0"
					cy="14"
					rx="7"
					ry="14"
					fill="currentColor"
					stroke="currentColor"
					strokeWidth="2"
				/>
				{/* Left oval - outline */}
				<ellipse
					cx="-14"
					cy="0"
					rx="14"
					ry="7"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
				/>
			</g>
		</svg>
	),

	// Symbol 22 - Same base shape as symbol 20, rotated -45° (swapped with 21, 20% larger)
	symbol22: (
		<svg viewBox="0 0 100 100" className="beam-symbol">
			<g transform="translate(50,50) rotate(-45)">
				{/* Top oval - filled */}
				<ellipse
					cx="0"
					cy="-14"
					rx="7"
					ry="14"
					fill="currentColor"
					stroke="currentColor"
					strokeWidth="2"
				/>
				{/* Right oval - outline */}
				<ellipse
					cx="14"
					cy="0"
					rx="14"
					ry="7"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
				/>
				{/* Bottom oval - filled */}
				<ellipse
					cx="0"
					cy="14"
					rx="7"
					ry="14"
					fill="currentColor"
					stroke="currentColor"
					strokeWidth="2"
				/>
				{/* Left oval - outline */}
				<ellipse
					cx="-14"
					cy="0"
					rx="14"
					ry="7"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
				/>
			</g>
		</svg>
	),

	// Symbol 21 - Same base shape as symbol 20, rotated 45° (swapped with 22, 20% larger)
	symbol21: (
		<svg viewBox="0 0 100 100" className="beam-symbol">
			<g transform="translate(50,50) rotate(45)">
				{/* Top oval - filled */}
				<ellipse
					cx="0"
					cy="-14"
					rx="7"
					ry="14"
					fill="currentColor"
					stroke="currentColor"
					strokeWidth="2"
				/>
				{/* Right oval - outline */}
				<ellipse
					cx="14"
					cy="0"
					rx="14"
					ry="7"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
				/>
				{/* Bottom oval - filled */}
				<ellipse
					cx="0"
					cy="14"
					rx="7"
					ry="14"
					fill="currentColor"
					stroke="currentColor"
					strokeWidth="2"
				/>
				{/* Left oval - outline */}
				<ellipse
					cx="-14"
					cy="0"
					rx="14"
					ry="7"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
				/>
			</g>
		</svg>
	),
};

// Symbol metadata with their corresponding values
export const SYMBOL_DATA = [
	{ id: "symbol0", value: 0, name: "Circle" },
	{ id: "symbol11", value: 11, name: "Overlapping Circles" },
	{ id: "symbol10", value: 10, name: "Vertical Circles" },
	{ id: "symbol22", value: 22, name: "Four Ovals (-45°)" },
	{ id: "symbol21", value: 21, name: "Four Ovals (45°)" },
	{ id: "symbol20", value: 20, name: "Four Ovals (90°)" },
];

// Helper function to get symbol by ID
export const getSymbolById = (id) => {
	return BeamSymbols[id] || null;
};

// Helper function to get symbol value by ID
export const getSymbolValue = (id) => {
	const symbol = SYMBOL_DATA.find((s) => s.id === id);
	return symbol ? symbol.value : null;
};
