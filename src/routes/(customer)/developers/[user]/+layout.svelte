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

<svelte:head>
	<title>{data.userPage.name} / Team Tomorrow</title>

	<meta name="description" content={data.userPage.about} />

	<!-- OpenGraph data with user info -->
	<meta property="og:title" content="{data.userPage.name} / Team Tomorrow" />
	<meta name="og:description" content={data.userPage.about} />
	<meta
		name="og:image"
		src="https://imagedelivery.net/XcWbJUZNkBuRbJx1pRJDvA/avatar-{data
			.userPage.id}/avatar"
	/>
	<meta
		name="og:image:secure_url"
		content="https://imagedelivery.net/XcWbJUZNkBuRbJx1pRJDvA/avatar-{data
			.userPage.id}/avatar"
	/>
	<meta name="og:image:width" content="512" />
	<meta name="og:image:height" content="512" />
	<meta name="og:image:alt" content="{data.userPage.name}'s avatar" />

	<!-- Twitter card data with user info -->
	<meta
		property="twitter:title"
		content="{data.userPage.name} / Team Tomorrow"
	/>
	<meta name="twitter:description" content={data.userPage.about} />
	<meta
		name="twitter:image"
		src="https://imagedelivery.net/XcWbJUZNkBuRbJx1pRJDvA/avatar-{data
			.userPage.id}/avatar"
	/>
</svelte:head>

<slot />
