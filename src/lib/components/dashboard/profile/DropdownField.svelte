<script lang="ts">
	import { getIcon } from "$lib/components/icons/getIcon";
	import { createEventDispatcher } from "svelte";

	import DropdownItem from "../../DropdownItem.svelte";
	import DropArrow from "../../icons/DropArrow.svelte";
	import Dropdown from "$lib/components/Dropdown.svelte";

	const dispatch = createEventDispatcher<{
		change: { selected: string; previous: string };
	}>();

	// Selected items is from the parent element and is used for determining which other elements to hide to prevent double selection.
	// It also determines on updates what items will be selected.
	// The index is used for determining which dropdown has what selected, the threshold is how many dropdowns are required to have a value
	export let i = 0;
	export let z = 10; // z-index to prevent dropdowns from being cutoff by eachother
	export let options: string[];
	export let requiredThreshold = 2; // 2 is most common
	export let selectedItems: (string | null)[];

	let open = false;
	let selected = i >= requiredThreshold ? options.length : 0; // The options length represents the "None" value, its positioned as the end of the array
	let placeholder: string | null = options[selected];

	// Interactive, when the parent element changes the selected item changes.
	// This is used when the cancel buttons reverts changes and also prevents gaps between dropdowns
	$: selectedItems,
		(selected = selectedItems[i]
			? options.indexOf(selectedItems[i]!)
			: i >= requiredThreshold
			? options.length
			: 0),
		(placeholder = options[selected]);

	// If values from the account were provided, fill them in
	if (selectedItems[i]) {
		selected = options.indexOf(selectedItems[i]!);
		placeholder = options[selected];
	}

	// On input change check if another item is selected, if so, update the placeholder and change the selected item index
	const onClick = (index: number) => {
		// Tell the parent component that the selected item has changed with the previous value for grabbing the index
		dispatch("change", {
			selected: options[index],
			previous: options[selected]
		});

		selected = index;
		placeholder = options[index];
	};
</script>

<Dropdown {z} bind:open>
	<svelte:fragment slot="button">
		{#if !$$slots.default}
			<svelte:component
				this={getIcon(placeholder || "None")}
				class="w-8 h-8 shrink-0"
			/>
		{/if}
		<slot />
		<div class="flex items-center justify-between w-full">
			<h1>{(placeholder || "None").replaceAll("_", " ")}</h1>
			<DropArrow
				class="w-6 h-6 transition-transform{open ? ' rotate-180' : ''}"
			/>
		</div>
	</svelte:fragment>

	{#if i >= requiredThreshold}
		<DropdownItem
			radio={true}
			on:click={() => onClick(options.length)}
			selected={selected === options.length}
		>
			None
		</DropdownItem>
	{/if}
	{#each options as option, i}
		{#if !(selectedItems.includes(option) && i !== selected)}
			<DropdownItem
				radio={true}
				on:click={() => onClick(i)}
				selected={selected === i}
			>
				{option.replaceAll("_", " ")}
			</DropdownItem>
		{/if}
	{/each}
</Dropdown>
