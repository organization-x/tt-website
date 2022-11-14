<script lang="ts">
	import { flip } from "svelte/animate";
	import { fly, scale } from "svelte/transition";

	import SearchBar from "$lib/components/SearchBar.svelte";
	import User from "$lib/components/dashboard/users/User.svelte";
	import Trash from "$lib/components/icons/general/Trash.svelte";
	import DashHero from "$lib/components/dashboard/DashHero.svelte";
	import DashWrap from "$lib/components/dashboard/DashWrap.svelte";

	import type { PageServerData } from "./$types";

	export let data: PageServerData;

	let search = "";
	let request: Promise<
		(App.UserWithMetadata & {
			analytics: App.UsersAnalyticsResponse[keyof App.UsersAnalyticsResponse];
		})[]
	> = new Promise(() => {});

	const onSearch = () =>
		(request = fetch(
			`/api/user?where=${JSON.stringify({
				name: { contains: search.trim(), mode: "insensitive" }
			})}`
		)
			.then((res) => res.json())
			.then(async (data: App.UserWithMetadata[]) => {
				if (!data.length) return Promise.reject();

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
</script>

<svelte:head>
	<title>Users Manager</title>
</svelte:head>

<DashWrap>
	<DashHero title="Manage Users" />

	<div class="flex flex-col gap-5">
		<h1 class="font-semibold text-2xl text-center">Homepage Users</h1>

		<div
			class="p-4 relative rounded-lg bg-gray-900 lg:flex lg:gap-6 lg:items-center"
		>
			<p class="lg:max-w-xs lg:mx-auto">
				Users here will be featured on the front page of the Team
				Tomorrow website. Their skills, projects, and about me will all
				be the first user information visible to employers. Every month,
				these users should be rotated based on who is most engaged or is
				seeing high volumes of traffic.
			</p>

			<div class="mt-6 flex flex-col gap-4 relative lg:w-1/2 lg:mt-0">
				<div class="flex flex-col gap-4 absolute inset-0 z-10">
					{#each data.homeUsers as user (user.id)}
						<div animate:flip={{ duration: 400 }}>
							<div
								out:scale|local={{ duration: 200 }}
								in:scale|local={{ duration: 200 }}
								class="p-4 bg-gray-700 flex gap-3 items-center h-16 rounded-lg"
							>
								<img
									height="512"
									width="512"
									src="https://imagedelivery.net/XcWbJUZNkBuRbJx1pRJDvA/avatar-{user.id}/avatar?{Date.now()}"
									alt="{user.name}'s avatar"
									loading="lazy"
									class="rounded-full object-cover object-center bg-gray-400 w-10 h-10"
								/>

								<h1
									class="text-lg font-semibold overflow-auto scrollbar-hidden lg:text-base"
								>
									{user.name.split(" ")[0]}
								</h1>

								<button
									class="ml-auto"
									on:click={() =>
										(data.homeUsers = data.homeUsers.filter(
											({ id }) => id !== user.id
										))}
								>
									<Trash class="w-4 h-4" />
								</button>
							</div>
						</div>
					{/each}
				</div>

				<div
					class="border-gray-700 border-dashed border-4 h-16 rounded-lg"
				/>

				<div
					class="border-gray-700 border-dashed border-4 h-16 rounded-lg"
				/>

				<div
					class="border-gray-700 border-dashed border-4 h-16 rounded-lg"
				/>
			</div>
		</div>

		<h1 class="font-semibold text-2xl text-center mt-4">All Users</h1>

		<SearchBar
			bind:search
			on:input={() => (request = new Promise(() => {}))}
			on:search={onSearch}
			placeholder="Search all users..."
			lightBg={false}
		/>

		<div class="flex flex-col gap-10 min-h-[72.5rem] -mt-1">
			{#await request}
				<div
					class="rounded-lg bg-gray-500 p-4 flex flex-col gap-6 animate-pulse min-h-[35rem]"
				>
					<div class="flex flex-col gap-7 items-center md:flex-row">
						<div class="w-20 h-20 bg-gray-400 rounded-full" />
						<div
							class="flex flex-col gap-3 items-center text-center md:flex-col-reverse md:text-start md:items-start"
						>
							<div
								class="rounded-full h-4 w-24 bg-gray-400 md:mt-0.5"
							/>

							<div class="rounded-full h-7 w-60 bg-gray-400" />
						</div>
					</div>

					<div
						class="flex flex-col items-center px-3 gap-4 my-3 md:items-start md:px-0"
					>
						<div class="rounded-sm h-2 w-full bg-gray-400" />
						<div class="rounded-sm h-2 w-full bg-gray-400" />
						<div class="rounded-sm h-2 w-full bg-gray-400" />
						<div class="rounded-sm h-2 w-full bg-gray-400" />
						<div class="rounded-sm h-2 w-full bg-gray-400" />
						<div class="rounded-sm h-2 w-32 bg-gray-400" />
					</div>

					<div class="flex flex-col gap-3">
						<div class="flex justify-between">
							<div class="rounded-full h-5 w-20 bg-gray-400" />

							<div class="rounded-full h-5 w-24 bg-gray-400" />
						</div>

						<div class="rounded-sm w-full h-4 bg-gray-400" />

						<div
							class="flex w-full justify-between items-center mt-0.5"
						>
							<div
								class="w-4 h-4 shrink-0 bg-gray-400 rounded-full"
							/>

							<div
								class="w-8 h-5 ml-2 rounded-full bg-gray-400 lg:h-4 lg:ml-2"
							/>

							<div
								class="w-10 h-5 ml-auto rounded-full bg-gray-400 lg:h-4"
							/>
						</div>

						<div
							class="flex w-full justify-between items-center -mt-2"
						>
							<div
								class="w-4 h-4 shrink-0 bg-gray-400 rounded-full"
							/>

							<div
								class="w-8 h-5 ml-2 rounded-full bg-gray-400 lg:h-4 lg:ml-2"
							/>

							<div
								class="w-20 h-5 ml-auto rounded-full bg-gray-400 lg:h-4"
							/>
						</div>
					</div>
				</div>

				<div
					class="rounded-lg bg-gray-500 p-4 flex flex-col gap-6 animate-pulse min-h-[35rem]"
				>
					<div class="flex flex-col gap-7 items-center md:flex-row">
						<div class="w-20 h-20 bg-gray-400 rounded-full" />
						<div
							class="flex flex-col gap-3 items-center text-center md:flex-col-reverse md:text-start md:items-start"
						>
							<div
								class="rounded-full h-4 w-24 bg-gray-400 md:mt-0.5"
							/>

							<div class="rounded-full h-7 w-60 bg-gray-400" />
						</div>
					</div>

					<div
						class="flex flex-col items-center px-3 gap-4 my-3 md:items-start md:px-0"
					>
						<div class="rounded-sm h-2 w-full bg-gray-400" />
						<div class="rounded-sm h-2 w-full bg-gray-400" />
						<div class="rounded-sm h-2 w-full bg-gray-400" />
						<div class="rounded-sm h-2 w-full bg-gray-400" />
						<div class="rounded-sm h-2 w-full bg-gray-400" />
						<div class="rounded-sm h-2 w-32 bg-gray-400" />
					</div>

					<div class="flex flex-col gap-3">
						<div class="flex justify-between">
							<div class="rounded-full h-5 w-20 bg-gray-400" />

							<div class="rounded-full h-5 w-24 bg-gray-400" />
						</div>

						<div class="rounded-sm w-full h-4 bg-gray-400" />

						<div
							class="flex w-full justify-between items-center mt-0.5"
						>
							<div
								class="w-4 h-4 shrink-0 bg-gray-400 rounded-full"
							/>

							<div
								class="w-8 h-5 ml-2 rounded-full bg-gray-400 lg:h-4 lg:ml-2"
							/>

							<div
								class="w-10 h-5 ml-auto rounded-full bg-gray-400 lg:h-4"
							/>
						</div>

						<div
							class="flex w-full justify-between items-center -mt-2"
						>
							<div
								class="w-4 h-4 shrink-0 bg-gray-400 rounded-full"
							/>

							<div
								class="w-8 h-5 ml-2 rounded-full bg-gray-400 lg:h-4 lg:ml-2"
							/>

							<div
								class="w-20 h-5 ml-auto rounded-full bg-gray-400 lg:h-4"
							/>
						</div>
					</div>
				</div>
			{:then users}
				{#each users as user}
					<User bind:homeUsers={data.homeUsers} {user} />
				{/each}
			{:catch}
				<h1
					in:fly={{ duration: 300, y: 30 }}
					class="text-center font-semibold text-2xl pt-5"
				>
					No users
				</h1>
			{/await}
		</div>
	</div>
</DashWrap>
