<script lang="ts">
	import { fly } from "svelte/transition";

	import { user } from "$lib/stores";
	import { DateOption } from "$lib/enums";
	import Kudo from "$lib/components/Kudo.svelte";
	import DateDropdown from "$lib/components/DateDropdown.svelte";
	import DashHero from "$lib/components/dashboard/DashHero.svelte";
	import DashWrap from "$lib/components/dashboard/DashWrap.svelte";
	import DashButton from "$lib/components/dashboard/DashButton.svelte";

	import type { PageData } from "./$types";

	export let data: PageData;

	let custom: Date;
	let kudos: App.Kudo[] = [];
	let selected = DateOption.Week;

	// Store the mode that the analytics are in, admins can switch between personal and global analytics
	let mode: "global" | "personal" =
		$user.role === "Admin" ? "global" : "personal";

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

	<!-- TODO: All kudos endpoint -->

	{#if $user.role === "Admin"}
		<div
			class="flex gap-4 justify-center max-w-sm mx-auto mb-8 lg:mb-12 lg:-mt-4"
		>
			<DashButton
				on:click={() => (mode = "global")}
				disabled={mode === "global"}
				class="flex-1 bg-gray-900 opacity-60 hover:bg-gray-900/60 disabled:hover:bg-gray-900 disabled:opacity-100"
			>
				Global
			</DashButton>

			<DashButton
				on:click={() => (mode = "personal")}
				disabled={mode === "personal"}
				class="flex-1 bg-gray-900 opacity-60 hover:bg-gray-900/60 disabled:hover:bg-gray-900 disabled:opacity-100{mode ===
				'personal'
					? ''
					: ' opacity-60'}"
			>
				Personal
			</DashButton>
		</div>
	{/if}

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
