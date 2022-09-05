// Docs: https://kit.svelte.dev/docs/types#app

declare namespace App {
	interface Locals {
		session: string | null;
	}
	// interface Platform {}
	// interface PrivateEnv {}
	// interface PublicEnv {}
	interface Session {
		user: import("@prisma/client").User | null;
	}
	// interface Stuff {}
}
