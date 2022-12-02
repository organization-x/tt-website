// Docs: https://kit.svelte.dev/docs/types#app

import type {
	Prisma,
	Links,
	User,
	Position,
	Project,
	TechSkill,
	Team,
	SoftSkill,
	Endorsement,
	Role
} from "@prisma/client";

declare global {
	declare namespace App {
		// Locals session token
		interface Locals {
			session: string | null;
		}

		// Interface for the landing page developer cards
		interface Developer {
			id: string;
			team: Team | null;
			name: string;
			about: string;
			softSkills: SoftSkill[];
			techSkills: TechSkill[];
		}

		// Type for removing the relational userId property from the links model
		type UserLinks = Omit<Links, "userId">;

		// Type for combining a user with their associated links and pinned project
		type UserWithMetadata = User & {
			links: UserLinks;
			pinnedProject: Project?;
			endorsementsReceived: Endorsement[];
		};

		// Interface of a stripped down User object for endorsers on the profile page
		interface Endorser {
			id: string;
			url: string;
			name: string;
		}

		// Interface for user update requests
		interface UserUpdateRequest {
			id: string;
			role?: Role;
			name?: string;
			about?: string;
			team?: Team;
			positions?: Position[];
			softSkills?: SoftSkill[];
			techSkills?: TechSkill[];
			links?: UserLinks;
			pinnedProjectId?: string;
			visible?: boolean;
			homepage?: boolean;
		}

		// Type for authors on projects
		type Author = {
			user: Pick<User, "id" | "name" | "url">;
			position: Position;
		};

		// Projects combined with their authors for easy access
		type ProjectWithMetadata = Project & {
			authors: Author[];
		};

		// Project with dates encoded as strings for yjs collaboration state
		type SharedProject = Omit<App.ProjectWithMetadata, "date"> & {
			date: string;
		};

		// Interface for project update requests
		interface ProjectUpdateRequest {
			id: string;
			title?: string;
			description?: string;
			theme?: string;
			date?: Date;
			skills?: TechSkill[];
			content?: Prisma.InputJsonValue;
			images: string[];
			visible?: boolean;
			authors?: Author[];
		}

		// Interface for project creation response data
		interface ProjectCreateResponse {
			url: string;
		}

		// Interface for project deletion
		interface ProjectDeleteRequest {
			id: string;
		}

		// Type for graph data that will be plotted
		type GraphData = { label: string; value: number; color: string };

		// Interface for personal analytics response data
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

		// Interface for user manager analytics response data
		interface UsersAnalyticsResponse {
			[id: string]: {
				new: number;
				returning: number;
			};
		}

		// Interface for contact form email requests
		interface MailRequest {
			[key: string]: MailRequest[keyof MailRequest];
			firstName: string;
			lastName: string;
			email: string;
			phone?: string;
			company: string;
			talent: string[];
			website: string;
			doing: string;
			refer?: string;
			subject: string;
			message: string;
			developers: {
				id: string;
				name: string;
				url: string;
			}[];
		}

		// Interface for contact form response data
		interface MailResponse {
			success: boolean;
		}

		// Interface for endorsement add/remove requests
		interface EndorsementRequest {
			id: string | number;
			endorsing: boolean;
			softSkill?: SoftSkill;
			techSkill?: TechSkill;
		}

		// Interface for image upload response data
		interface ImageUploadResponse {
			id?: string;
			theme?: string;
		}

		// Interface for a singular kudo with stripped data
		interface Kudo {
			id: string;
			name: string;
			reason: string;
			type: "sent" | "received";
			timestamp: string;
		}

		// Interface for Discord bot kudos response
		interface KudosResponse {
			ck: {
				id: number;
				reason: string;
				receiver: {
					id: string;
					hippoId?: string;
				};
				receiverId: string;
				sender: {
					id: string;
					hippoId?: string;
				};
				senderId: string;
				timestamp: string;
			}[];
			page: number;
			pageSize: number;
			totalPages: number;
		}

		// Interface for URL metadata responses
		interface UrlMetadataResponse {
			title: string;
			icon: string | null;
		}

		// interface Platform {}
		// interface PrivateEnv {}
		// interface PublicEnv {}
		// interface Session {}
		// interface Stuff {}
	}
}
