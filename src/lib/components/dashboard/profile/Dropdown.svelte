<script lang="ts">
	import { onMount } from "svelte/internal";
	import Dropdown from "../../icons/Dropdown.svelte";
	import DropdownItem from "./DropdownItem.svelte";

	export let required: boolean;
	export let options: string[];

	let open = false;
	let selected = 0;
	let placeholder = "Select";
	let dropdownParent: HTMLDivElement;

	// On input change check if another items is selected.
	const onChange = ({
		detail
	}: CustomEvent<{ isSelected: boolean; i: number }>) => {
		if (placeholder !== "Select") {
			optionsParent.children[detail.i];
		}
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
	<div bind:this={dropdownParent} class="relative">
		<div
			on:click={() => (open = !open)}
			class:rounded-b-lg={!open}
			class="w-full flex items-center justify-between p-4 bg-gray-800 mt-4 duration-100 transition-border rounded-t-lg select-none"
		>
			<h1>{placeholder}</h1>
			<Dropdown class="w-6 h-6" />
		</div>
		<div
			class:flex={open}
			class:hidden={!open}
			class="absolute w-full h-fit flex-col inset-0 top-14 bg-gray-800 z-10 rounded-b-lg max-h-[15rem] overflow-auto"
		>
			<DropdownItem on:change={onChange} i={0} {selected}>
				Select
			</DropdownItem>
			{#each options as option, i}
				<DropdownItem on:change={onChange} i={i + 1}>
					{option}
				</DropdownItem>
			{/each}
		</div>
	</div>
</div>
