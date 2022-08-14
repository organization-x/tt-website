<script lang="ts">
	import "../app.css";

	import Burger from "$lib/components/icons/Burger.svelte";
	import { navigating } from "$app/stores";
	import { slide } from "svelte/transition";

	import Envelope from "$lib/components/icons/Envelope.svelte";
	import Instagram from "$lib/components/icons/Instagram.svelte";
	import YouTube from "$lib/components/icons/YouTube.svelte";

	import Logo from "$lib/components/Logo.svelte";
	import NavLink from "$lib/components/NavLink.svelte";

	let open = false;

	$: if ($navigating) open = false;
</script>

{#if open}
	<style>
		body {
			overflow: hidden;
		}
	</style>
{/if}

<header class="bg-black font-heading">
	<div class="p-4 max-w-screen-lg mx-auto flex justify-between">
		<a href="/" class="z-30">
			<Logo class="w-10 h-10" />
		</a>
		<button
			type="button"
			class="cursor-pointer z-30 relative text-5xl"
			on:click={() => (open = !open)}
		>
			<Burger {open} />
		</button>
		{#if open}
			<nav
				transition:slide
				class="z-20 absolute inset-0 overflow-y-auto bg-black"
			>
				<div class="p-16 pt-24 max-w-screen-lg mx-auto">
					<ul class="text-3xl divide-y">
						<NavLink href="/">Home</NavLink>
						<NavLink href="/about">About</NavLink>
						<NavLink href="/contact">Contact Us</NavLink>
						<NavLink href="/developers">Developers</NavLink>
						<NavLink href="https://ai-camp.org" target="_blank"
							>AI Camp</NavLink
						>
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
							<Instagram class="w-10 h-10" />
						</a>
						<a
							href="https://www.youtube.com/channel/UCUGJzo5EwViLGpAgYphNyzg"
							target="_blank"
							rel="noreferrer noopener"
							title="AI Camp YouTube"
						>
							<YouTube class="w-12 h-12" />
						</a>
						<a
							href="mailto:hello@ai-camp.org"
							target="_blank"
							rel="noreferrer noopener"
							title="AI Camp Email"
						>
							<Envelope class="w-10 h-10" />
						</a>
					</div>
				</div>
			</nav>
		{/if}
	</div>
</header>

<slot />
