<script lang="ts">
	import "../../app.css";

	import { quadOut } from "svelte/easing";
	import { tweened } from "svelte/motion";
	import { onMount, setContext } from "svelte";
	import { derived, writable } from "svelte/store";

	import { page } from "$app/stores";
	import AICamp from "./AICamp.svelte";
	import FootLink from "./FootLink.svelte";
	import { developers } from "$lib/stores";
	import { afterNavigate } from "$app/navigation";
	import Logo from "$lib/icons/logos/Logo.svelte";
	import NavLink from "$lib/components/NavLink.svelte";
	import Burger from "$lib/icons/general/Burger.svelte";
	import YouTube from "$lib/icons/logos/YouTube.svelte";
	import LogOut from "$lib/icons/general/LogOut.svelte";
	import Envelope from "$lib/icons/general/Envelope.svelte";
	import { PUBLIC_CLOUDFLARE_URL } from "$env/static/public";
	import DropArrow from "$lib/icons/general/DropArrow.svelte";
	import Instagram from "$lib/icons/general/Instagram.svelte";
	import ExternalLink from "$lib/icons/general/ExternalLink.svelte";

	import type { LayoutServerData } from "./$types";

	export let data: LayoutServerData;

	// Get first name of user for overflow prevention
	const firstName = data.user && data.user.name.split(/\s+/g)[0];

	let userOpen = false;
	let burgerOpen = false;
	let dropdown: HTMLDivElement;
	let burgerParent: HTMLUListElement;
	let pageId = derived(
		page,
		($page) => $page.route.id?.split("/")[2] || "home"
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

	// Create a tabindex context so that focusing can be disabled properly when
	// the burger menu is open
	const tabindex = writable(0);
	setContext("tabindex", tabindex);

	// Burger menu opening animation
	const height = tweened(0, { duration: 400, easing: quadOut });

	$: if (burgerOpen) {
		height.set(100);
		tabindex.set(-1);

		// Animate the burger menu items
		if (burgerParent)
			for (const child of burgerParent.children) {
				child.classList.remove("translate-y-6", "opacity-0");
			}
	} else {
		height.set(0);
		tabindex.set(0);

		// Animate the burger menu items
		if (burgerParent)
			for (const child of burgerParent.children) {
				child.classList.add("translate-y-6", "opacity-0");
			}
	}

	onMount(() => {
		// Load the developers from localstorage if they exist
		developers.set(JSON.parse(localStorage.getItem("developers") || "[]"));

		// Persist the saved developers to localstorage
		developers.subscribe((developers) =>
			localStorage.setItem("developers", JSON.stringify(developers))
		);
	});
</script>

<svelte:window
	on:click={windowClick}
	on:resize={() =>
		window.innerWidth >= 1024 && burgerOpen && (burgerOpen = false)}
/>

<svelte:head>
	<!-- When on a user or project page don't override the custom user head data -->
	{#if !$page.route.id?.includes("[")}
		<meta
			name="description"
			content="Team Tomorrow brings developers to companies in need of a robust workforce. Experience rapid deployment, industry-leading skills, and teams that bring your product forward. Procure an incredible team through various profiles and beat your deadline."
		/>

		<!-- OpenGraph data with Team Tomorrow info -->
		<meta property="og:title" content="Team Tomorrow" />
		<meta
			property="og:description"
			content="Team Tomorrow brings developers to companies in need of a robust workforce. Experience rapid deployment, industry-leading skills, and teams that bring your product forward. Procure an incredible team through various profiles and beat your deadline."
		/>
		<meta name="og:image" content="/assets/favicon.png" />
		<meta name="og:image:secure_url" content="/assets/favicon.png" />
		<meta name="og:image:width" content="200" />
		<meta name="og:image:height" content="200" />
		<meta name="og:image:alt" content="Team Tomorrow logo" />

		<!-- Twitter card data with Team Tomorrow info -->
		<meta property="twitter:title" content="Team Tomorrow" />
		<meta
			property="twitter:description"
			content="Team Tomorrow brings developers to companies in need of a robust workforce. Experience rapid deployment, industry-leading skills, and teams that bring your product forward. Procure an incredible team through various profiles and beat your deadline."
		/>
		<meta name="twitter:card" content="summary" />
		<meta name="twitter:image" content="/assets/favicon.png" />
	{/if}
</svelte:head>

<header class="bg-black">
	<div
		class="p-4 mx-auto max-w-screen-2xl flex justify-between lg:items-center lg:gap-4 lg:px-6 xl:px-10"
	>
		<a href="/" class="z-50" rel="noopener noreferrer">
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

			<nav
				aria-expanded={burgerOpen}
				class:overflow-auto={$height === 100}
				class:overflow-hidden={$height !== 100}
				class="z-40 absolute inset-0 top-18 bg-black"
				style="height: {$height}%"
			>
				<div
					class="p-14 pt-24 max-w-screen-lg mx-auto"
					aria-hidden={!burgerOpen}
				>
					{#if data.user}
						<div
							class:opacity-0={!burgerOpen}
							class:translate-y-7={!burgerOpen}
							class:delay-[240ms]={!burgerOpen}
							class="flex gap-3 items-center transition-transpacity duration-200 w-fit z-50 mx-auto"
						>
							<img
								width="512"
								height="512"
								src="{PUBLIC_CLOUDFLARE_URL}/avatar-{data.user
									.id}/avatar?{new Date().getTime()}"
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
						bind:this={burgerParent}
						class:mt-4={data.user}
						class="text-3xl divide-y max-w-md mx-auto list-disc lg:list-none"
					>
						<NavLink
							href="/"
							active={$pageId === "home"}
							{burgerOpen}
						>
							Home
						</NavLink>

						<NavLink
							href="/about"
							active={$pageId === "about"}
							{burgerOpen}
						>
							About
						</NavLink>

						<NavLink
							href="/developers"
							active={$pageId === "developers"}
							{burgerOpen}
						>
							Developers
						</NavLink>

						<NavLink
							href="/projects"
							active={$pageId === "projects"}
							{burgerOpen}
						>
							Projects
						</NavLink>

						<NavLink
							href="https://ai-camp.org"
							target="_blank"
							{burgerOpen}
						>
							AI Camp
						</NavLink>

						{#if data.user}
							<NavLink href="/dashboard" {burgerOpen}>
								Dashboard
							</NavLink>

							<NavLink href="/logout" {burgerOpen}>
								Log Out
							</NavLink>
						{:else}
							<NavLink
								href="/contact"
								active={$pageId === "contact"}
								{burgerOpen}
							>
								Contact Us
							</NavLink>
						{/if}
					</ul>

					<div
						class:opacity-0={!burgerOpen}
						class:translate-y-7={!burgerOpen}
						class:delay-[240ms]={burgerOpen && data.user}
						class:delay-[210ms]={burgerOpen && !data.user}
						class="mt-8 flex gap-6 text-4xl justify-center transition-transpacity duration-200 items-center"
					>
						<a
							href="https://instagram.com/aicamp1"
							target="_blank"
							rel="noreferrer noopener"
							tabindex={burgerOpen ? 0 : -1}
							title="AI Camp Instagram"
						>
							<Instagram class="w-7 h-7" />
						</a>

						<a
							href="https://www.youtube.com/channel/UCUGJzo5EwViLGpAgYphNyzg"
							target="_blank"
							rel="noreferrer noopener"
							tabindex={burgerOpen ? 0 : -1}
							title="AI Camp YouTube"
						>
							<YouTube class="w-9 h-9" />
						</a>

						<a
							href="mailto:hello@ai-camp.org"
							target="_blank"
							rel="noreferrer noopener"
							tabindex={burgerOpen ? 0 : -1}
							title="AI Camp Email"
						>
							<Envelope class="w-8 h-8" />
						</a>
					</div>
				</div>
			</nav>
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
					<div bind:this={dropdown} class="relative ml-2">
						<button
							class:bg-gray-900={userOpen}
							class:rounded-lg={!userOpen}
							class:rounded-t-lg={userOpen}
							class:duration-200={!disableTransition}
							class:transition-colors={!disableTransition}
							class="flex gap-3 items-center justify-center min-w-40 p-3 w-full hover:bg-gray-900"
							on:transitionend={() => (disableTransition = false)}
							on:click={() => (userOpen = !userOpen)}
						>
							<img
								width="512"
								height="512"
								src="{PUBLIC_CLOUDFLARE_URL}/avatar-{data.user
									.id}/avatar?{new Date().getTime()}"
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

<div aria-hidden={burgerOpen} class="flex-1">
	<slot />
</div>

<footer
	aria-hidden={burgerOpen}
	class="flex flex-col justify-center gap-7 p-6 text-2xl mt-10 md:items-center lg:justify-between lg:flex-row xl:gap-12 xl:justify-center"
>
	<ul
		class="flex flex-wrap justify-center gap-6 text-base sm:max-w-sm sm:max-md:mx-auto md:max-w-none md:justify-center"
	>
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
				tabindex={$tabindex}
			>
				<Instagram class="w-6 h-6" />
			</a>
			<a
				href="https://www.youtube.com/channel/UCUGJzo5EwViLGpAgYphNyzg"
				target="_blank"
				rel="noreferrer noopener"
				title="AI Camp YouTube"
				tabindex={$tabindex}
			>
				<YouTube class="w-8 h-8" />
			</a>
			<a
				href="mailto:hello@ai-camp.org"
				target="_blank"
				rel="noreferrer noopener"
				title="AI Camp Email"
				tabindex={$tabindex}
			>
				<Envelope class="w-7 h-7" />
			</a>
		</div>
	</div>
</footer>

{#if burgerOpen}
	<style>
		body {
			@apply max-lg:overflow-hidden;
		}
	</style>
{/if}
