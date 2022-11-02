<script lang="ts">
	import { getIcon } from "$lib/getIcon";
	import { createEventDispatcher } from "svelte";

	import DropdownItem from "$lib/components/DropdownItem.svelte";
	import DropArrow from "$lib/components/icons/general/DropArrow.svelte";

	const dispatch = createEventDispatcher<{
		change: { selected: string | undefined; previous: string | undefined };
	}>();

	// Provides options that should be in the dropdown, and an array of selected items to prevent re-selection of the same thing.
	// Along with an index to auto select values, since dropdowns normally are near other dropdowns with the same values.
	export let i = 0;
	export let required: boolean;
	export let options: string[];
	export let selectedItems: (string | null)[];

	let open = false;
	let selected = 0;
	let parent: HTMLDivElement;
	let placeholder: string = options[selected];

	// If selected items were provided, automatically fill them out
	if (selectedItems[i]) {
		selected = options.indexOf(selectedItems[i]!);
		placeholder = options[selected];
	}

	// Check if click is outside of the dropdown, if so, close it
	const windowClick = ({ target }: Event) => {
		if (open && !parent.contains(target as Node)) open = false;
	};

	// Update the the selected item index when an item in the dropdown is selected and tell the parent about the new selection
	const onClick = (index: number) => {
		dispatch("change", {
			selected: options[index],
			previous: options[selected]
		});

		selected = index;
		placeholder = options[index];
	};

	// Interactive, when the parent element changes the selected item changes.
	// This is to prevent gaps between multiple dropdowns
	$: selectedItems,
		(selected = selectedItems[i]
			? options.indexOf(selectedItems[i]!)
			: !required
			? options.length
			: 0),
		(placeholder = options[selected]);
</script>

<svelte:window on:click={windowClick} />

<div bind:this={parent} class="relative">
	<button
		on:click={() => (open = !open)}
		class:rounded-b-lg={!open}
		class="w-full flex items-center gap-4 p-4 bg-gray-800 rounded-t-lg"
	>
		{#if !$$slots.default}
			<svelte:component
				this={getIcon(placeholder || "None")}
				class="w-8 h-8 shrink-0"
			/>
		{/if}

		<slot />

		<div class="flex items-center justify-between w-full">
			<h1>{(placeholder || "None").replaceAll("_", " ")}</h1>
			<DropArrow {open} class="w-6 h-6" />
		</div>
	</button>

	{#if open}
		<div
			class="absolute w-full h-fit flex flex-col inset-0 top-16 shadow-lg bg-gray-800 rounded-b-lg max-h-[15rem] overflow-auto z-50"
		>
			{#if !required}
				<DropdownItem
					on:click={() => onClick(options.length)}
					selected={selected === options.length}
				>
					None
				</DropdownItem>
			{/if}
			{#each options as option, i}
				{#if !(selectedItems.includes(option) && i !== selected)}
					<DropdownItem
						on:click={() => onClick(i)}
						selected={selected === i}
					>
						{option.replaceAll("_", " ")}
					</DropdownItem>
				{/if}
			{/each}
		</div>
	{/if}
</div>
