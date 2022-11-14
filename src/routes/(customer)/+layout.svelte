<script lang="ts">
	import "../../app.css";

	import { setContext } from "svelte";
	import { derived } from "svelte/store";
	import { slide } from "svelte/transition";

	import { page } from "$app/stores";
	import { afterNavigate } from "$app/navigation";
	import NavLink from "$lib/components/NavLink.svelte";
	import FootLink from "$lib/components/FootLink.svelte";
	import AICamp from "$lib/components/index/AICamp.svelte";
	import Logo from "$lib/components/icons/logos/Logo.svelte";
	import Burger from "$lib/components/icons/general/Burger.svelte";
	import YouTube from "$lib/components/icons/logos/YouTube.svelte";
	import Envelope from "$lib/components/icons/general/Envelope.svelte";
	import Instagram from "$lib/components/icons/general/Instagram.svelte";

	import type { LayoutServerData } from "./$types";
	import DropArrow from "$lib/components/icons/general/DropArrow.svelte";
	import ExternalLink from "$lib/components/icons/general/ExternalLink.svelte";
	import LogOut from "$lib/components/icons/general/LogOut.svelte";

	export let data: LayoutServerData;

	// Get first name of user for overflow prevention
	const firstName = data.user && data.user.name.split(" ")[0];

	let userOpen = false;
	let burgerOpen = false;
	let element: HTMLElement;
	let pageId = derived(
		page,
		($page) => $page.routeId?.split("/")[2] || "home"
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
	// a new one every time the user navigates
	$: $page, setContext("timestamp", Date.now());

	afterNavigate(async () => {
		burgerOpen = userOpen = false;

		if (!data.track) return;

		// Dynamically import analytics to prevent errors when the client blocks it
		import("$lib/analytics")
			.then(async ({ analytics }) => await analytics.page())
			.catch(() => {}); // Ignore errors
	});
</script>

<svelte:window on:click={windowClick} />

<header class="bg-black">
	<div
		class="p-4 mx-auto max-w-screen-2xl flex justify-between lg:items-center lg:gap-4 lg:px-6 xl:px-10"
	>
		<a href="/" class="z-50" aria-label="Home" rel="noopener noreferrer">
			<Logo class="w-10 h-10" />
		</a>

		<div class="lg:hidden flex items-center">
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
						{#if data.user}
							<div
								class="flex gap-3 items-center w-fit z-50 mx-auto"
							>
								<img
									width="512"
									height="512"
									src="https://imagedelivery.net/XcWbJUZNkBuRbJx1pRJDvA/avatar-{data
										.user.id}/avatar?{new Date().getTime()}"
									alt="{data.user.name}'s avatar"
									class="w-14 h-14 object-cover object-center rounded-full bg-gray-400"
								/>

								<h1
									class="font-semibold text-xl overflow-auto scrollbar-hidden max-w-44"
								>
									{firstName}
								</h1>
							</div>
						{/if}

						<ul
							class:mt-4={data.user}
							class="text-3xl divide-y max-w-md mx-auto list-disc lg:list-none"
						>
							<NavLink href="/" active={$pageId === "home"}>
								Home
							</NavLink>

							<NavLink href="/about" active={$pageId === "about"}>
								About
							</NavLink>

							<NavLink
								href="/developers"
								active={$pageId === "developers"}
							>
								Developers
							</NavLink>

							<NavLink
								href="/projects"
								active={$pageId === "projects"}
							>
								Projects
							</NavLink>

							<NavLink href="https://ai-camp.org" target="_blank">
								AI Camp
							</NavLink>

							{#if data.user}
								<NavLink href="/dashboard">Dashboard</NavLink>

								<NavLink href="/logout">Log Out</NavLink>
							{:else}
								<NavLink
									href="/contact"
									active={$pageId === "contact"}
								>
									Contact Us
								</NavLink>
							{/if}
						</ul>
						<div
							class="mt-8 flex gap-6 text-4xl justify-center items-center"
						>
							<a
								href="https://instagram.com/aicamp1"
								target="_blank"
								rel="noreferrer noopener"
								title="AI Camp Instagram"
							>
								<Instagram class="w-7 h-7" />
							</a>

							<a
								href="https://www.youtube.com/channel/UCUGJzo5EwViLGpAgYphNyzg"
								target="_blank"
								rel="noreferrer noopener"
								title="AI Camp YouTube"
							>
								<YouTube class="w-9 h-9" />
							</a>

							<a
								href="mailto:hello@ai-camp.org"
								target="_blank"
								rel="noreferrer noopener"
								title="AI Camp Email"
							>
								<Envelope class="w-8 h-8" />
							</a>
						</div>
					</div>
				</nav>
			{/if}
		</div>

		<div class="hidden lg:block lg:text-sm xl:text-base">
			<ul class="flex gap-3 items-center">
				<NavLink href="/" active={$pageId === "home"}>Home</NavLink>

				<NavLink href="/about" active={$pageId === "about"}>
					About
				</NavLink>

				<NavLink href="/developers" active={$pageId === "developers"}>
					Developers
				</NavLink>

				<NavLink href="/projects" active={$pageId === "projects"}>
					Projects
				</NavLink>

				<NavLink href="https://ai-camp.org" target="_blank">
					AI Camp
				</NavLink>

				{#if data.user}
					<div bind:this={element} class="relative ml-2">
						<button
							class:bg-gray-900={userOpen}
							class:rounded-lg={!userOpen}
							class:rounded-t-lg={userOpen}
							class:duration-200={!disableTransition}
							class:transition-colors={!disableTransition}
							class="flex gap-3 items-center justify-center p-3 w-full hover:bg-gray-900"
							on:transitionend={() => (disableTransition = false)}
							on:click={() => (userOpen = !userOpen)}
						>
							<img
								width="512"
								height="512"
								src="https://imagedelivery.net/XcWbJUZNkBuRbJx1pRJDvA/avatar-{data
									.user.id}/avatar?{new Date().getTime()}"
								alt="{data.user.name}'s avatar"
								class="w-8 h-8 object-cover object-center rounded-full bg-gray-400"
							/>

							<span
								class="font-semibold overflow-auto scrollbar-hidden max-w-40"
							>
								{firstName}
							</span>

							<DropArrow
								open={userOpen}
								class="w-3 h-3 shrink-0"
							/>
						</button>

						{#if userOpen}
							<div
								class="absolute bg-gray-900 w-full p-1 rounded-b-lg z-50"
							>
								<ul class="flex flex-col gap-1 p-1">
									<NavLink
										target="_blank"
										href="/dashboard"
										class="hover:bg-gray-700"
									>
										<ExternalLink class="w-4 h-4" />
										Dashboard
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
				{:else}
					<a
						href="/contact"
						class="px-4 py-2 bg-white text-black rounded-lg ml-2 transition-border hover:rounded-4xl"
						rel="noopener noreferrer"
					>
						Contact us
					</a>
				{/if}
			</ul>
		</div>
	</div>
</header>

<div class="flex-1">
	<slot />
</div>

<footer
	class="flex flex-col justify-center gap-7 p-6 text-2xl mt-10 md:items-center lg:justify-between lg:flex-row xl:gap-12 xl:justify-center"
>
	<ul class="flex flex-wrap justify-center gap-6 text-base md:justify-center">
		<FootLink href="/">Home</FootLink>
		<FootLink href="/about">About</FootLink>
		<FootLink href="/contact">Contact Us</FootLink>
		<FootLink href="/developers">Developers</FootLink>
		<FootLink href="/projects">Projects</FootLink>
		<FootLink href="https://ai-camp.org">AI Camp</FootLink>
	</ul>
	<div class="flex justify-center gap-8 lg:flex-row-reverse">
		<div class="flex gap-4 items-center">
			<Logo class="w-8 h-8" />
			<AICamp />
		</div>
		<div class="flex gap-4 items-center">
			<a
				href="https://www.instagram.com/a.i_camp/"
				target="_blank"
				rel="noreferrer noopener"
				title="AI Camp Instagram"
			>
				<Instagram class="w-6 h-6" />
			</a>
			<a
				href="https://www.youtube.com/channel/UCUGJzo5EwViLGpAgYphNyzg"
				target="_blank"
				rel="noreferrer noopener"
				title="AI Camp YouTube"
			>
				<YouTube class="w-8 h-8" />
			</a>
			<a
				href="mailto:hello@ai-camp.org"
				target="_blank"
				rel="noreferrer noopener"
				title="AI Camp Email"
			>
				<Envelope class="w-7 h-7" />
			</a>
		</div>
	</div>
</footer>

{#if burgerOpen}
	<style>
		body {
			overflow: hidden;
		}
	</style>
{/if}
