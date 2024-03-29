<script lang="ts">
	import { getIcon } from "$lib/getIcon";
	import { createEventDispatcher } from "svelte";

	import Search from "./icons/general/Search.svelte";
	import DropdownItem from "$lib/components/DropdownItem.svelte";
	import DropArrow from "$lib/components/icons/general/DropArrow.svelte";

	const dispatch = createEventDispatcher<{
		change: { selected: string | undefined; previous: string | undefined };
	}>();

	// Provides options that should be in the dropdown, and an array of selected items to prevent re-selection of the same thing.
	// Along with an index to auto select values, since dropdowns normally are near other dropdowns with the same values.
	export let i = 0;
	export let radio = true;
	export let required: boolean;
	export let options: string[];
	export let selected: string[] = [];
	export let selectedItems: (string | null)[];

	let search = "";
	let open = false;
	let parent: HTMLDivElement;
	let filteredOptions: string[] = [];

	// Create a seperate array of filtered options for the search and also sort them
	// based of whether they are selected or not
	$: {
		// Filter based on search
		filteredOptions = options.filter((option) =>
			option.toLowerCase().includes(search.trim().toLowerCase())
		);

		// If the dropdown isn't in radio mode, put the selected items at the top
		if (!radio)
			filteredOptions = filteredOptions.sort((a, b) => {
				const aSelected = selected.includes(a);
				const bSelected = selected.includes(b);

				return aSelected === bSelected ? 0 : aSelected ? -1 : 1;
			});
	}

	// Check if click is outside of the dropdown, if so, close it
	const windowClick = ({ target }: Event) =>
		open && !parent.contains(target as Node) && (open = false);

	// Update the the selected item index when an item in the dropdown is selected and tell the parent about the new selection, used for
	// when the dropdown is in radio mode
	const radioClick = (clicked: string[]) =>
		dispatch("change", {
			selected: clicked[0],
			previous: selected[0]
		}) && (selected = clicked);

	// Add or remove the newly selected item from the selected items array, used for when the dropdown is in checkbox
	// mode. This also dispatches change so that it can be used to trigger searches since search calls break in reactive
	// statements
	const checkClick = (clicked: string) =>
		(selected.includes(clicked)
			? (selected = selected.filter((item) => item !== clicked))
			: (selected = [...selected, clicked])) &&
		dispatch("change", {
			selected: undefined,
			previous: undefined
		});

	// Interactive, when the parent element changes the selected item changes.
	// This is to prevent gaps between multiple dropdowns
	$: selectedItems,
		(selected =
			selectedItems[i] && radio
				? [selectedItems[i]!]
				: required
				? [options[0]]
				: []);

	// When the dropdown is closed, reset the search
	$: if (!open) search = "";
</script>

<svelte:window on:click={windowClick} />

<div bind:this={parent} class="relative w-full">
	<button
		on:click={() => (open = !open)}
		class:rounded-b-lg={!open}
		class="w-full flex items-center gap-4 p-4 bg-gray-800 rounded-t-lg"
	>
		<!-- If the dropdown isn't a radio it should be using the slot -->
		{#if !$$slots.default}
			<svelte:component
				this={getIcon(selected[0] || "None")}
				class="w-8 h-8 shrink-0"
			/>
		{/if}

		<slot />

		<div class="flex items-center justify-between w-full">
			<h1>
				{(selected.length &&
					(radio
						? selected[0].replaceAll("_", " ")
						: `${selected.length} selected`)) ||
					"None"}
			</h1>
			<DropArrow {open} class="w-6 h-6" />
		</div>
	</button>

	{#if open}
		<div
			class="absolute w-full flex flex-col inset-0 top-16 shadow-lg bg-gray-800 rounded-b-lg h-[15rem] overflow-auto z-50"
		>
			<div class="flex p-4 select-none w-full items-center">
				<Search class="w-5 h-5" />
				<input
					bind:value={search}
					type="text"
					class="w-full h-full px-2 bg-transparent focus:outline-none"
					placeholder="Search..."
				/>
			</div>

			{#if !required && radio}
				<DropdownItem
					on:click={() => radioClick([])}
					selected={!selected.length}
				>
					None
				</DropdownItem>
			{/if}

			{#if radio}
				{#each filteredOptions as option (option)}
					{#if !(selectedItems.includes(option) && option !== selected[0])}
						<DropdownItem
							on:click={() => radioClick([option])}
							selected={option === selected[0]}
						>
							<div class="flex items-center gap-2">
								<svelte:component
									this={getIcon(option)}
									class="w-5 h-5"
								/>
								{option.replaceAll("_", " ")}
							</div>
						</DropdownItem>
					{/if}
				{/each}
			{:else}
				{#each filteredOptions as option (option)}
					<DropdownItem
						on:click={() => checkClick(option)}
						selected={selected.includes(option)}
						radio={false}
					>
						<div class="flex items-center gap-2">
							<svelte:component
								this={getIcon(option)}
								class="w-5 h-5"
							/>
							{option.replaceAll("_", " ")}
						</div>
					</DropdownItem>
				{/each}
			{/if}
		</div>
	{/if}
</div>
