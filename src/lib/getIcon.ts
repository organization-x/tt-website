import Pen from "$lib/components/icons/Pen.svelte";
import Aws from "$lib/components/icons/Aws.svelte";
import Work from "$lib/components/icons/Work.svelte";
import Group from "$lib/components/icons/Group.svelte";
import React from "$lib/components/icons/React.svelte";
import Layer from "$lib/components/icons/Layer.svelte";
import Server from "$lib/components/icons/Server.svelte";
import Python from "$lib/components/icons/Python.svelte";
import TrendUp from "$lib/components/icons/TrendUp.svelte";
import Writing from "$lib/components/icons/Writing.svelte";
import Desktop from "$lib/components/icons/Desktop.svelte";
import Pytorch from "$lib/components/icons/Pytorch.svelte";
import Question from "$lib/components/icons/Question.svelte";
import JavaScript from "$lib/components/icons/JavaScript.svelte";
import TensorFlow from "$lib/components/icons/TensorFlow.svelte";
import GoogleCloud from "$lib/components/icons/GoogleCloud.svelte";

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
