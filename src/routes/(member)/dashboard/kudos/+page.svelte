<script lang="ts">
	import { fly } from "svelte/transition";

	import { user } from "$lib/stores";
	import { DateOption } from "$lib/enums";
	import Kudo from "$lib/components/Kudo.svelte";
	import DateDropdown from "$lib/components/DateDropdown.svelte";
	import DashHero from "$lib/components/dashboard/DashHero.svelte";
	import DashWrap from "$lib/components/dashboard/DashWrap.svelte";

	import type { PageData } from "./$types";

	export let data: PageData;

	let custom: Date;
	let kudos: App.Kudo[] = [];
	let selected = DateOption.Week;

	const onSearch = () => {
		switch (selected) {
			case DateOption.Week:
				kudos = data.kudos.filter(
					(kudo) =>
						new Date(kudo.timestamp).getTime() >
						Date.now() - 1000 * 60 * 60 * 24 * 7
				);

				break;
			case DateOption.Month:
				kudos = data.kudos.filter(
					(kudo) =>
						new Date(kudo.timestamp).getTime() >
						Date.now() - 1000 * 60 * 60 * 24 * 30
				);

				break;
			case DateOption.Year:
				kudos = data.kudos.filter(
					(kudo) =>
						new Date(kudo.timestamp).getTime() >
						Date.now() - 1000 * 60 * 60 * 24 * 365
				);

				break;
			case DateOption.Custom:
				kudos = data.kudos.filter(
					(kudo) =>
						new Date(kudo.timestamp).toLocaleDateString("en-CA") ===
						custom.toLocaleDateString("en-CA")
				);

				break;
		}
	};
</script>

<svelte:head>
	<title>Kudos Manager</title>
</svelte:head>

<DashWrap>
	<DashHero title={$user.role === "Admin" ? "Kudos" : "Your Kudos"} />

	<DateDropdown
		on:search={({ detail }) =>
			(selected = detail.selected) &&
			(custom = detail.custom) &&
			onSearch()}
	/>

	{#if kudos.length}
		<div
			transition:fly={{ duration: 300, y: 30 }}
			class="flex flex-col gap-10 pt-4"
		>
			{#each kudos as kudo}
				<Kudo {kudo} lightBg={false} />
			{/each}
		</div>
	{:else}
		<h1
			in:fly={{ duration: 300, y: 30, delay: 300 }}
			class="text-center font-semibold text-2xl pt-1"
		>
			No Kudos
		</h1>
	{/if}
</DashWrap>
