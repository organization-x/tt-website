<script lang="ts">
	import "../../../app.css";

	import { derived } from "svelte/store";
	import { slide, crossfade } from "svelte/transition";

	import { user } from "$lib/stores";
	import { page } from "$app/stores";
	import { afterNavigate } from "$app/navigation";
	import Logo from "$lib/components/icons/Logo.svelte";
	import NavLink from "$lib/components/NavLink.svelte";
	import Burger from "$lib/components/icons/Burger.svelte";
	import LogOut from "$lib/components/icons/LogOut.svelte";
	import DropArrow from "$lib/components/icons/DropArrow.svelte";
	import ExternalLink from "$lib/components/icons/ExternalLink.svelte";

	import type { LayoutServerData } from "./$types";

	export let data: LayoutServerData;

	// Layout gets rendered early before user is set, so make sure it's set
	user.set(data);

	// Get first name of user for overflow prevention
	$: firstName = $user.name.split(" ")[0];

	let userOpen = false;
	let burgerOpen = false;
	let element: HTMLElement;
	let pageId = derived(
		page,
		($page) => $page.routeId?.split("/")[2] || "home"
	);

	// Close the user menu when it's clicked outside of
	const onClick = ({ target }: Event) =>
		userOpen && !element.contains(target as Node) && (userOpen = false);

	// Close the burger/user menu on navigation
	afterNavigate(() => (burgerOpen = userOpen = false));

	const [send, receive] = crossfade({
		duration: 400
	});

	// TODO: Fix transition of user menu
</script>

<svelte:window on:click={onClick} />

<header class="bg-black">
	<div
		class="p-4 mx-auto max-w-screen-2xl flex justify-between lg:items-center lg:px-6 xl:px-10"
	>
		<a
			href="/dashboard"
			class="z-50"
			aria-label="Home"
			rel="noopener noreferrer"
		>
			<Logo class="w-10 h-10" />
		</a>
		<div class="lg:hidden flex gap-3 items-center">
			<!-- TODO: Replace placeholder -->

			{#if !burgerOpen}
				<div
					in:receive={{ key: "user" }}
					out:send={{ key: "user" }}
					class="flex gap-3 items-center z-50"
				>
					<img
						width="200"
						height="200"
						src="/assets/developers/user/placeholder/icon.webp"
						alt="{$user.name}'s avatar"
						class=" w-9 h-9 rounded-full"
					/>
					<h1
						class="font-semibold text-sm overflow-auto scrollbar-hidden max-w-[7rem]"
					>
						{firstName}
					</h1>
				</div>
			{/if}

			<button
				type="button"
				aria-label="Menu"
				class="z-50 relative"
				on:click={() => {
					burgerOpen = !burgerOpen;
					window.scrollTo(0, 0);
				}}
			>
				<Burger open={burgerOpen} />
			</button>
			{#if burgerOpen}
				<nav
					transition:slide
					class="z-40 absolute inset-0 top-18 overflow-y-auto bg-black h-full"
				>
					<div class="p-14 pt-24 max-w-screen-lg mx-auto">
						<div
							in:receive={{ key: "user" }}
							out:send={{ key: "user" }}
							class="flex gap-3 items-center w-fit z-50 mx-auto"
						>
							<img
								width="200"
								height="200"
								src="/assets/developers/user/placeholder/icon.webp"
								alt="{$user.name}'s avatar"
								class=" w-14 h-14 rounded-full"
							/>
							<h1 class="font-semibold text-xl">
								{firstName}
							</h1>
						</div>
						<ul
							class="text-3xl divide-y max-w-md mx-auto mt-4 list-disc lg:list-none"
						>
							<NavLink
								href="/dashboard"
								active={$pageId === "home"}
							>
								Dashboard
							</NavLink>
							<NavLink
								href="/dashboard/analytics"
								active={$pageId === "analytics"}
							>
								Analytics
							</NavLink>
							<NavLink
								href="/dashboard/profile"
								active={$pageId === "profile"}
							>
								Profile
							</NavLink>
							<NavLink
								href="/dashboard/projects"
								active={$pageId === "projects"}
							>
								Projects
							</NavLink>
							<NavLink
								href="/dashboard/kudos"
								active={$pageId === "kudos"}
							>
								Kudos
							</NavLink>
							<NavLink
								target="_blank"
								href="/developers/{$user.url}"
							>
								View Profile
							</NavLink>
							<NavLink href="/logout">Log Out</NavLink>
						</ul>
					</div>
				</nav>
			{/if}
		</div>
		<div class="hidden lg:block">
			<ul class="flex gap-2 items-center">
				<NavLink href="/dashboard" active={$pageId === "home"}>
					Dashboard
				</NavLink>
				<NavLink
					href="/dashboard/analytics"
					active={$pageId === "analytics"}
				>
					Analytics
				</NavLink>
				<NavLink
					href="/dashboard/profile"
					active={$pageId === "profile"}
				>
					Profile
				</NavLink>
				<NavLink
					href="/dashboard/projects"
					active={$pageId === "projects"}
				>
					Projects
				</NavLink>
				<NavLink href="/dashboard/kudos" active={$pageId === "kudos"}>
					Kudos
				</NavLink>
				<div bind:this={element} class="relative ml-4 w-44">
					<button
						class:rounded-lg={!userOpen}
						class:rounded-t-lg={userOpen}
						class="flex gap-2 items-center justify-center py-3 w-full transition-colors duration-200
                        {userOpen ? 'bg-gray-900' : 'hover:bg-gray-500/40'}"
						on:click={() => (userOpen = !userOpen)}
					>
						<!-- TODO: Replace placeholder -->

						<img
							width="200"
							height="200"
							src="/assets/projects/project/placeholder/banner.webp"
							alt="{$user.name}'s avatar"
							class="w-8 h-8 rounded-full"
						/>
						<span class="font-semibold">{firstName}</span>
						<DropArrow open={userOpen} class="w-6 h-6" />
					</button>

					{#if userOpen}
						<div
							class="absolute bg-gray-900 w-full p-1 rounded-b-lg"
						>
							<ul class="flex flex-col gap-2 p-1">
								<NavLink
									target="_blank"
									href="/developers/{$user.url}"
								>
									<ExternalLink class="w-5 h-5" />
									View Profile
								</NavLink>
								<NavLink href="/logout">
									<LogOut class="w-5 h-5" />
									Log Out
								</NavLink>
							</ul>
						</div>
					{/if}
				</div>
			</ul>
		</div>
	</div>
</header>

<div class="pb-20">
	<slot />
</div>

{#if burgerOpen}
	<style>
		body {
			overflow: hidden;
		}
	</style>
{/if}
