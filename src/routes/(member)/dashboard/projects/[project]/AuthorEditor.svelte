<script lang="ts">
	import { slide } from "svelte/transition";
	import { createEventDispatcher, getContext } from "svelte";

	import { getIcon } from "$lib/getIcon";
	import { positions } from "$lib/enums";
	import Trash from "$lib/icons/general/Trash.svelte";
	import Search from "$lib/icons/general/Search.svelte";
	import Dropdown from "$lib/components/Dropdown.svelte";
	import { PUBLIC_CLOUDFLARE_URL } from "$env/static/public";
	import Scrollable from "$lib/components/Scrollable.svelte";
	import DropArrow from "$lib/icons/general/DropArrow.svelte";
	import DropdownItem from "$lib/components/DropdownItem.svelte";

	import type { Writable } from "svelte/store";
	import type { Position } from "@prisma/client";

	export let isOwner: boolean;
	export let author: App.Author;
	export let cantRemove: boolean;

	const tabindex = getContext<Writable<number>>("tabindex");
	const dispatch = createEventDispatcher<{
		delete: { id: string };
	}>();

	let search = "";
	let open = false;

	// Create a separate array of filtered options
	$: filteredPositions = positions.filter((position) =>
		position.toLowerCase().includes(search.trim().toLowerCase())
	);

	// Change variable on dropdown selection.
	// Have to do it in a separate function since svelte doesn't allow for typescript within the on directive
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
	aria-expanded={open}
>
	<button
		on:click={() => isOwner && (open = !open)}
		class="flex gap-4 items-center p-4 lg:cursor-auto"
		tabindex={isOwner ? $tabindex : -1}
	>
		<img
			width="512"
			height="512"
			src="{PUBLIC_CLOUDFLARE_URL}/avatar-{author.user
				.id}/avatar?{new Date().getTime()}"
			alt="{author.user.name}'s avatar"
			class="w-10 h-10 rounded-full object-cover object-center"
		/>

		<h1 class="overflow-auto scrollbar-hidden lg:text-lg lg:select-all">
			{author.user.name.split(/\s+/g)[0]}
		</h1>

		<DropArrow class="w-3 h-3 ml-auto shrink-0 mt-0.5 lg:hidden" {open} />

		{#if !cantRemove}
			<button
				on:click|stopPropagation={() =>
					dispatch("delete", { id: author.user.id })}
				class="shrink-0 lg:ml-auto"
				tabindex={isOwner ? $tabindex : -1}
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
					tabindex={$tabindex}
				/>
			</div>

			<Scrollable
				vertical={true}
				class="before:from-gray-700 after:to-gray-700 after:rounded-b-lg"
				innerClass="h-44 scrollbar gap-0 pl-2 pb-2"
			>
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
			</Scrollable>
		</div>
	{/if}

	<div class="hidden lg:block bg-gray-700 rounded-b-lg">
		<Dropdown
			i={0}
			options={positions}
			required={true}
			groupSelected={[author.position]}
			on:change={onChange}
		/>
	</div>
</div>
