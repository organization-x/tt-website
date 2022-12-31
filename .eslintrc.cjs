module.exports = {
	root: true,
	parser: "@typescript-eslint/parser",
	extends: [
		"prettier",
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended"
	],
	plugins: ["svelte3", "@typescript-eslint"],
	ignorePatterns: ["*.cjs"],
	overrides: [{ files: ["*.svelte"], processor: "svelte3/svelte3" }],
	settings: {
		"svelte3/typescript": () => require("typescript")
	},
	parserOptions: {
		sourceType: "module",
		ecmaVersion: 2021
	},
	env: {
		browser: true,
		es2021: true,
		node: true
	},
	rules: {
		"no-control-regex": "off",
		"no-case-declarations": "off",
		"no-mixed-spaces-and-tabs": "off",
		"@typescript-eslint/ban-ts-comment": "off",
		"@typescript-eslint/no-empty-function": "off",
		"@typescript-eslint/no-non-null-assertion": "off"
	},
	globals: {
		App: "readonly",
		NodeJS: "readonly"
	}
};
