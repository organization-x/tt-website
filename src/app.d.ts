// Docs: https://kit.svelte.dev/docs/types#app

import type { DateOption } from "$lib/enums";
import type { Readable } from "svelte/store";
import type {
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
			position: string;
			user: {
				name: string;
				url: string;
			};
		}

		// Type for removing the relational userId property from the links model
		type UserLinks = Omit<Links, "userId">;

		// Type for combining a user with their associated links and pinned project
		type UserWithMetadata = User & {
			links: UserLinks;
			pinnedProject: Project?;
		};

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
				links?: UserLinks;
				pinnedProjectId?: string;
				visible?: boolean;
			};
		}

		// Interface for user search requests
		interface UserSearchRequest {
			where: Prisma.UserWhereInput;
		}

		// Type for authors on projects
		type Author = { user: User; position: Position };

		// Projects combined with their authors for easy access
		type ProjectWithMetadata = Project & {
			authors: Author[];
		};

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
				authors?: Author[];
			};
		}

		// Interface for project search requests
		interface ProjectSearchRequest {
			where: Prisma.ProjectWhereInput;
		}

		// Interface for project deletion
		interface ProjectDeleteRequest {
			id: string;
		}

		// Interface for grabbing analytics data
		interface AnalyticsRequest {
			startDate: string;
			endDate: string;
		}

		// Type for graph data that will be plotted
		type GraphData = { label: string; value: number; color: string };

		// Interface for analytics response data
		interface AnalyticsResponse {
			returning: number;
			new: number;
			prevViews: number;
			searches: number;
			prevSearches: number;
			softSkills: SoftSkill[];
			techSkills: TechSkill[];
			projects: {
				searches: number;
				prevSearches: number;
				views: GraphData[];
				scrolled: GraphData[];
				techSkills: TechSkill[];
			};
		}

		// interface Platform {}
		// interface PrivateEnv {}
		// interface PublicEnv {}
		// interface Session {}
		// interface Stuff {}
	}
}
