<script lang="ts">
	import { onMount } from "svelte";

	import Asterisk from "$lib/components/icons/Asterisk.svelte";
	import DropArrow from "$lib/components/icons/DropArrow.svelte";
	import DropdownOption from "./DropdownOption.svelte";

	export let title: string;
	export let prompt = title;
	export let required = true;
	export let disabled: boolean;
	export let options: string[];
	export let placeholder: string;
	export let isValid = !required;

	export let input: string[];

	let selections: boolean[] = new Array(options.length).fill(false);

	// This is a hack because if we used options directly, it would
	// create an infinite loop.
	let o = options;
	$: input = selections.filter((selection) => selection).map((_, i) => o[i]);

	let open = false;
	let changed = false;
	let dropdownParent: HTMLDivElement;

	$: if (input.length > 0) changed = true;
	$: isValid = input.length > 0;

	// Check if click is outside of the dropdown, if so, close it.
	onMount(() => {
		const onClick = ({ target }: Event) => {
			if (!dropdownParent.contains(target as Node)) open = false;
		};

		addEventListener("click", onClick);

		return () => removeEventListener("click", onClick);
	});
</script>

<div class="mt-8">
	<div class="flex justify-between items-center">
		<h1 class="font-semibold">{prompt}</h1>
		{#if required}
			<Asterisk class="w-3 h-3" />
		{/if}
	</div>
	<div bind:this={dropdownParent} class="relative cursor-pointer">
		<div
			on:click={() => (open = !open)}
			class:pointer-events-none={disabled}
			class:rounded-b-lg={!open}
			class="w-full flex items-center justify-between p-4 bg-gray-800 mt-4 rounded-t-lg select-none border-2 z-20 relative"
			class:border-green-light={isValid}
			class:border-red-light={changed && !isValid && required}
			class:border-transparent={!changed ||
				(!isValid && !required) ||
				(isValid && input.length < 1)}
		>
			<h1>{input.length} {placeholder} selected</h1>
			<DropArrow {open} class="w-6 h-6 transition-transform" />
		</div>
		<div
			class:flex={open}
			class:hidden={!open}
			class="absolute w-full h-fit flex-col top-full bg-gray-800 z-10 rounded-b-lg max-h-[15rem] overflow-auto"
		>
			{#each options as option, i (option)}
				<DropdownOption bind:isSelected={selections[i]}>
					{option}
				</DropdownOption>
			{/each}
		</div>
	</div>
</div>
