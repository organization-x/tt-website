<script lang="ts">
	import DashHero from "$lib/components/dashboard/DashHero.svelte";
	import DateDropdown from "$lib/components/dashboard/kudos/DateDropdown.svelte";

	import type { PageParentData } from "./$types";

	enum DateOption {
		Week = "Last 7 days",
		Month = "Last 30 days",
		Year = "Last 12 months",
		Custom = "Custom"
	}

	export let data: PageParentData;

	let selected: DateOption;
</script>

<DashHero user={data.user} title="Your Kudos" />

<!-- TODO: Integrate the discord bot kudo API -->

<div class="px-6 max-w-xl mx-auto lg:max-w-screen-xl">
	<DateDropdown bind:selected />
</div>
