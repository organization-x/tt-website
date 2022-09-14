<script lang="ts">
	import { getIcon } from "$lib/components/icons/getIcon";
	import { onMount, createEventDispatcher } from "svelte";

	import DropdownItem from "./DropdownItem.svelte";
	import Dropdown from "../../icons/Dropdown.svelte";

	const dispatch = createEventDispatcher();

	// Selected items is from the parent element and is used for determining which other elements to hide to prevent double selection.
	// It also determines on updates what items will be selected.
	// The index is used for determining which dropdown has what selected, the threshold is how many dropdowns are required to have a value
	export let i = 0;
	export let options: string[];
	export let requiredThreshold = 2; // 2 is most common
	export let selectedItems: (string | null)[];

	let open = false;
	let dropdownParent: HTMLDivElement;
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

	// Check if click is outside of the dropdown, if so, close it
	onMount(() => {
		const onClick = ({ target }: Event) => {
			if (!dropdownParent.contains(target as Node)) open = false;
		};

		addEventListener("click", onClick);

		return () => removeEventListener("click", onClick);
	});
</script>

<div bind:this={dropdownParent} class="relative">
	<div
		on:click={() => (open = !open)}
		class:rounded-b-lg={!open}
		class="w-full flex items-center gap-4 p-4 bg-gray-800 duration-100 transition-border rounded-t-lg select-none cursor-pointer"
	>
		{#if !$$slots.default}
			<svelte:component
				this={getIcon(placeholder || "None")}
				class="w-8 h-8 shrink-0"
			/>
		{/if}
		<slot />
		<dib class="flex items-center justify-between w-full">
			<h1>{(placeholder || "None").replaceAll("_", " ")}</h1>
			<Dropdown
				class="w-6 h-6 transition-transform{open ? ' rotate-180' : ''}"
			/>
		</dib>
	</div>
	<div
		class:flex={open}
		class:hidden={!open}
		class="absolute w-full h-fit flex-col inset-0 top-16 bg-gray-800 z-10 rounded-b-lg max-h-[15rem] overflow-auto"
	>
		{#if i >= requiredThreshold}
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
</div>
