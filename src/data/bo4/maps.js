export const BO4_MAPS = [
	{
		id: "voyage-of-despair",
		name: "Voyage of Despair",
		status: "Available",
		route: "/bo4/voyage-of-despair",
		component: () =>
			import(
				"../../components/games/bo4/maps/voyage-of-despair/VoyageOfDespair.jsx"
			),
		available: true,
		tools: ["clocks", "outlets", "planets"],
		difficulty: "medium",
	},
	{
		id: "blood-of-the-dead",
		name: "Blood of the Dead",
		status: "Coming soon",
		route: "/bo4/blood-of-the-dead",
		component: null,
		available: false,
		tools: ["TBC"],
		difficulty: "hard",
	},
	{
		id: "ix",
		name: "IX",
		status: "Coming later",
		route: "/bo4/ix",
		component: null,
		available: false,
		tools: ["TBC"],
		difficulty: "medium",
	},
	{
		id: "classified",
		name: "Classified",
		status: "Coming soon",
		route: "/bo4/classified",
		component: null,
		available: false,
		tools: ["Codes"],
		difficulty: "easy",
	},
	{
		id: "dead-of-the-night",
		name: "Dead of the Night",
		status: "Under review",
		route: "/bo4/dead-of-the-night",
		component: null,
		available: false,
		tools: ["TBC"],
		difficulty: "medium",
	},
	{
		id: "alpha-omega",
		name: "Alpha Omega",
		status: "Coming soon",
		route: "/bo4/alpha-omega",
		component: null,
		available: false,
		tools: ["Codes"],
		difficulty: "medium",
	},
	{
		id: "ancient-evil",
		name: "Ancient Evil",
		status: "Under review",
		route: "/bo4/ancient-evil",
		component: null,
		available: false,
		tools: ["TBC"],
		difficulty: "medium",
	},
	{
		id: "tag-der-toten",
		name: "Tag der Toten",
		status: "Coming later",
		route: "/bo4/tag-der-toten",
		component: null,
		available: false,
		tools: ["TBC"],
		difficulty: "hard",
	},
];

export const getBO4MapById = (mapId) => {
	return BO4_MAPS.find((map) => map.id === mapId) || null;
};

export const getAvailableBO4Maps = () => {
	return BO4_MAPS.filter((map) => map.available);
};
