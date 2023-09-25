module.exports = function (api) {
	api.cache(true);
	return {
		presets: ["babel-preset-expo"],
		plugins: [
			[
				"module:react-native-dotenv",
				{
					envName: "@env",
					moduleName: "@env",
					path: ".env",
					blockList: null,
					allowList: null,
					safe: false,
					allowUndefined: true,
					verbose: false,
				},
			],
		],
	};
};
