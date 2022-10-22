import type { Team, Position, SoftSkill, TechSkill } from "@prisma/client";

// These are arrays of schema enums for generating (mostly) dropdown content for slection.
// They should stay updated with the schema at all times. It is also used for TypeScript
// enums which can't easily be defined in the app namespace

export const teams: Team[] = ["Design", "Engineering", "Marketing"];

export const positions: Position[] = [
	"Backend",
	"Designer",
	"Frontend",
	"Fullstack"
];

export const softSkills: SoftSkill[] = [
	"Leadership",
	"Proactive",
	"Teamwork",
	"Writing"
];

export const techSkills: TechSkill[] = [
	"AWS",
	"Google_Cloud",
	"JavaScript",
	"Python",
	"Pytorch",
	"React",
	"TensorFlow"
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

// Enum for type of input field on the contact form
export enum BoxType {
	Field,
	Select,
	TextArea
}
