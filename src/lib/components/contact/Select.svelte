<script lang="ts">
	import { onMount, createEventDispatcher } from "svelte";

	import Asterisk from "$lib/components/icons/Asterisk.svelte";
	import DropArrow from "$lib/components/icons/DropArrow.svelte";
	import DropdownOption from "./DropdownOption.svelte";
	import type { changeValues } from "./_ChangeValuesInterface.svelte";

	export let title: string;
	export let prompt = title;
	export let required = true;
	export let disabled: boolean;
	export let options: string[];
	export let placeholder: string;
	export let page: string;

	const dispatch = createEventDispatcher<changeValues>();

	let open = false;
	let count = 0;
	let changed = false;
	let isValid = false;
	let input: string[] = [];
	let dropdownParent: HTMLDivElement;

	// Let the parent know input has changed
	$: dispatch("change", { page, title, isValid, input });

	// On input change check if the input is filled.
	const onChange = ({
		detail
	}: CustomEvent<{ isSelected: boolean; option: string }>) => {
		if (detail.isSelected) {
			count++;
			input.push(detail.option);
		} else {
			count--;
			if (input.indexOf(detail.option) > -1)
				input.splice(input.indexOf(detail.option), 1);
		}
		isValid = count > 0;
		changed = true;
	};

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
				(isValid && count < 1)}
		>
			<h1>{count} {placeholder} selected</h1>
			<DropArrow {open} class="w-6 h-6 transition-transform" />
		</div>
		<div
			class:flex={open}
			class:hidden={!open}
			class="absolute w-full h-fit flex-col inset-0 top-14 bg-gray-800 z-10 rounded-b-lg max-h-[15rem] overflow-auto"
		>
			{#each options as option}
				<DropdownOption on:change={onChange} {option}>
					{option}
				</DropdownOption>
			{/each}
		</div>
	</div>
</div>
