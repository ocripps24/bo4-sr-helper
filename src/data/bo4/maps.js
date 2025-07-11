export const BO4_MAPS = [
	{
		id: "voyage-of-despair",
		name: "Voyage of Despair",
		description: "Track clocks, outlets, and planet order",
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
		description: "Coming soon",
		route: "/bo4/blood-of-the-dead",
		component: null,
		available: false,
		tools: [],
		difficulty: "hard",
	},
	{
		id: "ix",
		name: "IX",
		description: "Coming soon",
		route: "/bo4/ix",
		component: null,
		available: false,
		tools: [],
		difficulty: "easy",
	},
];

export const getBO4MapById = (mapId) => {
	return BO4_MAPS.find((map) => map.id === mapId) || null;
};

export const getAvailableBO4Maps = () => {
	return BO4_MAPS.filter((map) => map.available);
};
