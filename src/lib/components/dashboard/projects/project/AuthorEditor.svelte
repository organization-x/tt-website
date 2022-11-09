<script lang="ts">
	import { slide } from "svelte/transition";
	import { createEventDispatcher } from "svelte";

	import { positions } from "$lib/enums";
	import Dropdown from "$lib/components/Dropdown.svelte";
	import Trash from "$lib/components/icons/general/Trash.svelte";

	import type { Position } from "@prisma/client";
	import type { TransitionConfig } from "svelte/transition";

	export let author: App.Author;
	export let cantRemove: boolean;

	let parent: HTMLDivElement;

	const dispatch = createEventDispatcher<{ click: { id: string } }>();

	// Change variable on dropdown selection.
	// Have to do it in a seperate function since svelte doesn't allow for typescript within the on directive
	const onChange = ({
		detail
	}: CustomEvent<{
		selected: string | undefined;
		previous: string | undefined;
	}>) => (author.position = detail.selected as Position);

	// Transition for when an author is removed
	const transition = (node: Element): TransitionConfig => {
		const height = node.clientHeight;

		return {
			duration: 200,
			css: (t) => {
				return `
					transform: scale(${t});
                    margin-bottom: ${t * 1}rem;
                    height: ${t * height}px;`;
			}
		};
	};
</script>

<div
	in:slide|local={{ duration: 200 }}
	out:transition|local
	bind:this={parent}
	class="flex flex-col bg-gray-500/40 rounded-lg mb-4"
>
	<div class="flex justify-between items-center p-4">
		<div class="flex items-center gap-4 overflow-hidden">
			<img
				width="512"
				height="512"
				src="https://imagedelivery.net/XcWbJUZNkBuRbJx1pRJDvA/avatar-{author
					.user.id}/avatar?{new Date().getTime()}"
				alt="{author.user.name}'s avatar"
				class="w-10 h-10 rounded-full"
			/>

			<h1 class="overflow-auto scrollbar-hidden lg:text-lg">
				{author.user.name}
			</h1>
		</div>

		{#if !cantRemove}
			<button
				on:click={() => dispatch("click", { id: author.user.id })}
				class="hidden lg:block"
			>
				<Trash class="w-5 h-5" />
			</button>
		{/if}
	</div>

	<div class=" bg-gray-800 rounded-b-lg">
		<Dropdown
			i={0}
			options={positions}
			required={true}
			selectedItems={[author.position]}
			on:change={onChange}
		/>
	</div>
</div>
