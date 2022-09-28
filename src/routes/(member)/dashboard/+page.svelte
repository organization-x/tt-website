<script lang="ts">
	import DashHero from "$lib/components/dashboard/DashHero.svelte";

	import type { PageData } from "./$types";

	export let data: PageData;

	const greet = (hour: number) => {
		if (hour < 12) return "Good morning";
		if (hour < 17) return "Good afternoon";
		return "Good evening";
	};
</script>

<DashHero
	user={data.user}
	title="{greet(new Date().getHours())}, {data.user.name.split(' ')[0]}"
/>
