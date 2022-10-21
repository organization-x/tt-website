<script lang="ts">
	import { DateOption } from "$lib/enums";
	import DashHero from "$lib/components/dashboard/DashHero.svelte";
	import DashWrap from "$lib/components/dashboard/DashWrap.svelte";
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
</script>

<svelte:head>
	<title>Kudos Manager</title>
</svelte:head>

<DashWrap>
	<DashHero title="Your Kudos" />

	<DateDropdown
		on:change={() => (request = new Promise(() => {}))}
		on:search={({ detail }) =>
			(selected = detail.selected) &&
			(custom = detail.custom) &&
			search()}
	/>
</DashWrap>
