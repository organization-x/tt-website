import Aws from "$lib/components/icons/logos/Aws.svelte";
import Bolt from "./components/icons/general/Bolt.svelte";
import Cog from "$lib/components/icons/general/Cog.svelte";
import Pen from "$lib/components/icons/general/Pen.svelte";
import Java from "$lib/components/icons/logos/Java.svelte";
import React from "$lib/components/icons/logos/React.svelte";
import Devto from "$lib/components/icons/logos/Devto.svelte";
import Flag from "$lib/components/icons/general/Flag.svelte";
import Chat from "$lib/components/icons/general/Chat.svelte";
import Talk from "$lib/components/icons/general/Talk.svelte";
import Group from "$lib/components/icons/general/Group.svelte";
import Layer from "$lib/components/icons/general/Layer.svelte";
import GitHub from "$lib/components/icons/logos/GitHub.svelte";
import Python from "$lib/components/icons/logos/Python.svelte";
import Brain from "$lib/components/icons/general/Brain.svelte";
import Quick from "$lib/components/icons/general/Quick.svelte";
import School from "$lib/components/icons/general/School.svelte";
import Server from "$lib/components/icons/general/Server.svelte";
import Pytorch from "$lib/components/icons/logos/Pytorch.svelte";
import Twitter from "$lib/components/icons/logos/Twitter.svelte";
import Person from "$lib/components/icons/general/Person.svelte";
import Search from "$lib/components/icons/general/Search.svelte";
import GraphQl from "$lib/components/icons/logos/GraphQL.svelte";
import Factory from "$lib/components/icons/general/Factory.svelte";
import HardHat from "$lib/components/icons/general/HardHat.svelte";
import Compass from "$lib/components/icons/general/Compass.svelte";
import TrendUp from "$lib/components/icons/general/TrendUp.svelte";
import Writing from "$lib/components/icons/general/Writing.svelte";
import Desktop from "$lib/components/icons/general/Desktop.svelte";
import LinkedIn from "$lib/components/icons/logos/LinkedIn.svelte";
import Facebook from "$lib/components/icons/logos/Facebook.svelte";
import Science from "$lib/components/icons/general/Science.svelte";
import Forward from "$lib/components/icons/general/Forward.svelte";
import Question from "$lib/components/icons/general/Question.svelte";
import LinkIcon from "$lib/components/icons/general/LinkIcon.svelte";
import BarChart from "$lib/components/icons/general/BarChart.svelte";
import Category from "$lib/components/icons/general/Category.svelte";
import Dumbbell from "$lib/components/icons/general/Dumbbell.svelte";
import Verified from "$lib/components/icons/general/Verified.svelte";
import Engineer from "$lib/components/icons/general/Engineer.svelte";
import Megaphone from "$lib/components/icons/general/Megaphone.svelte";
import JavaScript from "$lib/components/icons/logos/JavaScript.svelte";
import TensorFlow from "$lib/components/icons/logos/TensorFlow.svelte";
import StopWatch from "$lib/components/icons/general/StopWatch.svelte";
import GoogleCloud from "$lib/components/icons/logos/GoogleCloud.svelte";
import Responsible from "$lib/components/icons/general/Responsible.svelte";

import type { ComponentType } from "svelte";
import Golang from "./components/icons/logos/Golang.svelte";
import Docker from "./components/icons/logos/Docker.svelte";
import Php from "./components/icons/logos/Php.svelte";
import Tailwind from "./components/icons/logos/Tailwind.svelte";

const icons: { [key: string]: ComponentType } = {
	Marketing: TrendUp,
	Engineering: Cog,
	Design: Pen,
	Operations: HardHat,
	Product: Factory,
	Leadership: Talk,
	Data: Science,
	Frontend: Desktop,
	Backend: Server,
	Fullstack: Layer,
	Designer: Pen,
	Product_Manager: Megaphone,
	Data_Scientist: BarChart,
	Enginnering_Manager: Engineer,
	Design_Manager: Compass,
	Engineer: Cog,
	Teamwork: Group,
	Leader: Flag,
	Writing: Writing,
	Proactive: Quick,
	Time_Management: StopWatch,
	Communication: Chat,
	Critical_Thinking: Brain,
	Motivation: Forward,
	Independent: Person,
	Responsible: Responsible,
	Reliable: Verified,
	Mentor: School,
	Initiative: Bolt,
	Adaptable: Category,
	Perserverance: Dumbbell,
	Meticulous: Search,
	JavaScript: JavaScript,
	Python: Python,
	React: React,
	TensorFlow: TensorFlow,
	Pytorch: Pytorch,
	Google_Cloud: GoogleCloud,
	AWS: Aws,
	GraphQL: GraphQl,
	Java: Java,
	Golang: Golang,
	Docker: Docker,
	PHP: Php,
	Tailwind: Tailwind,

	GitHub: GitHub,
	LinkedIn: LinkedIn,
	Devto: Devto,
	Twitter: Twitter,
	Facebook: Facebook,
	Website: LinkIcon
};

// TODO: Finish adding icons and test them
// TODO: Check other TODO's
// TODO: Find additional Bugs to fix
// TODO: Make PR

// Grab corresponding icon component in relation to an enum
export const getIcon = (name: string): ComponentType => icons[name] || Question;
