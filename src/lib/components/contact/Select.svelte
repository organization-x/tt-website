<script lang="ts">
	import Asterisk from "$lib/components/icons/Asterisk.svelte";
	import DropdownItem from "$lib/components/DropdownItem.svelte";
	import DropArrow from "$lib/components/icons/DropArrow.svelte";

	export let title: string;
	export let radio: boolean;
	export let required = true;
	export let isValid: boolean;
	export let placeholder = "";
	export let options: string[];
	export let selected: string[] = [];

	let open = false;
	let changed = false;
	let parent: HTMLDivElement;

	// If the select is in radio mode automatically select the first option
	if (radio) selected = [options[0]];

	// Check if the dropdown has items selected and change it's valid value accordingly
	$: isValid = required ? selected.length > 0 : true;

	// Check if click is outside of the dropdown, if so, close it
	const windowClick = ({ target }: Event) => {
		if (open && !parent.contains(target as Node)) open = false;
	};
</script>

<svelte:window on:click={windowClick} />

<div>
	<div class="flex justify-between items-center">
		<h1 class="font-semibold">{title}</h1>
		{#if required}
			<Asterisk class="w-3 h-3" />
		{/if}
	</div>

	<div bind:this={parent} class="relative">
		<button
			on:click={() => (open = !open)}
			class:rounded-b-lg={!open}
			class:border-transparent={!changed}
			class:border-red-light={changed && !isValid}
			class:border-green-light={changed && isValid}
			class="w-full px-4 bg-gray-800 flex items-center justify-between p-4 mt-2 rounded-t-lg select-none border-solid border-2 transition-[border-color]"
		>
			<h1>
				{radio
					? selected[0]
					: `${selected.length} ${placeholder} selected`}
			</h1>

			<DropArrow {open} class="w-6 h-6 shrink-0" />
		</button>

		{#if open}
			<div
				class:border-transparent={!changed}
				class:border-red-light={changed && !isValid}
				class:border-green-light={changed && isValid}
				class="absolute w-full h-fit flex-col top-[calc(100%-2px)] bg-gray-800 z-50 rounded-b-lg max-h-[15rem] overflow-auto border-2 transition-[border-color]"
				style="border-style: hidden solid solid solid;"
			>
				{#each options as option}
					<DropdownItem
						{radio}
						selected={selected.includes(option)}
						on:click={() =>
							// Based on if the select is in radio mode or not either set the selections to just one value
							// or remove/add the value to the selections. Also set the changed value to true
							radio
								? (selected = [option])
								: selected.includes(option)
								? (selected = selected.filter(
										(item) => item !== option
								  ))
								: (selected = [...selected, option]) &&
								  !changed &&
								  (changed = true)}
					>
						{option}
					</DropdownItem>
				{/each}
			</div>
		{/if}
	</div>
</div>
