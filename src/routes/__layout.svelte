<script lang="ts">
	import "../app.css";

	import Burger from "$lib/components/icons/Burger.svelte";
	import { slide } from "svelte/transition";
	import { onMount } from "svelte";

	import Envelope from "$lib/components/icons/Envelope.svelte";
	import Instagram from "$lib/components/icons/Instagram.svelte";
	import YouTube from "$lib/components/icons/YouTube.svelte";

	import Logo from "$lib/components/Logo.svelte";
	import NavLink from "$lib/components/NavLink.svelte";

	let open = false;
</script>

<!-- weird spams empty style tags in header -->
<!-- {#if open}
	<style>
		body {
			overflow: hidden;
		}
	</style>
{/if} -->

<header class="bg-black font-heading">
	<div class="px-4 py-2 max-w-screen-lg mx-auto flex justify-between">
		<a href="/" class="z-30">
			<Logo class="w-14 h-14" />
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
						<NavLink href="https://www.teamtomorrow.us/"
							>Home</NavLink
						>
						<NavLink href="/about">About</NavLink>
						<NavLink href="/contact">Contact Us</NavLink>
						<NavLink href="/developers">Developers</NavLink>
						<NavLink href="https://ai-camp.org">AI Camp</NavLink>
					</ul>
					<div class="mt-8 flex gap-4 text-4xl justify-center">
						<a
							href="https://instagram.com/aicamp1"
							target="_blank"
							rel="noopener noreferrer"
							title="AI Camp Instagram"
						>
							<Instagram />
						</a>
						<a
							href="https://www.youtube.com/channel/UCUGJzo5EwViLGpAgYphNyzg"
							target="_blank"
							rel="noopener noreferrer"
							title="AI Camp YouTube"
						>
							<YouTube />
						</a>
						<a
							href="mailto:hello@ai-camp.org"
							target="_blank"
							rel="noopener noreferrer"
							title="AI Camp Email"
						>
							<Envelope />
						</a>
					</div>
				</div>
			</nav>
		{/if}
	</div>
</header>

<slot />

<style>
</style>
