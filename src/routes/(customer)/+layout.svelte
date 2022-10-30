<script lang="ts">
	import "../../app.css";

	import { derived } from "svelte/store";
	import { slide } from "svelte/transition";

	import { page } from "$app/stores";
	import { afterNavigate } from "$app/navigation";
	import AICamp from "$lib/components/AICamp.svelte";
	import Logo from "$lib/components/icons/Logo.svelte";
	import NavLink from "$lib/components/NavLink.svelte";
	import FootLink from "$lib/components/FootLink.svelte";
	import Burger from "$lib/components/icons/Burger.svelte";
	import YouTube from "$lib/components/icons/YouTube.svelte";
	import Envelope from "$lib/components/icons/Envelope.svelte";
	import Instagram from "$lib/components/icons/Instagram.svelte";

	import type { LayoutServerData } from "./$types";

	export let data: LayoutServerData;

	let open = false;
	let pageId = derived(
		page,
		($page) => $page.routeId?.split("/")[1] || "home"
	);

	afterNavigate(async () => {
		open = false;

		if (!data.track) return;

		// Dynamically import analytics to prevent errors when the client blocks it
		import("$lib/analytics")
			.then(async ({ analytics }) => await analytics.page())
			.catch(() => {}); // Ignore errors
	});
</script>

<header class="bg-black">
	<div
		class="p-4 mx-auto max-w-screen-2xl flex justify-between lg:items-center lg:px-6 xl:px-10"
	>
		<a href="/" class="z-50" aria-label="Home" rel="noopener noreferrer">
			<Logo class="w-10 h-10" />
		</a>
		<div class="lg:hidden flex items-center">
			<button
				type="button"
				aria-label="Menu"
				class="z-50 relative hover:text-teal-light duration-500"
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
						<ul
							class="text-3xl divide-y max-w-md mx-auto list-disc lg:list-none"
						>
							<NavLink
								href="/"
								active={$pageId === "home"}
								class="hover:text-teal-light duration-300"
							>
								Home
							</NavLink>
							<NavLink
								href="/about"
								active={$pageId === "about"}
								class="hover:text-teal-light duration-300"
							>
								About
							</NavLink>
							<NavLink
								href="/developers"
								active={$pageId === "developers"}
								class="hover:text-teal-light duration-300"
							>
								Developers
							</NavLink>
							<NavLink
								href="/projects"
								active={$pageId === "projects"}
								class="hover:text-teal-light duration-300"
							>
								Projects
							</NavLink>
							<NavLink
								href="https://ai-camp.org"
								target="_blank"
								class="hover:text-teal-light duration-300"
							>
								AI Camp
							</NavLink>
							<NavLink
								href="/contact"
								active={$pageId === "contact"}
								class="hover:text-teal-light duration-300"
							>
								Contact Us
							</NavLink>
						</ul>
						<div
							class="mt-8 flex gap-4 text-4xl justify-center items-center"
						>
							<a
								href="https://instagram.com/aicamp1"
								target="_blank"
								rel="noreferrer noopener"
								title="AI Camp Instagram"
							>
								<Instagram
									class="w-10 h-10 hover:text-teal-light duration-300"
								/>
							</a>
							<a
								href="https://www.youtube.com/channel/UCUGJzo5EwViLGpAgYphNyzg"
								target="_blank"
								rel="noreferrer noopener"
								title="AI Camp YouTube"
							>
								<YouTube
									class="w-12 h-12 hover:text-teal-light duration-300"
								/>
							</a>
							<a
								href="mailto:hello@ai-camp.org"
								target="_blank"
								rel="noreferrer noopener"
								title="AI Camp Email"
							>
								<Envelope
									class="w-10 h-10 hover:text-teal-light duration-300"
								/>
							</a>
						</div>
					</div>
				</nav>
			{/if}
		</div>
		<div class="hidden lg:block">
			<ul class="flex gap-2 items-center">
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
				<a
					href="/contact"
					class="px-4 py-1 bg-white text-black rounded-3xl transition-border hover:rounded-md"
					rel="noopener noreferrer"
				>
					Contact us
				</a>
			</ul>
		</div>
	</div>
</header>

<slot />

<footer
	class="flex flex-col justify-center gap-7 p-6 text-2xl mt-10 md:items-center lg:justify-between lg:flex-row xl:gap-12 xl:justify-center"
>
	<ul class="flex flex-wrap gap-6 text-base md:justify-center">
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
			<AICamp class="w-8 h-8" />
		</div>
		<div class="flex gap-4 items-center">
			<a
				href="https://instagram.com/aicamp1"
				target="_blank"
				rel="noreferrer noopener"
				title="AI Camp Instagram"
			>
				<Instagram class="w-8 h-8" />
			</a>
			<a
				href="https://www.youtube.com/channel/UCUGJzo5EwViLGpAgYphNyzg"
				target="_blank"
				rel="noreferrer noopener"
				title="AI Camp YouTube"
			>
				<YouTube class="w-10 h-10" />
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
</footer>

{#if open}
	<style>
		body {
			overflow: hidden;
		}
	</style>
{/if}
