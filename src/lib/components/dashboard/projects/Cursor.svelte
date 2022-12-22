<script lang="ts">
	import { onMount } from "svelte";

	import type { Writable } from "svelte/store";
	import type { TransitionConfig } from "svelte/transition";

	export let name: string;
	export let color: string;

	// Use this so that the cursor can update when a transaction occurs, this way the
	// cordinates can be updated when anyone types
	export let update: Writable<number>;

	let flip = false;
	let hover = true;
	let parent: HTMLSpanElement;

	// Show label temporarily after the cursor updates
	let timeout = setTimeout(() => (hover = false), 3000);

	const onHover = (hovering: boolean) => {
		clearTimeout(timeout);

		hovering
			? (hover = true)
			: (timeout = setTimeout(() => (hover = false), 3000));
	};

	// Custom slide transition for revealing the cursor name
	const slide = (_: Element, flip: boolean): TransitionConfig => {
		return {
			duration: name.length * 4,
			css: (_, u) =>
				`clip-path: inset(0 ${u * 100 * Number(!flip)}% 0 ${
					u * 100 * Number(flip)
				}%)`
		};
	};

	const updateFlip = () =>
		(flip = parent.getBoundingClientRect().x / window.innerWidth > 0.5);

	onMount(() => {
		updateFlip();

		const unsub = update.subscribe(updateFlip);

		return () => unsub();
	});
</script>

<svelte:window on:resize={updateFlip} />

<span
	bind:this={parent}
	spellcheck="false"
	contenteditable="false"
	style="border-color: {color}"
	class="select-none relative border-x-[1.5px] -mx-[1.5px] cursor-text"
	on:mouseenter={() => onHover(true)}
	on:mouseleave={() => onHover(false)}
>
	{#if hover}
		<div
			transition:slide={flip}
			class:-left-[1.5px]={!flip}
			class:rounded-bl-none={!flip}
			class:-right-[1.5px]={flip}
			class:rounded-br-none={flip}
			class="rounded-sm text-xs px-1 py-0.5 absolute -top-5 whitespace-nowrap w-max select-none pointer-events-none"
			style="background-color: {color};"
			contenteditable="false"
		>
			{name}
		</div>
	{/if}
</span>
