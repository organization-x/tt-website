<script lang="ts">
	import { onMount } from "svelte";

	import type { PageData } from "./$types";

	export let data: PageData;

	onMount(async () => {
		if (!data.track) return;

		import("$lib/analytics")
			.then(
				async ({ analytics }) =>
					await await analytics.track("user_view", {
						id: data.userPage.id
					})
			)
			.catch(() => {});
	});
</script>

<slot />
