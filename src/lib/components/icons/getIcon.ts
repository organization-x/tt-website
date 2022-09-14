import Pen from "./Pen.svelte";
import Aws from "./Aws.svelte";
import Work from "./Work.svelte";
import Group from "./Group.svelte";
import React from "./React.svelte";
import Layer from "./Layer.svelte";
import Server from "./Server.svelte";
import Python from "./Python.svelte";
import TrendUp from "./TrendUp.svelte";
import Writing from "./Writing.svelte";
import Desktop from "./Desktop.svelte";
import Pytorch from "./Pytorch.svelte";
import Question from "./Question.svelte";
import JavaScript from "./JavaScript.svelte";
import TensorFlow from "./TensorFlow.svelte";
import GoogleCloud from "./GoogleCloud.svelte";

import type { ComponentType } from "svelte";

// Grab corresponding icon component in relation to an enum
export const getIcon = (name: string): ComponentType => {
	switch (name) {
		case "JavaScript":
			return JavaScript;
		case "Python":
			return Python;
		case "React":
			return React;
		case "TensorFlow":
			return TensorFlow;
		case "Pytorch":
			return Pytorch;
		case "Google_Cloud":
			return GoogleCloud;
		case "AWS":
			return Aws;
		case "Frontend":
			return Desktop;
		case "Backend":
			return Server;
		case "Fullstack":
			return Layer;
		case "Designer":
			return Pen;
		case "Teamwork":
			return Group;
		case "Leadership":
			return TrendUp;
		case "Writing":
			return Writing;
		case "Proactive":
			return Work;
		default:
			return Question;
	}
};
