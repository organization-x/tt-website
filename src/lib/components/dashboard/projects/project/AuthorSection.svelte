<script lang="ts">
	import { slide, fly } from "svelte/transition";

	import { user } from "$lib/stores";
	import { debounce } from "$lib/debounce";
	import Search from "$lib/components/icons/general/Search.svelte";
	import AuthorEditor from "$lib/components/dashboard/projects/project/AuthorEditor.svelte";

	import type { User } from "@prisma/client";

	export let ownerId: string;
	export let authors: App.Author[];

	let search = "";
	let request: Promise<User[]> = new Promise(() => {});

	// Update search value on input
	const onSearch = () =>
		(request = new Promise((res, rej) => {
			const req = search.trim();

			// Avoid uncaught rejects
			if (!req.length && search.length) return rej();
			else if (!req.length) return;

			fetch(
				`/api/user?where=${JSON.stringify({
					name: {
						contains: search.trim(),
						mode: "insensitive"
					}
				})}`
			)
				.then((res) => res.json())
				.then((data: User[]) => {
					// Filter users out who are already collaborators
					let results = data.filter(
						(result) =>
							!authors.some(
								(author) => author.user.id === result.id
							)
					);

					results.length ? res(results) : rej();
				});
		}));
</script>

<div class="lg:flex lg:justify-between lg:gap-14">
	<div class="lg:w-full">
		<h1 class="font-semibold text-xl">Authors</h1>
		<div
			class="bg-gray-500/40 p-4 mt-3 rounded-lg lg:grid lg:grid-cols-2 lg:gap-x-4 lg:transition-[height]"
		>
			{#each authors as author (author.user.id)}
				<AuthorEditor
					bind:author
					cantRemove={author.user.id === $user.id ||
						author.user.id === ownerId}
					on:click={() => {
						authors.splice(
							authors.findIndex(
								(user) => user.user.id === author.user.id
							),
							1
						);

						authors = authors;

						// Requery the search
						onSearch();
					}}
				/>
			{/each}

			<div class="bg-gray-500/40 rounded-lg lg:col-span-2">
				<div class="flex select-none lg:col-span-2">
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
						on:input={() => (request = new Promise(() => {}))}
						use:debounce={{
							bind: search,
							func: onSearch,
							delay: 300
						}}
						type="text"
						class="w-full h-full px-4 py-4 bg-transparent focus:outline-none my-auto"
						placeholder="Search for collaborators..."
					/>
				</div>

				{#if search.length}
					<div
						transition:slide={{ duration: 200 }}
						class="h-32 flex flex-col gap-4 p-4 overflow-auto"
					>
						{#await request}
							<div class="animate-pulse flex gap-3 items-center">
								<div
									class="rounded-full w-10 h-10 bg-gray-500"
								/>
								<div
									class="rounded-full w-32 h-4 bg-gray-500"
								/>
							</div>
							<div class="animate-pulse flex gap-3 items-center">
								<div
									class="rounded-full w-10 h-10 bg-gray-500"
								/>
								<div
									class="rounded-full w-32 h-4 bg-gray-500"
								/>
							</div>
						{:then users}
							{@const timestamp = new Date().getTime()}

							{#each users as user}
								<button
									on:click={() => {
										// If the user is already in the authors, ignore
										if (
											authors.find(
												(author) =>
													author.user.id === user.id
											)
										)
											return;

										// Default position is backend since it's at the top
										authors.push({
											position: "Backend",
											user
										});

										authors = authors;

										// Requery the search
										onSearch();
									}}
									in:fly={{ y: 20, duration: 200 }}
									class="flex gap-3 items-center"
								>
									<img
										width="512"
										height="512"
										src="https://imagedelivery.net/XcWbJUZNkBuRbJx1pRJDvA/avatar-{user.id}/avatar?{timestamp}"
										alt="{user.name}'s avatar"
										class="w-10 h-10 bg-gray-400 rounded-full"
									/>
									<h1 class="text-lg">{user.name}</h1>
								</button>
							{/each}
						{:catch}
							<h1
								in:fly={{ y: 20, duration: 200 }}
								class="text-center"
							>
								No results
							</h1>
						{/await}
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>
