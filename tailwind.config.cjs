const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import("tailwindcss").Config} */
module.exports = {
	content: ["./src/**/*.{html,svelte}"],
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
				500: "#2F2E2E",
				700: "#222222",
				800: "#1A1A1A",
				900: "#151515"
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
				lg: "1024px"
			},
			backgroundImage: {
				"gradient-radial":
					"radial-gradient(var(--tw-gradient-from) 30%, var(--tw-gradient-to))",
				"gradient-conic":
					"conic-gradient(var(--tw-gradient-from), var(--tw-gradient-to))",
				"gradient-page":
					"linear-gradient(var(--tw-gradient-from) 50%, var(--tw-gradient-to))"
			},
			transitionProperty: {
				// Ignore the dumbass names
				transhadow: "filter, transform",
				bright: "height, border-radius",
				border: "border, border-radius"
			},
			inset: {
				0.5: "0.125rem"
			},
			lineHeight: {
				14: "3.5rem"
			},
			height: {
				100: "25rem"
			}
		}
	},
	plugins: []
};
