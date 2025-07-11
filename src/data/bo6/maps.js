export const BO6_MAPS = [
	{
		id: "terminus",
		name: "Terminus",
		description: "Advanced research facility speedrun tools",
		route: "/bo6/terminus",
		component: () =>
			import("../../components/games/bo6/maps/terminus/Terminus.jsx"),
		available: true,
		tools: [], // Will be defined as we build the tools
		difficulty: "medium",
	},
	{
		id: "liberty-falls",
		name: "Liberty Falls",
		description: "Coming soon",
		route: "/bo6/liberty-falls",
		component: null,
		available: false,
		tools: [],
		difficulty: "easy",
	},
];

export const getBO6MapById = (mapId) => {
	return BO6_MAPS.find((map) => map.id === mapId) || null;
};

export const getAvailableBO6Maps = () => {
	return BO6_MAPS.filter((map) => map.available);
};
