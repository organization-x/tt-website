<script>
	import "../app.css";

	import Close from "svelte-material-icons/Close.svelte";
	import Menu from "svelte-material-icons/Menu.svelte";
	import { slide } from "svelte/transition";

	import IconEnvelope from "../components/IconEnvelope.svelte";
	import IconInstagram from "../components/IconInstagram.svelte";
	import IconYouTube from "../components/IconYouTube.svelte";
	import Logo from "../components/Logo.svelte";
	import NavLink from "../components/NavLink.svelte";

	let open = false;
</script>

<header class="bg-black font-heading">
	<div class="px-4 py-2 max-w-screen-lg mx-auto flex justify-between">
		<a href="/" class="z-10">
			<Logo class="w-14 h-14" />
		</a>
		<button
			type="button"
			class="cursor-pointer z-10 relative"
			on:click={() => (open = !open)}
		>
			<!-- TODO: make icon transition -->
			<svelte:component this={open ? Close : Menu} size="2.5em" />
		</button>
		{#if open}
			<nav
				transition:slide
				class="absolute inset-0 overflow-y-auto bg-black"
			>
				<div class="p-16 pt-24 max-w-screen-lg mx-auto">
					<ul class="text-3xl divide-y">
						<NavLink href="https://www.teamtomorrow.us/"
							>Home</NavLink
						>
						<NavLink href="/about">About</NavLink>
						<NavLink href="/contact">Contact Us</NavLink>
						<NavLink href="/developers">Developers</NavLink>
						<NavLink href="https://ai-camp.org">AI Camp</NavLink>
					</ul>
					<div class="mt-8 flex gap-4 text-2xl justify-center">
						<a
							href="https://instagram.com/aicamp1"
							target="_blank"
							rel="noopener noreferrer"
							title="AI Camp Instagram"
						>
							<IconInstagram />
						</a>
						<a
							href="https://www.youtube.com/channel/UCUGJzo5EwViLGpAgYphNyzg"
							target="_blank"
							rel="noopener noreferrer"
							title="AI Camp YouTube"
						>
							<IconYouTube />
						</a>
						<a
							href="mailto:hello@ai-camp.org"
							target="_blank"
							rel="noopener noreferrer"
							title="AI Camp Email"
						>
							<IconEnvelope />
						</a>
					</div>
				</div>
			</nav>
		{/if}
	</div>
</header>

<main class="px-4 max-w-screen-lg mx-auto">
	<slot />
</main>
