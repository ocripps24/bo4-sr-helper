export const BO6_MAPS = [
	{
		id: "liberty-falls",
		name: "Liberty Falls",
		status: "Not planned",
		route: "/bo6/liberty-falls",
		component: null,
		available: false,
		tools: ["N/A"],
		difficulty: "easy",
	},
	{
		id: "terminus",
		name: "Terminus",
		status: "Available",
		route: "/bo6/terminus",
		component: () =>
			import("../../components/games/bo6/maps/terminus/Terminus.jsx"),
		available: true,
		tools: ["Nathan code", "Code Calculator"],
		difficulty: "medium",
	},
	{
		id: "citadelle-des-morts",
		name: "Citadelle des Morts",
		status: "Development in progress",
		route: "/bo6/citadelle-des-morts",
		component: null,
		available: false,
		tools: ["Pages/Traps"],
		difficulty: "medium",
	},
	{
		id: "the-tomb",
		name: "The Tomb",
		status: "Coming later",
		route: "/bo6/the-tomb",
		component: null,
		available: false,
		tools: ["Upgrade symbols"],
		difficulty: "easy",
	},
	{
		id: "shattered-veil",
		name: "Shattered Veil",
		status: "Development in progress",
		route: "/bo6/shattered-veil",
		component: null,
		available: false,
		tools: ["Chalkboard", "Safe Code"],
		difficulty: "easy",
	},
	{
		id: "the-reckoning",
		name: "The Reckoning",
		status: "Not released",
		route: "/bo6/the-reckoning",
		component: null,
		available: false,
		tools: ["N/A"],
		difficulty: "easy",
	},
];

export const getBO6MapById = (mapId) => {
	return BO6_MAPS.find((map) => map.id === mapId) || null;
};

export const getAvailableBO6Maps = () => {
	return BO6_MAPS.filter((map) => map.available);
};
