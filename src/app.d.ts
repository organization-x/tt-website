// Docs: https://kit.svelte.dev/docs/types#app

import {
	Prisma,
	Links,
	User,
	Position,
	Project,
	TechSkill,
	Team,
	SoftSkill
} from "@prisma/client";

declare global {
	declare namespace App {
		// Locals session token
		interface Locals {
			session: string | null;
		}

		// Landing page project developer
		interface Developer {
			name: string;
			position: string;
			url: string;
		}

		// Type for combining a user with their pinned project, used on the developers page
		type UserWithProject = User & { pinnedProject: Project };

		// Interface for user update requests
		interface UserUpdateRequest {
			where: Prisma.UserWhereUniqueInput;
			user: {
				id: string;
				about?: string;
				team?: Team;
				positions?: Position[];
				softSkills?: SoftSkill[];
				techSkills?: TechSkill[];
			};
			links?: Links;
		}

		// Interface for user search requests
		interface UserSearchRequest {
			where: Prisma.UserWhereInput;
		}

		// Project author data for project page, it differs from the one in the schema since
		// that's how it has to be stored since it's relational, but this is how it's used
		type ProjectAuthor = User & { position: Position };

		// Projects combined with their authors for easy access
		type ProjectWithAuthors = Project & { authors: ProjectAuthor[] };

		// Interface for project update requests
		interface ProjectUpdateRequest {
			where: Prisma.ProjectWhereUniqueInput;
			project: {
				id: string;
				title?: string;
				description?: string;
				theme?: string;
				date?: Date;
				skills?: TechSkill[];
				content?: Prisma.InputJsonValue;
				visible?: boolean;
				pinned?: boolean;
			};
			authors?: ProjectAuthor[];
		}

		// Interface for project search requests
		interface ProjectSearchRequest {
			where: Prisma.ProjectWhereInput;
		}

		// Interface for project deletion
		interface ProjectDeleteRequest {
			id: string;
		}

		interface Box {
			type: BoxType;
			name: string;
			isValid: boolean;
			required: boolean;
			placeholder: string;
			options?: string[];
			value?: string;
			selected?: string[];
		}

		// interface Platform {}
		// interface PrivateEnv {}
		// interface PublicEnv {}
		// interface Session {}
		// interface Stuff {}
	}
}
