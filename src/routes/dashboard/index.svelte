<script context="module" lang="ts">
	import type { Load } from "@sveltejs/kit";

	// If a user tries to access the dashboard without being logged in, redirect them to the login page
	export const load: Load = async ({ session }) => {
		if (session.user) return;

		return {
			status: 302,
			redirect: "/login"
		};
	};
</script>

<h1>Dashboard</h1>
