module.exports = {
	extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaVersion: "latest",
	},
	plugins: ["@typescript-eslint"],
	root: true,
	env: {
		node: true,
	},
}
