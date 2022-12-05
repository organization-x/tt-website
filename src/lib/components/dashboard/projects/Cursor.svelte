<script lang="ts">
	import type { TransitionConfig } from "svelte/transition";

	export let name: string;
	export let color: string;

	let hover = true;

	// Show label temporarily after the cursor updates
	let timeout = setTimeout(() => (hover = false), 3000);

	const onHover = (hovering: boolean) => {
		clearTimeout(timeout);

		hovering
			? (hover = true)
			: (timeout = setTimeout(() => (hover = false), 3000));
	};

	// Custom slide transition for revealing the cursor name
	const slide = (_: Element): TransitionConfig => {
		return {
			duration: name.length * 4,
			css: (_, u) => `clip-path: inset(0 0 0 ${u * 100}%)`
		};
	};
</script>

<span
	spellcheck="false"
	contenteditable="false"
	style="border-color: {color}"
	class="select-none relative border-x-[1.5px] -mx-[1.5px] cursor-text"
	on:mouseenter={() => onHover(true)}
	on:mouseleave={() => onHover(false)}
>
	{#if hover}
		<div
			transition:slide
			class="rounded-sm rounded-br-none text-xs -right-[1.5px] px-1 py-0.5 absolute -top-5 whitespace-nowrap select-none pointer-events-none"
			style="background-color: {color};"
			contenteditable="false"
		>
			{name}
		</div>
	{/if}
</span>
