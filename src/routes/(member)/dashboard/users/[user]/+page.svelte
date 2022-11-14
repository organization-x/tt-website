<script lang="ts">
	import { onMount } from "svelte";
	import { writable } from "svelte/store";

	import UserEditor from "$lib/components/dashboard/UserEditor.svelte";

	import type { PageData } from "./$types";

	export let data: PageData;

	// Create a seperate user store with the grabbed user
	const user = writable(data.pageUser);

	// If the name of the user changes, update the active URL along with it
	onMount(() =>
		user.subscribe((user) =>
			history.replaceState(
				{},
				"",
				new URL(
					`/dashboard/users/${user.name
						.toLowerCase()
						.replaceAll(/\s+/g, "-")}`,
					document.location.href
				)
			)
		)
	);
</script>

<UserEditor original={user} />
