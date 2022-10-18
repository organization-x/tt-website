<script lang="ts">
	import { onMount } from "svelte";

	import { analytics } from "$lib/analytics";

	import type { PageData } from "./$types";

	export let data: PageData;

	onMount(
		async () =>
			data.track &&
			(await analytics.track("user_projects_view", { id: data.user.id }))
	);
</script>

<h1>Projects</h1>
