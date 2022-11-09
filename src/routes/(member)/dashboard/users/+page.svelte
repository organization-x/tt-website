<script lang="ts">
	import { setContext } from "svelte";
	import { quintIn } from "svelte/easing";

	import SearchBar from "$lib/components/SearchBar.svelte";
	import User from "$lib/components/dashboard/users/User.svelte";
	import Trash from "$lib/components/icons/general/Trash.svelte";
	import DashHero from "$lib/components/dashboard/DashHero.svelte";
	import DashWrap from "$lib/components/dashboard/DashWrap.svelte";

	import type { PageData } from "./$types";
	import { crossfade, scale, type TransitionConfig } from "svelte/transition";

	export let data: PageData;

	let search = "";
	let request: Promise<
		(App.UserWithMetadata & {
			analytics: App.UsersAnalyticsResponse[keyof App.UsersAnalyticsResponse];
		})[]
	> = new Promise(() => {});

	// Create a timestamp so the Cloudflare images dont cache
	$: request, setContext("timestamp", Date.now());

	const onSearch = () =>
		(request = fetch(
			`/api/user?where=${JSON.stringify({
				name: { contains: search.trim(), mode: "insensitive" }
			})}`
		)
			.then((res) => res.json())
			.then(async (data: App.UserWithMetadata[]) => {
				if (!data.length) Promise.reject();

				const analytics = await fetch(
					`/api/stats?ids=${data.map((user) => user.id).join(",")}`
				).then((res) => res.json());

				return data.map((user) => ({
					...user,
					analytics: analytics[
						user.id
					] as App.UsersAnalyticsResponse[keyof App.UsersAnalyticsResponse]
				}));
			}));

	// Transition for when a homepage user is removed
	const transition = (node: Element): TransitionConfig => {
		const height = node.clientHeight;

		return {
			duration: 350,
			easing: quintIn,
			css: (_, u) => {
				return `transform: translateY(${u * height * 4}px)`;
			}
		};
	};

	const [send, receive] = crossfade({
		duration: 400
	});
</script>

<svelte:head>
	<title>Users Manager</title>
</svelte:head>

<DashWrap>
	<DashHero title="All Users" />

	<div
		class="p-4 rounded-lg bg-gray-500/40 flex flex-col gap-4 overflow-hidden"
	>
		<h1 class="font-semibold text-lg text-center">Hompeage Users</h1>

		{#each { length: 3 } as _, i}
			{@const user = data.homepage[i]}

			<div class="relative h-[4.5rem]" style="z-index: {30 - i * 10};">
				{#if user}
					<div
						in:receive={{ key: user.id }}
						out:send={{ key: user.id }}
						class="p-4 bg-gray-800 absolute inset-0 rounded-lg flex gap-3 items-center h-full transition-transform"
					>
						<img
							height="512"
							width="512"
							src="https://imagedelivery.net/XcWbJUZNkBuRbJx1pRJDvA/avatar-{user.id}/avatar?{Date.now()}"
							alt="{user.name}'s avatar"
							loading="lazy"
							class="rounded-full bg-gray-400 w-10 h-10"
						/>

						<h1
							class="text-lg font-semibold overflow-auto scrollbar-hidden"
						>
							{user.name.split(" ")[0]}
						</h1>

						<button
							class="ml-auto"
							on:click={() =>
								(data.homepage = data.homepage.filter(
									({ id }) => id !== user.id
								))}
						>
							<Trash class="w-4 h-4" />
						</button>
					</div>
				{:else}
					<div
						class="border-gray-500/40 rounded-lg border-dashed border-4 h-full"
					/>
				{/if}
			</div>
		{/each}
	</div>

	<SearchBar
		bind:search
		on:input={() => (request = new Promise(() => {}))}
		on:search={onSearch}
		placeholder="Search all users..."
	/>

	<div class="flex flex-col gap-10  mt-5">
		{#await request}
			<h1>Loading</h1>
		{:then users}
			{#each users as user}
				<User {user} />
			{/each}
		{:catch error}
			<h1>Error</h1>
		{/await}
	</div>
</DashWrap>
