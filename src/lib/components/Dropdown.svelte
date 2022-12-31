<script lang="ts">
	import { getIcon } from "$lib/getIcon";
	import { createEventDispatcher, getContext } from "svelte";

	import Search from "$lib/icons/general/Search.svelte";
	import Scrollable from "$lib/components/Scrollable.svelte";
	import DropArrow from "$lib/icons/general/DropArrow.svelte";
	import DropdownItem from "$lib/components/DropdownItem.svelte";

	import type { Writable } from "svelte/store";

	// Provides options that should be in the dropdown, and an array of selected items to prevent re-selection of the same thing.
	// Along with an index to auto select values, since dropdowns normally are near other dropdowns with the same values.
	export let i = 0;
	export let radio = true;
	export let icons = true;
	export let open = false;
	export let lightBg = true;
	export let options: string[];
	export let required: boolean;
	export let selected: string[] = [];
	export let groupSelected: (string | null)[];

	const dispatch = createEventDispatcher<{
		change: { selected: string | undefined; previous: string | undefined };
	}>();
	const tabindex = getContext<Writable<number>>("tabindex");

	let search = "";
	let parent: HTMLDivElement;

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
	const checkClick = (index: number, clicked: string) =>
		(index > -1
			? (selected = selected.filter((_, i) => i !== index))
			: (selected = [...selected, clicked])) &&
		dispatch("change", {
			selected: undefined,
			previous: undefined
		});

	// When dropdowns are in groups, this keeps them synced together, with i
	// being the index of this dropdown in that group. This is to prevent gaps
	// between multiple dropdowns
	$: groupSelected,
		(selected =
			groupSelected[i] && radio
				? [groupSelected[i]!]
				: required
				? [options[0]]
				: []);

	// When the dropdown is closed, reset the search
	$: if (!open) search = "";
</script>

<svelte:window on:click={windowClick} />

<div bind:this={parent} class="relative w-full" aria-expanded={open}>
	<button
		on:click={() => (open = !open)}
		class:rounded-b-lg={!open}
		class:bg-gray-700={lightBg}
		class:bg-gray-900={!lightBg}
		class="w-full flex items-center gap-4 p-5 rounded-t-lg"
		tabindex={$tabindex}
	>
		<!-- If the dropdown isn't a radio it should be using the slot -->
		{#if !$$slots.default && icons}
			<svelte:component
				this={getIcon(selected[0] || "None")}
				class="w-6 h-6 shrink-0"
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
			<DropArrow {open} class="w-3 h-3" />
		</div>
	</button>

	<div
		class:hidden={!open}
		class:bg-gray-700={lightBg}
		class:bg-gray-900={!lightBg}
		class="absolute w-full inset-x-0 top-16 shadow-lg h-[18.5rem] rounded-b-lg z-50"
	>
		<div class="flex p-4 select-none w-full items-center h-14">
			<Search class="w-4 h-4" />
			<input
				bind:value={search}
				type="text"
				class="w-full h-full px-2 bg-transparent focus:outline-none"
				placeholder="Search..."
			/>
		</div>

		<Scrollable
			vertical={true}
			class="before:rounded-t-lg after:rounded-b-lg h-60 {lightBg
				? 'before:from-gray-700 after:to-gray-700'
				: 'before:from-gray-900 after:to-gray-900'}"
			innerClass="scrollbar"
		>
			{#if !required && radio}
				<DropdownItem
					on:click={() => radioClick([])}
					selected={!selected.length}
				>
					None
				</DropdownItem>
			{/if}

			{#key search}
				{#if radio}
					{@const query = search.trim().toLowerCase()}

					{#each options as option (option)}
						{#if option
							.toLowerCase()
							.includes(query) && (!groupSelected.includes(option) || groupSelected[i] === option)}
							<DropdownItem
								on:click={() => radioClick([option])}
								selected={selected.includes(option)}
							>
								<div class="flex items-center gap-3">
									{#if icons}
										<svelte:component
											this={getIcon(option)}
											class="w-5 h-5"
										/>
									{/if}

									{option.replaceAll("_", " ")}
								</div>
							</DropdownItem>
						{/if}
					{:else}
						<h1 class="text-center mt-4">No Results</h1>
					{/each}
				{:else}
					{@const query = search.trim().toLowerCase()}

					{#each options as option (option)}
						{#if option.toLowerCase().includes(query)}
							{@const index = selected.indexOf(option)}

							<DropdownItem
								on:click={() => checkClick(index, option)}
								selected={index > -1}
								radio={false}
							>
								<div class="flex items-center gap-3">
									{#if icons}
										<svelte:component
											this={getIcon(option)}
											class="w-5 h-5"
										/>
									{/if}

									{option.replaceAll("_", " ")}
								</div>
							</DropdownItem>
						{/if}
					{:else}
						<h1 class="text-center mt-4">No Results</h1>
					{/each}
				{/if}
			{/key}
		</Scrollable>
	</div>
</div>
