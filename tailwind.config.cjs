const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import("tailwindcss").Config} */
module.exports = {
	content: [
		"./src/**/*.{html,svelte}",
		"./src/lib/tiptapExtensions.ts",
		"./src/lib/enums.ts"
	],
	theme: {
		fontFamily: {
			main: ["Lato", ...defaultTheme.fontFamily.sans]
		},
		colors: {
			transparent: "transparent",
			current: "currentColor",
			black: "#000",
			white: "#FFF",
			gray: {
				400: "#707680",
				500: "#2F2E2E",
				700: "#222222",
				800: "#1A1A1A",
				900: "#151515"
			},
			red: {
				light: "#F83737",
				dark: "#C61111"
			},
			pink: {
				light: "#F837CE",
				dark: "#BA15B3"
			},
			purple: {
				light: "#C44AF2",
				dark: "#950BE4"
			},
			teal: {
				light: "#12F1FF",
				dark: "#07A7CB"
			},
			blue: {
				light: "#2898FF",
				dark: "#134EC2"
			},
			green: {
				light: "#1FBD67",
				dark: "#069A6E"
			}
		},
		extend: {
			screens: {
				sm: "425px",
				md: "600px",
				lg: "1024px",
				"3xl": "1600px"
			},
			backgroundImage: {
				"gradient-radial":
					"radial-gradient(var(--tw-gradient-from) 30%, var(--tw-gradient-to))",
				"gradient-conic":
					"conic-gradient(var(--tw-gradient-from), var(--tw-gradient-to))"
			},
			transitionProperty: {
				widpad: "width, padding",
				border: "border, border-radius"
			},
			inset: {
				18: "4.5rem",
				0.5: "0.125rem"
			},
			lineHeight: {
				14: "3.5rem"
			},
			height: {
				15: "3.75rem",
				100: "25rem",
				104: "26rem"
			},
			minHeight: {
				72: "18rem"
			},
			maxWidth: {
				60: "15rem"
			},
			padding: {
				18: "4.5rem"
			},
			animation: {
				grays: "grays 2s cubic-bezier(0.4, 0, 0.6, 1) infinite"
			},
			keyframes: {
				grays: {
					"0%, 100%": {
						"background-color": "var(--tw-gradient-from)"
					},

					"50%": {
						"background-color": "var(--tw-gradient-to)"
					}
				}
			}
		}
	},
	plugins: []
};
