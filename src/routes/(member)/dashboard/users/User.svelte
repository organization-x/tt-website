<script lang="ts">
	import { getContext } from "svelte";
	import { slide } from "svelte/transition";
	import type { Writable } from "svelte/store";

	import { getIcon } from "$lib/getIcon";
	import DashLink from "../DashLink.svelte";
	import { user as login } from "$lib/stores";
	import DashButton from "../DashButton.svelte";
	import Home from "$lib/icons/general/Home.svelte";
	import Pencil from "$lib/icons/general/Pencil.svelte";
	import ShowHide from "$lib/icons/general/ShowHide.svelte";
	import { PUBLIC_CLOUDFLARE_URL } from "$env/static/public";
	import DropArrow from "$lib/icons/general/DropArrow.svelte";
	import GradientText from "$lib/components/GradientText.svelte";

	import type { User } from "@prisma/client";

	export let user: App.UserWithMetadata & {
		analytics: App.UsersAnalyticsResponse[keyof App.UsersAnalyticsResponse];
	};

	// Use the array of users on the homepage to disable and/or change the color of the
	//  homepage button accordingly
	export let homeUsers: User[];

	const tabindex = getContext<Writable<number>>("tabindex");

	let open = false;

	// Store the visible and homepage state in a separate variable so svelte doesn't fire the user object
	// and mess up debounces
	let visible = user.visible;
	$: homepage = homeUsers.some(({ id }) => id === user.id);

	// Calculate the total number of views this user has
	const views = user.analytics.new + user.analytics.returning;

	const toggleVisible = () => {
		fetch("/api/user", {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				id: user.id,
				visible
			} as App.UserUpdateRequest)
		});
	};

	// Toggle whether the user is on the home page or not
	const toggleHomepage = () => {
		fetch("/api/user", {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				id: user.id,
				homepage
			} as App.UserUpdateRequest)
		});
	};
</script>

<div
	class:pb-0={!open}
	class="rounded-lg bg-gray-900 p-6 font-semibold"
	aria-expanded={open}
>
	<div class="flex flex-col gap-6">
		<div
			class="min-h-112 md:min-h-52 lg:min-h-44 lg:flex lg:justify-between lg:gap-8 lg:items-center"
		>
			<div
				class="flex flex-col gap-6 items-center md:flex-row lg:w-1/2 lg:shrink-0 lg:h-min"
			>
				<div class="relative shrink-0">
					<img
						height="512"
						width="512"
						src="{PUBLIC_CLOUDFLARE_URL}/avatar-{user.id}/avatar?{getContext(
							'timestamp'
						)}"
						alt="{user.name}'s avatar"
						loading="lazy"
						class="rounded-full bg-gray-400 w-20 h-20 object-cover object-center"
					/>

					<div
						class="absolute bg-gray-500 -bottom-2.5 -right-2.5 rounded-full p-2.5"
					>
						<svelte:component
							this={getIcon(user.team || "")}
							class="w-4 h-4"
						/>
					</div>
				</div>

				<div
					class="flex flex-col gap-1 text-center overflow-hidden w-full md:flex-col-reverse md:text-start md:gap-0"
				>
					<h1 class="xl:-mt-1.5">
						{user.team || "No Team"}
					</h1>

					<GradientText
						class="from-green-light to-green-dark text-3xl md:text-2xl lg:text-3xl"
					>
						{user.name}
					</GradientText>
				</div>
			</div>

			<p
				class="text-center font-normal mx-auto mt-6 break-words max-w-sm md:text-start md:max-w-none md:mx-0 lg:mt-0 lg:overflow-hidden"
			>
				{user.about}
			</p>
		</div>

		<div class="flex flex-col gap-3 max-w-md w-full md:max-w-none">
			<div class="flex justify-between">
				<h1>{views} Views</h1>
				<h1>Last 30 days</h1>
			</div>

			<div
				class="relative bg-blue-dark h-4 rounded-sm w-full overflow-hidden"
			>
				<div
					class="absolute bg-blue-light inset-0"
					style="width: {Math.trunc(
						(user.analytics.new / views) * 100
					)}%"
				/>
			</div>

			<div class="flex gap-2 items-center">
				<div class="w-4 h-4 rounded-full bg-blue-light" />
				<h1>{user.analytics.new}</h1>

				<h1 class="ml-auto">New</h1>
			</div>

			<div class="flex gap-2 items-center -mt-3">
				<div class="w-4 h-4 rounded-full bg-blue-dark" />
				<h1>{user.analytics.returning}</h1>

				<h1 class="ml-auto">Returning</h1>
			</div>
		</div>

		<div class="flex justify-between gap-6 items-center">
			<h1>
				Last updated {new Date(user.lastUpdated).toLocaleDateString(
					"en-US"
				)}
			</h1>

			<button
				on:click={() => (open = !open)}
				class="ml-auto md:hidden"
				tabindex={$tabindex}
			>
				<DropArrow {open} class="w-4 h-4" />
			</button>

			<div class="hidden md:flex md:gap-3 md:items-center">
				<DashButton
					icon={true}
					on:click={() => (visible = !visible)}
					debounce={{
						bind: visible,
						func: toggleVisible,
						delay: 300
					}}
					class="bg-gray-700 hover:bg-gray-700/60"
				>
					<ShowHide class="w-4 h-4" crossed={!visible} />
				</DashButton>

				<DashButton
					icon={true}
					on:click={() =>
						homeUsers.length !== 3 &&
						homeUsers.some(({ id }) => id === user.id)
							? (homeUsers = homeUsers.filter(
									({ id }) => id !== user.id
							  ))
							: (homeUsers = [...homeUsers, user])}
					debounce={{
						bind: homepage,
						func: toggleHomepage,
						delay: 300
					}}
					disabled={homeUsers.length === 3 && !homepage}
					class={homepage
						? "bg-blue-light hover:bg-blue-light/80"
						: "bg-gray-700 hover:bg-gray-700/60"}
				>
					<Home class="w-4 h-4" />
				</DashButton>

				<DashLink
					icon={true}
					href="/dashboard/users/{user.url}"
					class="bg-blue-light hover:bg-blue-light/80"
				>
					<Pencil class="w-4 h-4" />
				</DashLink>
			</div>
		</div>
	</div>

	<div
		class:scale-x-0={!open}
		class:scale-x-100={open}
		class="w-full mx-auto rounded-full mt-4 bg-gray-700 h-0.5 transition-transform"
	/>

	{#if open}
		<div
			transition:slide={{ duration: 200 }}
			class="bg-gray-900 flex gap-5 justify-center px-3 pt-6 -mb-2 md:hidden"
		>
			<DashButton
				icon={true}
				on:click={() => (visible = !visible)}
				debounce={{
					bind: visible,
					func: toggleVisible,
					delay: 300
				}}
				class="bg-gray-700 hover:bg-gray-700/60"
			>
				<ShowHide class="w-4 h-4" crossed={!visible} />
			</DashButton>

			<DashButton
				icon={true}
				on:click={() =>
					homeUsers.length !== 3 &&
					homeUsers.some(({ id }) => id === user.id)
						? (homeUsers = homeUsers.filter(
								({ id }) => id !== user.id
						  ))
						: (homeUsers = [...homeUsers, user])}
				debounce={{
					bind: homepage,
					func: toggleHomepage,
					delay: 300
				}}
				disabled={homeUsers.length === 3 && !homepage}
				class={homepage
					? "bg-blue-light hover:bg-blue-light/60"
					: "bg-gray-700 hover:bg-gray-700/60"}
			>
				<Home class="w-4 h-4" />
			</DashButton>

			<DashLink
				icon={true}
				href={user.id === $login.id
					? "/dashboard/profile"
					: `/dashboard/users/${user.url}`}
				class="bg-blue-light hover:bg-blue-light/80"
			>
				<Pencil class="w-4 h-4" />
			</DashLink>
		</div>
	{/if}
</div>
