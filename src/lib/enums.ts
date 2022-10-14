import type { Team, Position, SoftSkill, TechSkill } from "@prisma/client";

// These are arrays of schema enums for generating (mostly) dropdown content for slection.
// They should stay updated with the schema at all times

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

// Enum for type of input field on the contact form
export enum BoxType {
	Field,
	Select,
	TextArea
}
