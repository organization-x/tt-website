// Docs: https://kit.svelte.dev/docs/types#app

declare namespace App {
	interface Locals {
		user: import("@prisma/client").User;
	}
	// interface Platform {}
	// interface PrivateEnv {}
	// interface PublicEnv {}
	interface Session {
		user: import("@prisma/client").User;
	}
	// interface Stuff {}
}
