// Docs: https://kit.svelte.dev/docs/types#app

import { Prisma, Links, User, Position } from "@prisma/client";

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

		// Interface for user update requests
		interface UserUpdateRequest {
			where: Prisma.UserWhereUniqueInput;
			user: User;
			links: Links;
		}

		// Project author data for project page, it differs from the one in the schema since
		// that's how it has to be stored since it's relational, but this is how it's used
		type ProjectAuthor = User & { position: Position };

		// interface Platform {}
		// interface PrivateEnv {}
		// interface PublicEnv {}
		// interface Session {}
		// interface Stuff {}
	}
}
