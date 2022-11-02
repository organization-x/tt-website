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
import PHP from "./components/icons/logos/PHP.svelte";
import Tailwind from "./components/icons/logos/Tailwind.svelte";
import Data from "./components/icons/general/Data.svelte";
import Angular from "./components/icons/logos/Angular.svelte";
import Vue from "./components/icons/logos/Vue.svelte";
import Node from "./components/icons/logos/Node.svelte";
import Rust from "./components/icons/logos/Rust.svelte";
import CSharp from "./components/icons/logos/CSharp.svelte";
import Cpp from "./components/icons/logos/Cpp.svelte";
import C from "./components/icons/logos/C.svelte";
import Figma from "./components/icons/logos/Figma.svelte";
import Bash from "./components/icons/logos/Bash.svelte";
import Deno from "./components/icons/logos/Deno.svelte";
import PrismaLogo from "./components/icons/logos/PrismaLogo.svelte";
import Ruby from "./components/icons/logos/Ruby.svelte";
import Vercel from "./components/icons/logos/Vercel.svelte";
import Next from "./components/icons/logos/Next.svelte";
import WebAssembly from "./components/icons/logos/WebAssembly.svelte";
import Flutter from "./components/icons/logos/Flutter.svelte";
import Dart from "./components/icons/logos/Dart.svelte";
import Kotlin from "./components/icons/logos/Kotlin.svelte";
import Swift from "./components/icons/logos/Swift.svelte";
import TypeScript from "./components/icons/logos/TypeScript.svelte";
import Blocks from "./components/icons/general/Blocks.svelte";
import Kubernetes from "./components/icons/logos/Kubernetes.svelte";
import Infinite from "./components/icons/general/Infinite.svelte";
import Reload from "./components/icons/general/Reload.svelte";
import Nuxt from "./components/icons/logos/Nuxt.svelte";
import Git from "./components/icons/logos/Git.svelte";
import Elixir from "./components/icons/logos/Elixir.svelte";
import Perl from "./components/icons/logos/Perl.svelte";
import Firebase from "./components/icons/logos/Firebase.svelte";
import Unity from "./components/icons/logos/Unity.svelte";
import DigitalOcean from "./components/icons/logos/DigitalOcean.svelte";
import Tux from "./components/icons/logos/Tux.svelte";
import Nginx from "./components/icons/logos/Nginx.svelte";
import Lock from "./components/icons/general/Lock.svelte";
import Heroku from "./components/icons/logos/Heroku.svelte";
import Mongo from "./components/icons/logos/Mongo.svelte";
import Postgres from "./components/icons/logos/Postgres.svelte";
import Redis from "./components/icons/logos/Redis.svelte";
import Django from "./components/icons/logos/Django.svelte";
import Flask from "./components/icons/logos/Flask.svelte";
import Express from "./components/icons/logos/Express.svelte";

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
	TypeScript: TypeScript,
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
	PHP: PHP,
	Tailwind: Tailwind,
	SQL: Data,
	Angular: Angular,
	Vue: Vue,
	Node: Node,
	Rust: Rust,
	CSharp: CSharp,
	CPP: Cpp,
	C: C,
	Figma: Figma,
	Bash: Bash,
	Deno: Deno,
	Prisma: PrismaLogo,
	Ruby: Ruby,
	Vercel: Vercel,
	Next: Next,
	WebAssembly: WebAssembly,
	Flutter: Flutter,
	Dart: Dart,
	Kotlin: Kotlin,
	Swift: Swift,
	Blockchain: Blocks,
	Kubernetes: Kubernetes,
	DevOps: Infinite,
	CICD: Reload,
	Nuxt: Nuxt,
	Git: Git,
	Elixir: Elixir,
	Perl: Perl,
	Firebase: Firebase,
	Unity: Unity,
	DigitalOcean: DigitalOcean,
	Linux: Tux,
	Nginx: Nginx,
	Caddy: Lock,
	Heroku: Heroku,
	Mongo: Mongo,
	Postgres: Postgres,
	Redis: Redis,
	Django: Django,
	Flask: Flask,
	Express: Express,

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
