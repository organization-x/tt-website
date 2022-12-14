<script lang="ts">
	import "../../../app.css";

	import { setContext } from "svelte";
	import { derived } from "svelte/store";
	import { slide, crossfade } from "svelte/transition";

	import { user } from "$lib/stores";
	import { page } from "$app/stores";
	import { afterNavigate } from "$app/navigation";
	import NavLink from "$lib/components/NavLink.svelte";
	import { PUBLIC_CLOUDFLARE_URL } from "$env/static/public";
	import Logo from "$lib/components/icons/logos/Logo.svelte";
	import Burger from "$lib/components/icons/general/Burger.svelte";
	import LogOut from "$lib/components/icons/general/LogOut.svelte";
	import DropArrow from "$lib/components/icons/general/DropArrow.svelte";
	import ExternalLink from "$lib/components/icons/general/ExternalLink.svelte";

	import type { LayoutServerData } from "./$types";

	export let data: LayoutServerData;

	// Layout gets rendered early before user is set, so make sure it's set
	user.set(data);

	// Create a name split for overflow prevention
	$: name = $user.name.split(/\s+/);
	$: setContext("name", name);

	let userOpen = false;
	let burgerOpen = false;
	let element: HTMLElement;
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
		!element.contains(target as Node) &&
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
</script>

<svelte:window on:click={windowClick} />

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

							{#if $user.role === "Admin"}
								<NavLink
									href="/dashboard/users"
									active={$pageId === "users"}
								>
									Users
								</NavLink>
							{/if}

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

				<div bind:this={element} class="relative ml-2">
					<button
						class:bg-gray-900={userOpen}
						class:rounded-lg={!userOpen}
						class:rounded-t-lg={userOpen}
						class:duration-200={!disableTransition}
						class:transition-colors={!disableTransition}
						class="flex gap-3 items-center p-3 justify-center min-w-[10rem] w-full hover:bg-gray-900"
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

<div class="pb-20">
	<slot />
</div>

{#if burgerOpen}
	<style>
		body {
			overflow: hidden;
		}

		@screen lg {
			body {
				overflow: auto;
			}
		}
	</style>
{/if}
