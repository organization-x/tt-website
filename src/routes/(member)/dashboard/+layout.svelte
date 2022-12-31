<script lang="ts">
	import "../../../app.css";

	import { setContext } from "svelte";
	import { quadOut } from "svelte/easing";
	import { tweened } from "svelte/motion";
	import { crossfade } from "svelte/transition";
	import { derived, writable } from "svelte/store";

	import { user } from "$lib/stores";
	import { page } from "$app/stores";
	import { afterNavigate } from "$app/navigation";
	import Logo from "$lib/icons/logos/Logo.svelte";
	import NavLink from "$lib/components/NavLink.svelte";
	import Burger from "$lib/icons/general/Burger.svelte";
	import LogOut from "$lib/icons/general/LogOut.svelte";
	import { PUBLIC_CLOUDFLARE_URL } from "$env/static/public";
	import DropArrow from "$lib/icons/general/DropArrow.svelte";
	import ExternalLink from "$lib/icons/general/ExternalLink.svelte";

	import type { LayoutServerData } from "./$types";

	export let data: LayoutServerData;

	// Layout gets rendered early before user is set, so make sure it's set
	user.set(data);

	// Create a name split for overflow prevention
	$: name = $user.name.split(/\s+/);
	$: setContext("name", name);

	let userOpen = false;
	let burgerOpen = false;
	let dropdown: HTMLDivElement;
	let burgerParent: HTMLUListElement;
	let pageId = derived(
		page,
		($page) => $page.route.id?.split("/")[3] || "home"
	);

	// When the user menu is closed by a click outside of it, disabled the color transition
	// since it looks weird
	let disableTransition = false;

	// Close the user menu when it's clicked outside of
	const windowClick = ({ target }: Event) =>
		userOpen &&
		!dropdown.contains(target as Node) &&
		(disableTransition = true) &&
		(userOpen = false);

	// Create a timestamp so the images from Cloudflare don't cache and generate
	// a new one every time the user navigates. This is used everywhere but the
	// profile page since the information needs to update immediately
	$: $page, setContext("timestamp", Date.now());

	// Close the burger/user menu on navigation
	afterNavigate(() => (burgerOpen = userOpen = false));

	const [send, receive] = crossfade({
		duration: 400
	});

	// Create a tabindex context so that focusing can be disabled properly when
	// the burger menu is open
	const tabindex = writable(0);
	setContext("tabindex", tabindex);

	// Burger menu opening animation
	const height = tweened(0, { duration: 400, easing: quadOut });

	$: if (burgerOpen) {
		height.set(100);
		tabindex.set(-1);

		// Animate the burger menu items, the dashboard needs a very slight delay
		// since it starts the animations and uses the incorrect delay otherwise
		if (burgerParent)
			setTimeout(() => {
				for (const child of burgerParent.children) {
					child.classList.remove("translate-y-6", "opacity-0");
				}
			});
	} else {
		height.set(0);
		tabindex.set(0);

		// Animate the burger menu items, the dashboard needs a very slight delay
		// since it starts the animations and uses the incorrect delay otherwise
		if (burgerParent)
			setTimeout(() => {
				for (const child of burgerParent.children) {
					child.classList.add("translate-y-6", "opacity-0");
				}
			});
	}
</script>

<svelte:window
	on:click={windowClick}
	on:resize={() =>
		window.innerWidth >= 1024 && burgerOpen && (burgerOpen = false)}
/>

<svelte:head>
	<meta name="robots" content="noindex" />
</svelte:head>

<header class="bg-black">
	<div
		class="p-4 mx-auto max-w-screen-2xl flex justify-between items-center lg:gap-4 lg:px-6 xl:px-10"
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
			{#if !burgerOpen}
				<div
					in:receive={{ key: "user" }}
					out:send={{ key: "user" }}
					class="flex gap-3 items-center z-50"
				>
					<img
						width="512"
						height="512"
						src="{PUBLIC_CLOUDFLARE_URL}/avatar-{$user.id}/avatar?{new Date().getTime()}"
						alt="{$user.name}'s avatar"
						class="w-9 h-9 rounded-full object-cover object-center bg-gray-400"
					/>
					<h1
						class="font-semibold text-sm overflow-auto scrollbar-hidden max-w-[7rem]"
					>
						{name[0]}
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
				<Burger {burgerOpen} />
			</button>

			<nav
				aria-expanded={burgerOpen}
				class:overflow-auto={$height === 100}
				class:overflow-hidden={$height !== 100}
				class="z-40 absolute inset-0 top-18 bg-black h-full"
				style="height: {$height}%"
			>
				<div
					class="p-14 pt-24 max-w-screen-lg mx-auto"
					aria-hidden={!burgerOpen}
				>
					{#if burgerOpen}
						<div
							in:receive={{ key: "user" }}
							out:send={{ key: "user" }}
							class="flex gap-3 items-center w-fit z-50 mx-auto"
						>
							<img
								width="512"
								height="512"
								src="{PUBLIC_CLOUDFLARE_URL}/avatar-{$user.id}/avatar?{new Date().getTime()}"
								alt="{$user.name}'s avatar"
								class="w-14 h-14 rounded-full object-cover object-center bg-gray-400"
							/>

							<h1
								class="font-semibold text-xl overflow-auto scrollbar-hidden max-w-44"
							>
								{name[0]}
							</h1>
						</div>
					{/if}

					<ul
						bind:this={burgerParent}
						class="text-3xl divide-y max-w-md mx-auto mt-4 list-disc lg:list-none"
					>
						<NavLink
							href="/dashboard"
							active={$pageId === "home"}
							{burgerOpen}
						>
							Dashboard
						</NavLink>

						<NavLink
							href="/dashboard/analytics"
							active={$pageId === "analytics"}
							{burgerOpen}
						>
							Analytics
						</NavLink>

						<NavLink
							href="/dashboard/profile"
							active={$pageId === "profile"}
							{burgerOpen}
						>
							Profile
						</NavLink>

						<NavLink
							href="/dashboard/projects"
							active={$pageId === "projects"}
							{burgerOpen}
						>
							Projects
						</NavLink>

						<NavLink
							href="/dashboard/kudos"
							active={$pageId === "kudos"}
							{burgerOpen}
						>
							Kudos
						</NavLink>

						{#if $user.role === "Admin"}
							<NavLink
								href="/dashboard/users"
								active={$pageId === "users"}
								{burgerOpen}
							>
								Users
							</NavLink>
						{/if}

						<NavLink
							target="_blank"
							href="/developers/{$user.url}"
							{burgerOpen}
						>
							View Profile
						</NavLink>

						<NavLink href="/logout" {burgerOpen}>Log Out</NavLink>
					</ul>
				</div>
			</nav>
		</div>

		<div class="hidden lg:block lg:text-sm xl:text-base">
			<ul class="flex gap-3 items-center">
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

				{#if $user.role === "Admin"}
					<NavLink
						href="/dashboard/users"
						active={$pageId === "users"}
					>
						Users
					</NavLink>
				{/if}

				<div bind:this={dropdown} class="relative ml-2">
					<button
						class:bg-gray-900={userOpen}
						class:rounded-lg={!userOpen}
						class:rounded-t-lg={userOpen}
						class:duration-200={!disableTransition}
						class:transition-colors={!disableTransition}
						class="flex gap-3 items-center p-3 justify-center min-w-40 w-full hover:bg-gray-900"
						on:transitionend={() => (disableTransition = false)}
						on:click={() => (userOpen = !userOpen)}
					>
						<img
							width="512"
							height="512"
							src="{PUBLIC_CLOUDFLARE_URL}/avatar-{$user.id}/avatar?{new Date().getTime()}"
							alt="{$user.name}'s avatar"
							class="w-8 h-8 rounded-full object-cover object-center bg-gray-400"
						/>

						<span
							class:max-w-40={$user.role !== "Admin"}
							class:max-w-[7rem]={$user.role === "Admin"}
							class="font-semibold overflow-auto scrollbar-hidden"
						>
							{name[0]}
						</span>

						<DropArrow open={userOpen} class="w-3 h-3 shrink-0" />
					</button>

					{#if userOpen}
						<div
							class="absolute bg-gray-900 w-full p-1 rounded-b-lg z-50"
						>
							<ul class="flex flex-col gap-2 p-1">
								<NavLink
									target="_blank"
									href="/developers/{$user.url}"
									class="hover:bg-gray-700"
								>
									<ExternalLink class="w-4 h-4" />
									View Profile
								</NavLink>

								<NavLink
									href="/logout"
									class="hover:bg-gray-700"
								>
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

<div aria-hidden={burgerOpen} class="pb-20">
	<slot />
</div>

{#if burgerOpen}
	<style>
		body {
			@apply max-lg:overflow-hidden;
		}
	</style>
{/if}
