<script lang="ts">
	import "../../../app.css";

	import { derived } from "svelte/store";

	import { page, navigating } from "$app/stores";
	import { slide } from "svelte/transition";
	import Logo from "$lib/components/Logo.svelte";
	import NavLink from "$lib/components/NavLink.svelte";
	import Burger from "$lib/components/icons/Burger.svelte";

	import type { LayoutData } from "./$types";

	export let data: LayoutData;

	let open = false;
	let pageId = derived(
		page,
		($page) => $page.routeId?.split("/")[2] || "home"
	);

	$: if ($navigating) open = false;
</script>

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
					open = !open;
					window.scrollTo(0, 0);
				}}
			>
				<Burger {open} />
			</button>
			{#if open}
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
				<NavLink href="/dashboard" active={$pageId === "home"}
					>Dashboard</NavLink
				>
				<NavLink
					href="/dashboard/analytics"
					active={$pageId === "analytics"}>Analytics</NavLink
				>
				<NavLink
					href="/dashboard/profile"
					active={$pageId === "profile"}>Profile</NavLink
				>
				<NavLink
					href="/dashboard/projects"
					active={$pageId === "projects"}>Projects</NavLink
				>
				<NavLink href="/dashboard/kudos" active={$pageId === "kudos"}
					>Kudos</NavLink
				>
				<a
					href="/logout"
					class="px-4 py-1 bg-white text-black rounded-3xl transition-border hover:rounded-md"
				>
					Log Out
				</a>
			</ul>
		</div>
	</div>
</header>

<div class="pb-20">
	<slot />
</div>

{#if open}
	<style>
		body {
			overflow: hidden;
		}
	</style>
{/if}
