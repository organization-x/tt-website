<script lang="ts">
	import { onDestroy } from "svelte";

	import Globe from "$lib/components/icons/general/Globe.svelte";
	import ExternalLink from "$lib/components/icons/general/ExternalLink.svelte";

	import type { Writable } from "svelte/store";

	export let href: string;
	export let active: Writable<boolean>;
	export let set: (value: boolean) => void;

	let url = {
		icon: "",
		title: ""
	};

	// Grab data related to the URL for a preview
	const request = fetch(`/api/project?url=${href}`, {
		method: "PUT"
	})
		.then((res) => res.json())
		.then(
			async ({ icon, title }: App.UrlMetadataResponse) =>
				(url.title = title) &&
				icon &&
				(url.icon = URL.createObjectURL(
					await fetch(icon).then((res) => res.blob())
				))
		);

	onDestroy(() => URL.revokeObjectURL(url.icon));
</script>

<div
	spellcheck="false"
	contenteditable="false"
	class:opacity-0={!$active}
	class:translate-y-1.5={!$active}
	class:pointer-events-none={!$active}
	on:mouseenter={() => set(true)}
	on:mouseleave={() => set(false)}
	class="w-72 bg-gray-900 rounded-lg left-0 p-3.5 flex items-center select-none gap-2.5 z-10 top-full absolute transition-[opacity,transform] duration-100"
>
	{#await request}
		<div class="bg-gray-400 w-5 h-5 rounded-sm animate-pulse my-0.5" />

		<div class="bg-gray-400 w-48 h-5 rounded-full animate-pulse" />
	{:then}
		{#if url.icon.length}
			<img
				width="128"
				height="128"
				src={url.icon}
				loading="lazy"
				alt="Icon for '{url.title}'"
				class="w-5 h-5 shrink-0"
			/>
		{:else}
			<Globe class="w-5 h-5 shrink-0" />
		{/if}

		<h1
			class="font-semibold overflow-auto max-h-12 scrollbar-hidden whitespace-nowrap sm:text-sm"
		>
			{url.title}
		</h1>

		<a
			target="_blank"
			{href}
			rel="noreferrer noopener"
			class="shrink-0 ml-auto pl-0.5"
		>
			<ExternalLink class="w-4 h-4 sm:w-3.5 sm:h-3.5" />
		</a>
	{/await}
</div>
