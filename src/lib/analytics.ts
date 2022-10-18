import Analytics from "analytics";
// This plugin has JSDoc types but they aren't recognized by TypeScript
// @ts-ignore
import google from "@analytics/google-analytics";

// Register google analytics
export const analytics = Analytics({
	app: "TT Website",
	debug: true,
	plugins: [
		google({
			measurementIds: ["G-KMDLLL5CDH"]
		})
	]
});
