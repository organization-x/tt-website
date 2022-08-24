<script lang="ts">
	import { createEventDispatcher } from "svelte/internal";
	import { onMount, onDestroy } from "svelte/internal";
	import Asterisk from "../icons/Asterisk.svelte";
	import Dropdown from "../icons/Dropdown.svelte";
	import DropdownOption from "./DropdownOption.svelte";

	export let title: string;
	export let placeholder: string;
	export let disabled: boolean;
	export let options: string[];
	export let required = true;

	const dispatch = createEventDispatcher();

	let open = false;
	let count = 0;
	let isFilled = false;
	let dropdownParent: HTMLDivElement;

	// Only dispatch if the previous state of isFilled is different than the new state.
	$: isFilled, dispatch("change", { isFilled });

	// On input change check if the input is filled.
	const onChange = ({ detail }: CustomEvent) => {
		detail.isSelected ? count++ : count--;
		isFilled = count > 0;
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
		<h1 class="font-semibold">{title}</h1>
		{#if required}
			<Asterisk class="w-3 h-3" />
		{/if}
	</div>
	<div bind:this={dropdownParent} class="relative">
		<div
			on:click={() => (open = !open)}
			class:pointer-events-none={disabled}
			class:rounded-b-lg={!open}
			class="w-full flex items-center justify-between p-4 bg-gray-800 mt-4 duration-100 transition-border rounded-t-lg select-none"
		>
			<h1>{count} {placeholder} selected</h1>
			<Dropdown class="w-6 h-6" />
		</div>
		<div
			class:flex={open}
			class:hidden={!open}
			class="absolute w-full h-fit flex-col inset-0 top-14 bg-gray-800 z-10 rounded-b-lg max-h-[15rem] overflow-auto"
		>
			{#each options as option}
				<DropdownOption on:change={onChange}>
					{option}
				</DropdownOption>
			{/each}
		</div>
	</div>
</div>
