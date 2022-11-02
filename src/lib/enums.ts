import type { Team, Position, SoftSkill, TechSkill } from "@prisma/client";

// These are arrays of schema enums for generating (mostly) dropdown content for slection.
// They should stay updated with the schema at all times. It is also used for TypeScript
// enums which can't easily be defined in the app namespace

export const teams: Team[] = [
	"Marketing",
	"Engineering",
	"Design",
	"Operations",
	"Product",
	"Leadership",
	"Data"
];

export const positions: Position[] = [
	"Frontend",
	"Backend",
	"Fullstack",
	"Designer",
	"Product_Manager",
	"Data_Scientist",
	"Engineer_Manager",
	"Design_Manager",
	"Engineer"
];

export const softSkills: SoftSkill[] = [
	"Teamwork",
	"Leadership",
	"Writing",
	"Proactive",
	"Time_Management",
	"Communication",
	"Critical_Thinking",
	"Motivation",
	"Independent",
	"Responsible",
	"Reliable",
	"Mentor",
	"Initiative",
	"Adaptable",
	"Perseverance",
	"Meticulous"
];

export const techSkills: TechSkill[] = [
	"JavaScript",
	"Python",
	"React",
	"TensorFlow",
	"Pytorch",
	"Google_Cloud",
	"AWS",
	"GraphQL",
	"Java",
	"Golang",
	"Docker",
	"PHP",
	"Tailwind",
	"SQL",
	"NoSQL",
	"Angular",
	"Svelte",
	"Vue",
	"Node",
	"Rust",
	"CSharp",
	"CPP",
	"C",
	"Figma",
	"Bash",
	"Deployment",
	"Deno",
	"Prisma",
	"Ruby",
	"Vercel",
	"Next",
	"Vite",
	"WebAssembly",
	"Flutter",
	"Dart",
	"Kotlin",
	"Swift",
	"Blockchain",
	"Kubernetes",
	"DevOps",
	"DevOps",
	"CICD",
	"Nuxt",
	"Git",
	"Elixir",
	"Perl"
];

// Enum for date dropdowns
export enum DateOption {
	Week = "Last 7 days",
	Month = "Last 30 days",
	Year = "Last 12 months",
	Custom = "Custom"
}

// Color array for providing unique colors on each analytics graph column
export const colors = [
	"text-blue-dark",
	"text-blue-light",
	"text-purple-dark",
	"text-purple-light",
	"text-red-dark",
	"text-red-light",
	"text-pink-dark",
	"text-pink-light",
	"text-teal-dark",
	"text-teal-light"
];

// Enum for idetifying the type of an action for expanding TipTap buttons
export const enum Action {
	Confirm,
	Open,
	Delete
}

// Enum for keeping track of what type of field is being validated on the contact form
export const enum FieldType {
	Email,
	Phone,
	Website
}
