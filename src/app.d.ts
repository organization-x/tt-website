// Docs: https://kit.svelte.dev/docs/types#app

import { Prisma, Links, User } from "@prisma/client";

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

		// interface Platform {}
		// interface PrivateEnv {}
		// interface PublicEnv {}
		// interface Session {}
		// interface Stuff {}
	}
}
