<script lang="ts">
	import { user } from "$lib/stores";
	import DashHero from "$lib/components/dashboard/DashHero.svelte";
	import DashWrap from "$lib/components/dashboard/DashWrap.svelte";
	import DateDropdown from "$lib/components/dashboard/kudos/DateDropdown.svelte";

	enum DateOption {
		Week = "Last 7 days",
		Month = "Last 30 days",
		Year = "Last 12 months",
		Custom = "Custom"
	}

	export { user as data };

	let selected: DateOption;
</script>

<DashWrap>
	<DashHero title="Your Kudos" />

	<!-- TODO: Integrate the discord bot kudo API -->

	<DateDropdown bind:selected />
</DashWrap>
