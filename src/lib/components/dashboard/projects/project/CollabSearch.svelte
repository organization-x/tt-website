<script lang="ts">
	import { slide, fly } from "svelte/transition";

	import Search from "$lib/components/icons/Search.svelte";

	export let authors: App.ProjectAuthor[];

	let search = "";
	let results: App.ProjectAuthor[] = [];

	// Update search value on input
	const onInput = (event: Event) => {
		search = (event.target as HTMLInputElement).value;

		fetch("/api/user", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				where: {
					name: {
						contains: search,
						mode: "insensitive"
					}
				}
			} as App.UserSearchRequest)
		})
			.then((res) => res.json())
			.then((data: App.ProjectAuthor[]) => {
				// Filter users out who are already collaborators
				results = data.filter(
					(result) =>
						!authors.some((author) => author.id === result.id)
				);
			});
	};
</script>

<div>
	<div class="bg-gray-500/40 flex rounded-lg select-none">
		<div
			class:w-0={search.length}
			class:px-0={search.length}
			class:px-4={!search.length}
			class:w-14={!search.length}
			class="bg-gray-500/40 rounded-l-lg py-4 overflow-hidden transition-widpad"
		>
			<Search class="w-6 h-6 mx-auto" />
		</div>
		<input
			on:input={onInput}
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
					on:click={() => authors.push(user)}
					transition:fly={{ y: 20, duration: 200 }}
					class="flex gap-3 items-center"
				>
					<img
						src="/developers/user/placeholder/icon.webp"
						alt="{user.name}'s avatar"
						class="w-10 h-10 rounded-full"
					/>
					<h1 class="text-lg">{user.name}</h1>
				</button>
			{:else}
				<h1
					transition:fly={{ y: 20, duration: 200 }}
					class="text-center"
				>
					No results
				</h1>
			{/each}
		</div>
	{/if}
</div>
