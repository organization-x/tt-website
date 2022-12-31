<script lang="ts">
	import { fly } from "svelte/transition";

	import { user } from "$lib/stores";
	import { DateOption } from "$lib/enums";
	import DashHero from "../DashHero.svelte";
	import DashWrap from "../DashWrap.svelte";
	import GlobalKudo from "./GlobalKudo.svelte";
	import DashButton from "../DashButton.svelte";
	import Kudo from "$lib/components/Kudo.svelte";
	import GlobalKudoLoading from "./GlobalKudoLoading.svelte";
	import KudoLoading from "$lib/components/KudoLoading.svelte";
	import DateDropdown from "$lib/components/DateDropdown.svelte";

	let kudos: App.Kudo[] = [];
	let parent: HTMLDivElement;
	let modeDebounce: NodeJS.Timeout;

	// Store the selected start and end dates
	let dates: { startDate: Date | null; endDate: Date | null } = {
		startDate: null,
		endDate: null
	};

	// Store the mode that the analytics are in, admins can switch between personal and global analytics
	let mode: "global" | "personal" =
		$user.role === "Admin" ? "global" : "personal";

	mode = "personal";

	// As the user scrolls, more kudos will load dynamically so keep track of the page
	// and the total of amount pages
	let page = 1;
	let pages = 0;

	// Keep track of the current request so that we don't fetch pages while another is still loading
	let request: Promise<void> | null = new Promise(() => {});

	// Keep track of whether this request is because of scrolling or because of a date switch
	let scroll = false;

	const onSearch = () => {
		const query = fetch(
			`/api/kudos?id=${
				$user.id
			}&startDate=${dates.startDate!.toISOString()}&endDate=${dates.endDate!.toISOString()}&mode=${mode}&page=${page}`
		)
			.then((res) => res.json())
			.then((data: App.KudosResponse) => {
				if (page > 1) kudos = [...kudos, ...data.kudos];
				else kudos = data.kudos;

				pages = data.pages;
				request = null;
				scroll = false;
			});

		// If this is a scroll request dont have the top level await
		// destroy all the components, instead just play the loading animation
		// at the end of the scroll
		request = scroll ? null : query;
	};

	// Show loading animation on mode switch while waiting for debounce
	$: mode, (request = new Promise(() => {}));

	// Debounce for mode switching
	const changeMode = () => {
		clearTimeout(modeDebounce);

		modeDebounce = setTimeout(onSearch, 300);
	};
</script>

<svelte:window
	on:scroll={() =>
		!request &&
		!scroll &&
		kudos.length &&
		pages > 1 &&
		page + 1 <= pages &&
		window.scrollY / document.body.clientHeight > 0.5 &&
		(page += 1) &&
		(scroll = true) &&
		onSearch()}
/>

<svelte:head>
	<title>Kudos Manager</title>
</svelte:head>

<DashWrap>
	<DashHero title={$user.role === "Admin" ? "Kudos" : "Your Kudos"} />

	<DateDropdown
		on:search={({ detail }) => {
			page = 1;
			scroll = false;

			// Set the promise so it will show the animation
			request = new Promise(() => {});

			const startDate =
				detail.selected === DateOption.Custom
					? detail.custom
					: new Date();

			switch (detail.selected) {
				case DateOption.Week:
					startDate.setDate(startDate.getDate() - 7);

					break;
				case DateOption.Month:
					startDate.setMonth(startDate.getMonth() - 1);

					break;
				case DateOption.Half:
					startDate.setMonth(startDate.getMonth() - 6);

					break;
				case DateOption.Year:
					startDate.setFullYear(startDate.getFullYear() - 1);
			}

			dates.startDate = startDate;
			dates.endDate =
				detail.selected === DateOption.Custom
					? detail.custom
					: new Date();

			onSearch();
		}}
	/>

	{#if $user.role === "Admin"}
		<div
			class="flex gap-4 justify-center max-w-sm mx-auto mb-8 lg:mb-12 lg:-mt-4"
		>
			<DashButton
				on:click={() => (mode = "global") && changeMode()}
				disabled={mode === "global"}
				class="flex-1 bg-gray-900 opacity-60 hover:bg-gray-900/60 disabled:hover:bg-gray-900 disabled:opacity-100"
			>
				Global
			</DashButton>

			<DashButton
				on:click={() => (mode = "personal") && changeMode()}
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

	<div bind:this={parent} class="flex flex-col gap-10 pt-4">
		{#await request}
			{#if mode === "global"}
				{#each { length: 10 } as _}
					<GlobalKudoLoading />
				{/each}
			{:else}
				{#each { length: 10 } as _}
					<KudoLoading />
				{/each}
			{/if}
		{:then}
			{#if kudos.length}
				{#if mode === "global"}
					{#each kudos as kudo (kudo)}
						<GlobalKudo {kudo} />
					{/each}

					{#if scroll}
						{#each { length: 10 } as _}
							<GlobalKudoLoading />
						{/each}
					{/if}
				{:else}
					{#each kudos as kudo (kudo)}
						<Kudo {kudo} lightBg={false} />
					{/each}

					{#if scroll}
						{#each { length: 10 } as _}
							<KudoLoading />
						{/each}
					{/if}
				{/if}
			{:else}
				<h1
					in:fly={{ duration: 300, y: 30, delay: 300 }}
					class="text-center font-semibold text-2xl pt-1"
				>
					No Kudos
				</h1>
			{/if}
		{/await}
	</div>
</DashWrap>
