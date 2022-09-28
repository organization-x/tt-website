<script lang="ts">
	import "../../../app.css";

	import { derived } from "svelte/store";

	import { slide } from "svelte/transition";
	import { page, navigating } from "$app/stores";
	import Logo from "$lib/components/Logo.svelte";
	import NavLink from "$lib/components/NavLink.svelte";
	import Burger from "$lib/components/icons/Burger.svelte";
	import LogOut from "$lib/components/icons/LogOut.svelte";
	import DropArrow from "$lib/components/icons/DropArrow.svelte";
	import ExternalLink from "$lib/components/icons/ExternalLink.svelte";

	import type { LayoutData } from "./$types";

	export let data: LayoutData;

	let userOpen = false;
	let burgerOpen = false;
	let element: HTMLElement;
	let pageId = derived(
		page,
		($page) => $page.routeId?.split("/")[2] || "home"
	);

	$: if ($navigating) burgerOpen = userOpen = false;

	// Close the user menu when it's clicked outside of
	const onClick = ({ target }: Event) => {
		if (userOpen && !element.contains(target as Node)) userOpen = false;
	};
</script>

<svelte:window on:click={onClick} />

<header class="bg-black font-heading">
	<div
		class="p-4 mx-auto max-w-screen-2xl flex justify-between lg:items-center lg:px-6 xl:px-10"
	>
		<a href="/" class="z-50" aria-label="Home">
			<Logo class="w-10 h-10" />
		</a>
		<div class="lg:hidden flex gap-3 items-center">
			<h1 class="font-semibold">{data.user.name}</h1>
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
					<div class="p-16 pt-24 max-w-screen-lg mx-auto">
						<ul class="text-3xl divide-y max-w-md mx-auto">
							<NavLink href="/dashboard">Dashboard</NavLink>
							<NavLink href="/dashboard/analytics">
								Analytics
							</NavLink>
							<NavLink href="/dashboard/profile">Profile</NavLink>
							<NavLink href="/dashboard/projects">
								Projects
							</NavLink>
							<NavLink href="/dashboard/kudos">Kudos</NavLink>
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
				<div bind:this={element} class="relative ml-4">
					<button
						class:bg-gray-900={userOpen}
						class="flex gap-2 items-center px-4 py-3 rounded-t-lg"
						on:click={() => (userOpen = !userOpen)}
					>
						<!-- TODO: Replace placeholder -->

						<img
							width="200"
							height="200"
							src="/assets/projects/project/placeholder/banner.webp"
							alt="{data.user.name}'s avatar"
							class="w-8 h-8 rounded-full"
						/>
						<span class="font-semibold">{data.user.name}</span>
						<DropArrow open={userOpen} class="w-6 h-6" />
					</button>

					{#if userOpen}
						<div
							class="absolute bg-gray-900 w-full p-1 rounded-b-lg"
						>
							<ul class="flex flex-col gap-2">
								<NavLink
									target="_blank"
									href="/developers/{data.user.url}"
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
