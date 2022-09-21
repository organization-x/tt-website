<script lang="ts">
	import { slide, fly } from "svelte/transition";

	import Author from "./Author.svelte";
	import { debounce } from "$lib/debounce";
	import Search from "$lib/components/icons/Search.svelte";

	import type { User } from "@prisma/client";

	export let authors: App.ProjectAuthor[];
	export let user: User;

	let search = "";
	let results: User[] = [];

	// Update search value on input
	const onInput = () => {
		const req = search.trim();

		// If the request is empty then reset the results and ignore the search
		if (!req.length) {
			results = [];
			return;
		}

		fetch("/api/user", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				where: {
					name: {
						contains: search.trim(),
						mode: "insensitive"
					}
				}
			} as App.UserSearchRequest)
		})
			.then((res) => res.json())
			.then((data: User[]) => {
				// Filter users out who are already collaborators
				results = data.filter(
					(result) =>
						!authors.some((author) => author.id === result.id)
				);
			});
	};
</script>

<div class="lg:flex lg:justify-between lg:gap-14">
	<div class="lg:w-full">
		<h1 class="font-semibold text-xl">Authors</h1>
		<div class=" bg-gray-500/40 p-4 mt-3 rounded-lg">
			{#each authors as author}
				<Author
					bind:author
					cantRemove={author.id === user.id}
					on:click={() => {
						authors.splice(
							authors.findIndex((user) => user.id === author.id),
							1
						);

						authors = authors;

						// Requery the search
						onInput();
					}}
				/>
			{/each}

			<div
				class:rounded-t-lg={search.length}
				class:rounded-lg={!search.length}
				class="bg-gray-500/40 flex select-none"
			>
				<div
					class:w-0={search.length}
					class:px-0={search.length}
					class:px-4={!search.length}
					class:w-14={!search.length}
					class="bg-gray-500/40 py-4 rounded-l-lg overflow-hidden transition-widpad"
				>
					<Search class="w-6 h-6 mx-auto" />
				</div>
				<input
					bind:value={search}
					use:debounce={{ bind: search, func: onInput, delay: 200 }}
					type="text"
					class="w-full h-full px-4 py-4 bg-transparent focus:outline-none my-auto"
					placeholder="Search for collaborators..."
				/>
			</div>

			{#if search.length}
				<div
					transition:slide={{ duration: 200 }}
					class="h-32 bg-gray-500/40 flex flex-col gap-4 rounded-b-lg p-4"
				>
					{#each results as user}
						<button
							on:click={() => {
								// If the user is already in the authors, ignore
								if (
									authors.find(
										(author) => author.id === user.id
									)
								)
									return;

								// Default position is backend since it's at the top
								authors.push({ position: "Backend", ...user });

								authors = authors;

								// Requery the search
								onInput();
							}}
							in:fly={{ y: 20, duration: 200 }}
							class="flex gap-3 items-center"
						>
							<!-- TODO: swithc from placeholder -->
							<img
								src="/developers/user/placeholder/icon.webp"
								alt="{user.name}'s avatar"
								class="w-10 h-10 rounded-full"
							/>
							<h1 class="text-lg">{user.name}</h1>
						</button>
					{:else}
						<h1
							in:fly={{ y: 20, duration: 200 }}
							class="text-center"
						>
							No results
						</h1>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</div>
