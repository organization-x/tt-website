import Cog from "$lib/components/index/Cog.svelte";
import Pen from "$lib/components/icons/Pen.svelte";
import Aws from "$lib/components/icons/Aws.svelte";
import Work from "$lib/components/icons/Work.svelte";
import Group from "$lib/components/icons/Group.svelte";
import React from "$lib/components/icons/React.svelte";
import Layer from "$lib/components/icons/Layer.svelte";
import Devto from "$lib/components/icons/Devto.svelte";
import GitHub from "$lib/components/icons/GitHub.svelte";
import Server from "$lib/components/icons/Server.svelte";
import Python from "$lib/components/icons/Python.svelte";
import TrendUp from "$lib/components/icons/TrendUp.svelte";
import Writing from "$lib/components/icons/Writing.svelte";
import Desktop from "$lib/components/icons/Desktop.svelte";
import Pytorch from "$lib/components/icons/Pytorch.svelte";
import Twitter from "$lib/components/icons/Twitter.svelte";
import Question from "$lib/components/icons/Question.svelte";
import LinkedIn from "$lib/components/icons/LinkedIn.svelte";
import Facebook from "$lib/components/icons/Facebook.svelte";
import LinkIcon from "$lib/components/icons/LinkIcon.svelte";
import JavaScript from "$lib/components/icons/JavaScript.svelte";
import TensorFlow from "$lib/components/icons/TensorFlow.svelte";
import GoogleCloud from "$lib/components/icons/GoogleCloud.svelte";

import type { ComponentType } from "svelte";

const icons: { [key: string]: ComponentType } = {
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
	Design: Pen,
	Engineering: Cog,
	Teamwork: Group,
	Leadership: Work,
	Writing: Writing,
	Proactive: TrendUp,
	Marketing: TrendUp,
	GitHub: GitHub,
	LinkedIn: LinkedIn,
	Devto: Devto,
	Twitter: Twitter,
	Facebook: Facebook,
	Website: LinkIcon
};

// Grab corresponding icon component in relation to an enum
export const getIcon = (name: string): ComponentType => icons[name] || Question;
