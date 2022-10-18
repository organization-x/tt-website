<script lang="ts">
	import { user } from "$lib/stores";
	import DashHero from "$lib/components/dashboard/DashHero.svelte";
	import DashWrap from "$lib/components/dashboard/DashWrap.svelte";
	import DateDropdown from "$lib/components/dashboard/DateDropdown.svelte";

	import type { DateOption } from "$lib/enums";

	export { user as data };

	let selected: DateOption;
</script>

<svelte:head>
	<title>Kudos Manager</title>
</svelte:head>

<DashWrap>
	<DashHero title="Your Kudos" />

	<!-- TODO: Integrate the discord bot kudo API -->

	<DateDropdown bind:selected />
</DashWrap>
