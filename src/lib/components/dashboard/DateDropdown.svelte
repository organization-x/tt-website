<script lang="ts">
	import { createEventDispatcher, onMount } from "svelte";

	import { DateOption } from "$lib/enums";
	import { debounce } from "$lib/debounce";
	import Arrow from "$lib/components/icons/general/Arrow.svelte";
	import DropdownItem from "$lib/components/DropdownItem.svelte";
	import DropArrow from "$lib/components/icons/general/DropArrow.svelte";

	const dispatch = createEventDispatcher<{
		change: undefined;
		search: { selected: DateOption; custom: Date };
	}>();

	const options = Object.values(DateOption);

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
	class="relative max-w-sm mx-auto w-full mb-8 lg:mb-12"
>
	<button
		on:click={() => (open = !open)}
		class:rounded-b-lg={!open}
		class="flex items-center justify-between p-4 w-full bg-gray-800 rounded-t-lg h-16"
	>
		<h1>
			{selected === DateOption.Custom
				? current.toLocaleDateString("en-US")
				: selected}
		</h1>
		<DropArrow {open} class="w-6 h-6" />
	</button>

	{#if open}
		<div
			class="absolute w-full h-fit inset-0 top-14 shadow-lg bg-gray-800 rounded-b-lg z-40 p-4 sm:p-6"
		>
			<div bind:this={childParent} class="relative">
				<button
					on:click={() => (childOpen = !childOpen)}
					class:rounded-b-lg={!childOpen}
					class="flex items-center justify-between p-4 w-full bg-gray-900 rounded-t-lg"
				>
					<h1>{selected}</h1>
					<DropArrow open={childOpen} class="w-6 h-6" />
				</button>

				{#if childOpen}
					<div
						class="absolute w-full h-fit flex flex-col inset-0 top-14 shadow-lg bg-gray-900 rounded-b-lg max-h-[15rem] overflow-auto z-50"
					>
						{#each options as option}
							<DropdownItem
								radio={true}
								on:click={() => (selected = option)}
								selected={selected === option}
							>
								{option.replaceAll("_", " ")}
							</DropdownItem>
						{/each}
					</div>
				{/if}
			</div>

			<div
				disabled={selected !== DateOption.Custom}
				class:opacity-70={selected !== DateOption.Custom}
				class:text-gray-500={selected !== DateOption.Custom}
				class:pointer-events-none={selected !== DateOption.Custom}
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
						>
							<Arrow class="w-5 h-5 -rotate-90" />
						</button>
						<button
							on:click={() => {
								current.setMonth(current.getMonth() + 1);
								current = current;
							}}
						>
							<Arrow class="w-5 h-5 rotate-90" />
						</button>
					</div>
				</div>
				<div class="grid grid-cols-7 grid-rows-5 gap-2 -ml-1 mt-4">
					{#each days as day, i (i)}
						<button
							on:click={() => (custom = day)}
							class:bg-blue-light={custom.toString() ===
								day.toString()}
							class="font-bold rounded-lg p-2 shrink-0 w-fit aspect-square"
						>
							{i + 1}
						</button>
					{/each}
				</div>
			</div>
		</div>
	{/if}
</div>
