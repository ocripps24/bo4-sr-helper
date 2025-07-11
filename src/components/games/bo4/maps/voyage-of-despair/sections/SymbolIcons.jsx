// SVG icons for the four clock symbols in Voyage of Despair
// Using the actual game symbols provided by the user

export const TriangleUpIcon = ({ size = 32, className = "" }) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 210.14 181.99"
		className={className}
		xmlns="http://www.w3.org/2000/svg"
	>
		<polygon
			points="105.07 5 205.81 179.49 4.33 179.49 105.07 5"
			fill="none"
			stroke="#000"
			strokeMiterlimit="10"
			strokeWidth="8"
		/>
	</svg>
);

export const TriangleDownIcon = ({ size = 32, className = "" }) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 210.14 181.99"
		className={className}
		xmlns="http://www.w3.org/2000/svg"
	>
		<polygon
			points="105.07 176.99 4.33 2.5 205.81 2.5 105.07 176.99"
			fill="none"
			stroke="#000"
			strokeMiterlimit="10"
			strokeWidth="8"
		/>
	</svg>
);

export const TriangleUpDashIcon = ({ size = 32, className = "" }) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 210.14 181.99"
		className={className}
		xmlns="http://www.w3.org/2000/svg"
	>
		<polygon
			points="105.07 5 205.81 179.49 4.33 179.49 105.07 5"
			fill="none"
			stroke="#000"
			strokeMiterlimit="10"
			strokeWidth="8"
		/>
		<line
			x1="17.45"
			y1="78.87"
			x2="192.69"
			y2="78.87"
			fill="none"
			stroke="#000"
			strokeMiterlimit="10"
			strokeWidth="8"
		/>
	</svg>
);

export const TriangleDownDashIcon = ({ size = 32, className = "" }) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 210.14 181.99"
		className={className}
		xmlns="http://www.w3.org/2000/svg"
	>
		<polygon
			points="105.07 176.99 4.33 2.5 205.81 2.5 105.07 176.99"
			fill="none"
			stroke="#000"
			strokeMiterlimit="10"
			strokeWidth="8"
		/>
		<line
			x1="17.45"
			y1="102.43"
			x2="192.69"
			y2="102.43"
			fill="none"
			stroke="#000"
			strokeMiterlimit="10"
			strokeWidth="8"
		/>
	</svg>
);

export const SYMBOL_ICONS = {
	"triangle-up": TriangleUpIcon,
	"triangle-down": TriangleDownIcon,
	"triangle-up-dash": TriangleUpDashIcon,
	"triangle-down-dash": TriangleDownDashIcon,
};

export const SYMBOL_NAMES = {
	"triangle-up": "Triangle Up",
	"triangle-down": "Triangle Down",
	"triangle-up-dash": "Triangle Up-Dash",
	"triangle-down-dash": "Triangle Down-Dash",
};
