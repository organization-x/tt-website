<script lang="ts">
	import { onMount } from "svelte";
	import { slide, fly } from "svelte/transition";

	import { user } from "$lib/stores";
	import { debounce } from "$lib/debounce";
	import Search from "$lib/components/icons/general/Search.svelte";
	import AuthorEditor from "$lib/components/dashboard/projects/AuthorEditor.svelte";

	import type { User } from "@prisma/client";

	export let ownerId: string;
	export let authors: App.Author[];

	// Keep track of which side is disabled
	const enum Side {
		Top,
		Bottom,
		Both,
		None
	}

	let search = "";
	let innerHeight: number;
	let clientHeight: number;
	let disabledSide = Side.Both;
	let scrollable: HTMLDivElement;
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

	// Update which gradient on either side is shown based on where the element is scrolled to
	const checkGradient = () => {
		if (innerHeight >= 1024) return;

		if (clientHeight === scrollable.scrollHeight) disabledSide = Side.Both;
		else if (scrollable.scrollTop === 0) disabledSide = Side.Top;
		else if (
			scrollable.scrollTop - (scrollable.scrollHeight - clientHeight) >=
			-0.5
		)
			disabledSide = Side.Bottom;
		else disabledSide = Side.None;
	};

	$: clientHeight, scrollable && checkGradient();

	// Update the gradients based off of content in them on mount
	onMount(() => {
		// Create an observer to update the gradient on scrollHeight change
		const observer = new MutationObserver(checkGradient);

		observer.observe(scrollable, {
			subtree: true,
			attributes: true
		});

		checkGradient();

		return () => observer.disconnect();
	});
</script>

<svelte:window bind:innerHeight />

<div class="lg:flex lg:justify-between lg:gap-14">
	<div class="relative lg:w-full">
		<h1 class="font-semibold text-xl">Authors</h1>
		<div class="bg-gray-900 p-4 mt-3 rounded-lg after:inset-x-0">
			<div
				class:before:opacity-0={disabledSide === Side.Top ||
					disabledSide === Side.Both}
				class:after:opacity-0={disabledSide === Side.Bottom ||
					disabledSide === Side.Both}
				class="relative

                before:transition-opacity before:duration-300 before:z-10 before:absolute before:top-0 before:w-full before:h-8 before:bg-gradient-to-b before:from-gray-900 before:to-transparent before:pointer-events-none

                after:transition-opacity after:duration-300 after:z-10 after:absolute after:bottom-0 after:w-full after:h-8 after:bg-gradient-to-t after:from-gray-900 after:to-transparent after:pointer-events-none

                lg:before:hidden lg:after:hidden"
			>
				<div
					bind:clientHeight
					bind:this={scrollable}
					on:scroll={checkGradient}
					class="scrollbar-hidden overflow-auto max-lg:max-h-[27.5rem] lg:grid lg:grid-cols-2 lg:gap-x-4 lg:overflow-visible"
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

								// Requery the search
								onSearch();
							}}
						/>
					{/each}
				</div>
			</div>

			<div class="bg-gray-700 rounded-lg mt-4 lg:col-span-2 lg:mt-0">
				<div class="flex select-none lg:col-span-2">
					<div
						class:w-0={search.length}
						class:px-0={search.length}
						class:px-4={!search.length}
						class:w-14={!search.length}
						class="bg-gray-500 py-4 rounded-l-lg overflow-hidden transition-widpad"
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
							{@const timestamp = Date.now()}

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

										// Default position is frontend since it's at the top
										authors.push({
											position: "Frontend",
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
								No results
							</h1>
						{/await}
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>
