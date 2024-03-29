<script lang="ts">
	import { slide } from "svelte/transition";
	import { createEventDispatcher } from "svelte";

	import { positions } from "$lib/enums";
	import Dropdown from "$lib/components/Dropdown.svelte";
	import Trash from "$lib/components/icons/general/Trash.svelte";
	import DashButton from "$lib/components/dashboard/DashButton.svelte";
	import DropArrow from "$lib/components/icons/general/DropArrow.svelte";
	import RadioSelect from "$lib/components/icons/general/RadioSelect.svelte";

	import type { Position } from "@prisma/client";
	import type { TransitionConfig } from "svelte/transition";

	export let cantRemove: boolean;
	export let author: App.Author;

	let open = false;
	let parent: HTMLDivElement;

	const dispatch = createEventDispatcher<{ click: { id: string } }>();

	// Close menu when clicking outside of it
	const onClick = ({ target }: Event) =>
		open && !parent.contains(target as Node) && (open = false);

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

<svelte:window on:click={onClick} />

<div
	in:slide|local={{ duration: 200 }}
	out:transition|local
	bind:this={parent}
	class="flex flex-col bg-gray-500/40 rounded-lg mb-4"
>
	<button
		on:click={() => innerWidth < 1024 && (open = !open)}
		class="flex justify-between items-center p-4 lg:cursor-auto"
	>
		<img
			width="512"
			height="512"
			src="https://imagedelivery.net/XcWbJUZNkBuRbJx1pRJDvA/avatar-{author
				.user.id}/avatar?{new Date().getTime()}"
			alt="{author.user.name}'s avatar"
			class="w-10 h-10 rounded-full"
		/>

		<h1 class="text-lg sm:mr-auto sm:ml-4">{author.user.name}</h1>

		<DropArrow {open} class="w-7 h-7 transition-transform lg:hidden" />
		{#if !cantRemove}
			<button on:click={() => dispatch("click", { id: author.user.id })}>
				<Trash class="w-6 h-6 hidden lg:block" />
			</button>
		{/if}
	</button>

	{#if open}
		<div class="p-4 lg:hidden" transition:slide={{ duration: 200 }}>
			<h1 class="font-semibold text-lg ml-1.5">Position</h1>
			<div class="flex flex-col gap-4 mt-4">
				{#each positions as position}
					<button
						on:click={() => (author.position = position)}
						class="flex items-center gap-2"
					>
						<RadioSelect
							selected={author.position === position}
							class="w-8 h-8"
						/>
						<h1 class="text-lg">{position.replaceAll("_", " ")}</h1>
					</button>
				{/each}
			</div>
			{#if !cantRemove}
				<DashButton
					class="mt-8 bg-red-light hover:bg-red-light/80"
					on:click={() => dispatch("click", { id: author.user.id })}
				>
					Remove
				</DashButton>
			{/if}
		</div>
	{/if}

	<div class="hidden lg:block bg-gray-800 rounded-b-lg">
		<Dropdown
			i={0}
			options={positions}
			required={true}
			selectedItems={[author.position]}
			on:change={onChange}
		/>
	</div>
</div>
