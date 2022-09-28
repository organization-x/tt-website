<script lang="ts">
	import DashHero from "$lib/components/dashboard/DashHero.svelte";

	import type { PageParentData } from "./$types";

	export let data: PageParentData;
</script>

<DashHero user={data.user} title="Your Analytics" />
