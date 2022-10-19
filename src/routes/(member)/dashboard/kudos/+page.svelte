<script lang="ts">
	import { user } from "$lib/stores";
	import { DateOption } from "$lib/enums";
	import DashHero from "$lib/components/dashboard/DashHero.svelte";
	import DashWrap from "$lib/components/dashboard/DashWrap.svelte";
	import DashLink from "$lib/components/dashboard/DashLink.svelte";
	import DateDropdown from "$lib/components/dashboard/DateDropdown.svelte";

	let custom: Date;
	let selected = DateOption.Week;
	let request: Promise<App.AnalyticsResponse> = new Promise(() => {});

	const search = async () => {
		// request = fetch(
		// 	`https://ai-camp-data-layer.fly.dev/ck/524722785302609941`
		// ).then((res) => console.log(res));
		// console.log(await request);
	};

	// TODO: CORS Issue
	// TODO: Interface from adarsh
</script>

<svelte:head>
	<title>Kudos Manager</title>
</svelte:head>

<DashWrap>
	<DashHero title="Your Kudos" />

	{#if !$user.discordId}
		<h1 class="text-lg max-w-sm mx-auto font-semibold text-center mb-6">
			You need to connect your Discord account to enable kudos
		</h1>

		<DashLink href="/discord" class="bg-blue-light max-w-sm mx-auto">
			Connect Discord
		</DashLink>
	{:else}
		<DateDropdown
			on:change={() => (request = new Promise(() => {}))}
			on:search={({ detail }) =>
				(selected = detail.selected) &&
				(custom = detail.custom) &&
				search()}
		/>
	{/if}
</DashWrap>
