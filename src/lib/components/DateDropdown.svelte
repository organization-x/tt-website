<script lang="ts">
	import { createEventDispatcher, onMount, getContext } from "svelte";

	import { DateOption } from "$lib/enums";
	import { debounce } from "$lib/debounce";
	import Arrow from "$lib/icons/general/Arrow.svelte";
	import Scrollable from "$lib/components/Scrollable.svelte";
	import DropArrow from "$lib/icons/general/DropArrow.svelte";
	import DropdownItem from "$lib/components/DropdownItem.svelte";

	import type { Writable } from "svelte/store";

	// Provide special styling when on the profile page vs the dashboard
	export let profile = false;

	const options = Object.values(DateOption);
	const tabindex = getContext<Writable<number>>("tabindex");
	const dispatch = createEventDispatcher<{
		change: undefined;
		search: { selected: DateOption; custom: Date };
	}>();

	let open = false;
	let days: Date[];
	let childOpen = false;
	let parent: HTMLDivElement;
	let selected = DateOption.Week;
	let childParent: HTMLDivElement;

	// Keep track of the current date the calender ui is on, default is the current day
	let current = new Date();

	// Reset the current and custom dates to midnight so the comparisons work properly
	current.setHours(0, 0, 0, 0);

	// Keep track of the custom date selected, starts off as the current
	let custom = current;

	// Store iterable data for generating the calender
	$: {
		const month = current.getMonth();
		const year = current.getFullYear();
		const date = new Date(year, month, 0).getDate();

		days = Array.from(
			{ length: date },
			(_, i) => new Date(year, month, i + 1)
		);
	}

	// Check if click is outside of the dropdown, if so, close it
	const windowClick = ({ target }: Event) => {
		if (open && !parent.contains(target as Node)) {
			open = false;
			childOpen = false;
		} else if (childParent && !childParent.contains(target as Node))
			childOpen = false;
	};

	// Notify parent of an immediate change so the loading animation gets triggered.
	// The reason bind isn't used here is because the two variables make it weird
	$: selected, custom, dispatch("change");

	// Dispatch an initial search on page load so content is loaded
	onMount(() => dispatch("search", { selected, custom }));
</script>

<svelte:window on:click={windowClick} />

<div
	bind:this={parent}
	use:debounce={{
		bind: selected && custom,
		func: () => {
			dispatch("search", { selected, custom });
		},
		delay: 300
	}}
	class:max-w-sm={!profile}
	class:mx-auto={!profile}
	class:mb-8={!profile}
	class:lg:mb-12={!profile}
	class="relative w-full"
>
	<button
		on:click={() => (open = !open)}
		class:rounded-b-lg={!open}
		class:bg-gray-900={!profile}
		class:bg-gray-700={profile}
		class="flex items-center justify-between p-5 w-full rounded-t-lg h-16"
		tabindex={$tabindex}
	>
		<h1>
			{selected === DateOption.Custom
				? custom.toLocaleDateString("en-US")
				: selected}
		</h1>

		<DropArrow {open} class="w-3 h-3" />
	</button>

	{#if open}
		<div
			class:bg-gray-900={!profile}
			class:bg-gray-700={profile}
			class="absolute w-full h-fit inset-0 top-14 shadow-lg rounded-b-lg z-40 p-3 sm:p-5 md:p-6"
		>
			<div bind:this={childParent} class="relative">
				<button
					on:click={() => (childOpen = !childOpen)}
					class:rounded-b-lg={!childOpen}
					class:bg-gray-700={!profile}
					class:bg-gray-500={profile}
					class="flex items-center justify-between p-5 w-full bg-gray-700 rounded-t-lg"
				>
					<h1>{selected}</h1>
					<DropArrow open={childOpen} class="w-3 h-3" />
				</button>

				{#if childOpen}
					<div
						class:bg-gray-500={profile}
						class:bg-gray-700={!profile}
						class="absolute inset-0 top-14 shadow-lg rounded-b-lg z-50 h-[15rem]"
					>
						<Scrollable
							vertical={true}
							class="before:rounded-t-lg after:rounded-b-lg h-60 {profile
								? 'before:from-gray-500 after:to-gray-500'
								: 'before:from-gray-700 after:to-gray-700'}"
							innerClass="scrollbar"
						>
							{#each options as option (option)}
								<DropdownItem
									radio={true}
									on:click={() => (selected = option)}
									selected={selected === option}
								>
									{option}
								</DropdownItem>
							{/each}
						</Scrollable>
					</div>
				{/if}
			</div>

			<div
				class:opacity-70={selected !== DateOption.Custom}
				class:text-gray-500={selected !== DateOption.Custom}
				class:pointer-events-none={selected !== DateOption.Custom}
				aria-disabled={selected !== DateOption.Custom}
				class="mt-6"
			>
				<div class="flex justify-between">
					<h1 class="font-semibold">
						{current.toLocaleString("en-US", {
							month: "long",
							year: "numeric"
						})}
					</h1>
					<div class="flex gap-2">
						<button
							on:click={() => {
								current.setMonth(current.getMonth() - 1);
								current = current;
							}}
							tabindex={selected !== DateOption.Custom
								? -1
								: $tabindex}
						>
							<Arrow class="w-4 h-4 -rotate-90" />
						</button>
						<button
							on:click={() => {
								current.setMonth(current.getMonth() + 1);
								current = current;
							}}
							tabindex={selected !== DateOption.Custom
								? -1
								: $tabindex}
						>
							<Arrow class="w-4 h-4 rotate-90" />
						</button>
					</div>
				</div>

				<div class="grid grid-cols-7 grid-rows-5 gap-2 mt-4">
					{#each days as day, i}
						{@const active =
							custom.toLocaleDateString("en-CA") ===
								day.toLocaleDateString("en-CA") &&
							selected === DateOption.Custom}

						<button
							on:click={() => (custom = day)}
							class:max-md:text-blue-light={active}
							class:md:bg-blue-light={active}
							class:text-gray-500={selected !== DateOption.Custom}
							class="font-bold p-1.5 aspect-square sm:text-[1.07rem] md:rounded-lg"
							tabindex={selected !== DateOption.Custom
								? -1
								: $tabindex}
						>
							{i + 1}
						</button>
					{/each}
				</div>
			</div>
		</div>
	{/if}
</div>
