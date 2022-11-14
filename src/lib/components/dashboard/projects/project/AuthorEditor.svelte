<script lang="ts">
	import { slide } from "svelte/transition";
	import { createEventDispatcher } from "svelte";

	import { positions } from "$lib/enums";
	import { getIcon } from "$lib/getIcon";
	import Trash from "$lib/components/icons/general/Trash.svelte";
	import DropdownItem from "$lib/components/DropdownItem.svelte";
	import DropArrow from "$lib/components/icons/general/DropArrow.svelte";

	import type { Position } from "@prisma/client";
	import Search from "$lib/components/icons/general/Search.svelte";
	import Dropdown from "$lib/components/Dropdown.svelte";

	export let author: App.Author;
	export let cantRemove: boolean;

	let search = "";
	let open = false;

	const dispatch = createEventDispatcher<{
		click: { id: string };
	}>();

	// Create a seperate array of filtered options
	$: filteredPositions = positions.filter((position) =>
		position.toLowerCase().includes(search.trim().toLowerCase())
	);

	// Change variable on dropdown selection.
	// Have to do it in a seperate function since svelte doesn't allow for typescript within the on directive
	const onChange = ({
		detail
	}: CustomEvent<{
		selected: string | undefined;
		previous: string | undefined;
	}>) => (author.position = detail.selected as Position);

	// When the dropdown is closed, reset the search
	$: if (!open) search = "";
</script>

<div
	transition:slide|local={{ duration: 200 }}
	class="flex flex-col bg-gray-700 rounded-lg mb-4"
>
	<button
		on:click={() => (open = !open)}
		class="flex gap-4 items-center p-4 lg:cursor-auto"
	>
		<img
			width="512"
			height="512"
			src="https://imagedelivery.net/XcWbJUZNkBuRbJx1pRJDvA/avatar-{author
				.user.id}/avatar?{new Date().getTime()}"
			alt="{author.user.name}'s avatar"
			class="w-10 h-10 rounded-full object-cover object-center"
		/>

		<h1 class="overflow-auto scrollbar-hidden lg:text-lg">
			{author.user.name.split(" ")[0]}
		</h1>

		<DropArrow class="w-3 h-3 ml-auto shrink-0 mt-0.5 lg:hidden" {open} />

		{#if !cantRemove}
			<button
				on:click|stopPropagation={() =>
					dispatch("click", { id: author.user.id })}
				class="shrink-0 lg:ml-auto"
			>
				<Trash class="w-4 h-4" />
			</button>
		{/if}
	</button>

	{#if open}
		<div transition:slide={{ duration: 200 }} class="lg:hidden">
			<div class="flex p-4 select-none w-full items-center h-12">
				<Search class="w-4 h-4" />
				<input
					bind:value={search}
					type="text"
					class="w-full h-full px-2 bg-transparent focus:outline-none"
					placeholder="Search..."
				/>
			</div>

			<div class="pl-2 pb-2 overflow-auto scrollbar h-44">
				{#each filteredPositions as position (position)}
					<DropdownItem
						on:click={() => (author.position = position)}
						selected={author.position === position}
					>
						<div class="flex items-center gap-3">
							<svelte:component
								this={getIcon(position)}
								class="w-5 h-5"
							/>

							{position.replaceAll("_", " ")}
						</div>
					</DropdownItem>
				{:else}
					<div class="text-center mt-4">No results</div>
				{/each}
			</div>
		</div>
	{/if}

	<div class="hidden lg:block bg-gray-700 rounded-b-lg">
		<Dropdown
			i={0}
			options={positions}
			required={true}
			selectedItems={[author.position]}
			on:change={onChange}
		/>
	</div>
</div>
