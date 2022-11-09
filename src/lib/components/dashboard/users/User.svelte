<script lang="ts">
	import { getContext } from "svelte";
	import { slide } from "svelte/transition";

	import { getIcon } from "$lib/getIcon";
	import Home from "$lib/components/icons/general/Home.svelte";
	import GradientText from "$lib/components/GradientText.svelte";
	import Pencil from "$lib/components/icons/general/Pencil.svelte";
	import DashLink from "$lib/components/dashboard/DashLink.svelte";
	import ShowHide from "$lib/components/icons/general/ShowHide.svelte";
	import DashButton from "$lib/components/dashboard/DashButton.svelte";
	import DropArrow from "$lib/components/icons/general/DropArrow.svelte";

	export let user: App.UserWithMetadata & {
		analytics: App.UsersAnalyticsResponse[keyof App.UsersAnalyticsResponse];
	};

	let open = false;

	const timestamp = getContext("timestamp");

	// Calculate the total number of views this user has
	const views = user.analytics.new + user.analytics.returning;
</script>

<div class="relative">
	<div
		class="rounded-lg bg-gray-900 p-4 relative flex font-semibold flex-col gap-6 shadow-black/30 shadow-lg z-20"
	>
		<div class="flex gap-4 items-center">
			<div class="relative shrink-0">
				<img
					height="512"
					width="512"
					src="https://imagedelivery.net/XcWbJUZNkBuRbJx1pRJDvA/avatar-{user.id}/avatar?{timestamp}"
					alt="{user.name}'s avatar"
					loading="lazy"
					class="rounded-full bg-gray-400 w-12 h-12"
				/>

				<div
					class="absolute bg-gray-500 -bottom-3 -right-2 rounded-full p-2"
				>
					<svelte:component
						this={getIcon(user.team || "")}
						class="w-3 h-3 lg:w-5 lg:h-5"
					/>
				</div>
			</div>

			<div>
				<GradientText class="from-green-light to-green-dark">
					{user.name}
				</GradientText>

				<h1 class="text-sm -mt-0.5">
					{user.team || "No Team"}
				</h1>
			</div>
		</div>

		<p class="text-sm font-normal">{user.about}</p>

		<div>
			<div class="flex justify-between">
				<h1>{views} Views</h1>
				<h1>Last 30 days</h1>
			</div>

			<div
				class="relative bg-blue-dark h-4 rounded-sm w-full overflow-hidden mt-3"
			>
				<div
					class="absolute bg-blue-light inset-0"
					style="width: {Math.trunc(
						(user.analytics.new / views) * 100
					)}%"
				/>
			</div>

			<div class="flex gap-2 items-center mt-3">
				<div class="w-4 h-4 rounded-full bg-blue-light" />
				<h1>{user.analytics.new}</h1>

				<h1 class="ml-auto">New</h1>
			</div>

			<div class="flex gap-2 items-center">
				<div class="w-4 h-4 rounded-full bg-blue-dark" />
				<h1>{user.analytics.returning}</h1>

				<h1 class="ml-auto">Returning</h1>
			</div>
		</div>

		<div class="flex gap-3 mt-2 items-center">
			<h1>
				Last updated {new Date(user.lastUpdated).toLocaleDateString(
					"en-US"
				)}
			</h1>

			<button on:click={() => (open = !open)} class="ml-auto">
				<DropArrow {open} class="w-4 h-4" />
			</button>
		</div>
	</div>

	{#if open}
		<div
			transition:slide={{ duration: 200 }}
			class="bg-gray-900 rounded-b-lg relative -top-2 flex gap-6 justify-center px-3 pb-4 pt-8 z-10"
		>
			<DashButton icon={true} class="bg-gray-500/40 hover:bg-gray-500/20">
				<ShowHide class="w-4 h-4" crossed={false} />
			</DashButton>

			<DashButton icon={true} class="bg-gray-500/40 hover:bg-gray-500/20">
				<Home class="w-4 h-4" />
			</DashButton>

			<DashLink
				icon={true}
				href="/dashboard/users/{user.id}"
				class="bg-blue-light hover:bg-blue-light/80"
			>
				<Pencil class="w-4 h-4" />
			</DashLink>
		</div>
	{/if}
</div>
