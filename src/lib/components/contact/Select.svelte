<script lang="ts">
	import Dropdown from "$lib/components/Dropdown.svelte";
	import Asterisk from "$lib/components/icons/general/Asterisk.svelte";

	export let title: string;
	export let radio: boolean;
	export let required = true;
	export let isValid: boolean;
	export let options: string[];
	export let selected: string[] = [];

	let open = false;
	let changed = false;
	let parent: HTMLDivElement;

	// Check if the dropdown has items selected and change it's valid value accordingly
	$: isValid = required ? selected.length > 0 : true;

	// Check if click is outside of the dropdown, if so, remove the border
	const windowClick = ({ target }: Event) =>
		open && !parent.contains(target as Node);
</script>

<svelte:window on:click={windowClick} />

<div class="relative">
	<div class="flex justify-between items-center">
		<h1 class="font-semibold">{title}</h1>
		{#if required}
			<Asterisk class="w-3 h-3" />
		{/if}
	</div>

	<div
		bind:this={parent}
		class:border-transparent={!changed || !required || radio}
		class:border-red-light={changed && !isValid && required && !radio}
		class:border-green-light={changed && isValid && required && !radio}
		class="rounded-lg border-2 mt-2 max-h-[4.5rem] transition-[border-color]"
	>
		<Dropdown
			bind:open
			bind:selected
			{options}
			{radio}
			{required}
			selectedItems={[]}
			icons={false}
			on:change={() => (changed = true)}
		/>
	</div>

	{#if open}
		<div
			class:border-transparent={!changed || !required || radio}
			class:border-red-light={changed && !isValid && required && !radio}
			class:border-green-light={changed && isValid && required && !radio}
			class="absolute z-10 pointer-events-none inset-0 top-8 border-2 transition-[border-color] rounded-[0.65rem] h-[22.75rem] sm:top-9"
		/>
	{/if}
</div>
