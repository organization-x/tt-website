<script lang="ts">
	import { slide, fly } from "svelte/transition";

	import { user } from "$lib/stores";
	import { debounce } from "$lib/debounce";
	import { PUBLIC_CLOUDFLARE_URL } from "$env/static/public";
	import Scrollable from "$lib/components/Scrollable.svelte";
	import Search from "$lib/components/icons/general/Search.svelte";
	import AuthorEditor from "$lib/components/dashboard/projects/AuthorEditor.svelte";

	import type { Prisma, User } from "@prisma/client";

	export let isOwner: boolean;
	export let ownerId: string;
	export let authors: App.Author[];

	// Keep a copy of the previous authors array so a search is triggered only when the authors change
	let oldAuthors = authors;

	// When the authors change, re-query the search
	$: if (
		isOwner &&
		(oldAuthors.length !== authors.length ||
			!authors.every(
				(author, i) =>
					oldAuthors[i]?.user.id === author.user.id &&
					oldAuthors[i]?.position === author.position
			))
	)
		(oldAuthors = authors) && onSearch();

	let search = "";
	let request: Promise<Pick<User, "id" | "name" | "url">[]> = new Promise(
		() => {}
	);

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
					},

					id: {
						not: {
							in: [
								...authors.map((author) => author.user.id),
								$user.id
							]
						}
					}
				} as Prisma.UserWhereInput)}`
			)
				.then((res) => res.json())
				.then((data: User[]) =>
					data.length
						? res(
								// Transform users into Authors, stripping out unnecessary data
								data.map((user) => ({
									id: user.id,
									url: user.url,
									name: user.name
								}))
						  )
						: rej()
				);
		}));
</script>

<div
	disabled={!isOwner}
	class:opacity-60={!isOwner}
	class:pointer-events-none={!isOwner}
	class="lg:flex lg:justify-between lg:gap-14"
>
	<div class="relative lg:w-full">
		<h1 class="font-semibold text-xl">Authors</h1>
		<div class="bg-gray-900 p-4 mt-3 rounded-lg after:inset-x-0">
			<Scrollable
				vertical={true}
				class="before:from-gray-900 after:to-gray-900 lg:overflow-visible"
				innerClass="gap-0 scrollbar-hidden max-lg:max-h-[27.5rem] lg:grid lg:grid-cols-2 lg:gap-x-4 lg:overflow-visible"
			>
				{#each authors as author (author.user.id)}
					{@const cantRemove =
						author.user.id === $user.id ||
						author.user.id === ownerId}

					<AuthorEditor
						bind:author
						{cantRemove}
						on:click={() => {
							if (cantRemove) return;

							authors = authors.filter(
								(user) => author.user.id !== user.user.id
							);
						}}
					/>
				{/each}
			</Scrollable>

			<div class="bg-gray-700 rounded-lg lg:col-span-2 lg:mt-0">
				<div class="flex select-none lg:col-span-2">
					<div
						class:w-0={search.length}
						class:px-0={search.length}
						class:px-4={!search.length}
						class:w-14={!search.length}
						class="bg-gray-500 py-4 rounded-l-lg overflow-hidden transition-transform"
					>
						<Search class="w-5 h-5 mx-auto" />
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
						class="w-full h-full px-3 py-4 bg-transparent focus:outline-none my-auto"
						placeholder="Search for collaborators..."
					/>
				</div>

				{#if search.length}
					<div
						transition:slide={{ duration: 200 }}
						class="h-[11.5rem] flex flex-col gap-4 p-4 overflow-auto scrollbar"
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
							<div class="animate-pulse flex gap-3 items-center">
								<div
									class="rounded-full w-10 h-10 bg-gray-500"
								/>
								<div
									class="rounded-full w-32 h-4 bg-gray-500"
								/>
							</div>
						{:then users}
							{@const timestamp = Date.now()}

							{#each users as user (user.id)}
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

										// Default position is frontend since it's at the top
										authors = [
											...authors,
											{
												position: "Frontend",
												user
											}
										];
									}}
									in:fly={{ y: 20, duration: 200 }}
									class="flex gap-3 items-center"
								>
									<img
										width="512"
										height="512"
										src="{PUBLIC_CLOUDFLARE_URL}/avatar-{user.id}/avatar?{timestamp}"
										alt="{user.name}'s avatar"
										class="w-10 h-10 bg-gray-400 rounded-full object-cover object-center"
									/>
									<h1 class="text-lg">{user.name}</h1>
								</button>
							{/each}
						{:catch}
							<h1
								in:fly={{ y: 20, duration: 200 }}
								class="text-center"
							>
								No Results
							</h1>
						{/await}
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>
