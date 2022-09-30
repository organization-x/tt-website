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

const icons: Record<string, ComponentType> = {
	JavaScript: JavaScript,
	Python: Python,
	React: React,
	TensorFlow: TensorFlow,
	Pytorch: Pytorch,
	Google_Cloud: GoogleCloud,
	AWS: Aws,
	Frontend: Desktop,
	Backend: Server,
	Fullstack: Layer,
	Designer: Pen,
	Teamwork: Group,
	Leadership: TrendUp,
	Writing: Writing,
	Proactive: Work
};

// Grab corresponding icon component in relation to an enum
export const getIcon = (name: string): ComponentType => icons[name] ?? Question;
