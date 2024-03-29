<script lang="ts">
	import { getContext } from "svelte";
	import { fade } from "svelte/transition";

	import Plus from "$lib/components/icons/general/Plus.svelte";
	import GradientText from "$lib/components/GradientText.svelte";

	export let position: string;
	export let developer: App.Developer;
	export let accomplishments: string[];

	const timestamp = getContext("timestamp") as string;

	let open = false;
</script>

<div
	class="snap-center shrink-0 w-fit lg:w-full lg:flex lg:even:flex-row-reverse lg:items-center lg:gap-14"
>
	<div
		class="bg-gray-500/40 p-10 rounded-xl relative text-center max-w-lg mx-auto lg:mx-0 lg:p-8"
	>
		<div class="lg:flex lg:justify-center lg:gap-8">
			<img
				height="512"
				width="512"
				src="https://imagedelivery.net/XcWbJUZNkBuRbJx1pRJDvA/avatar-{developer.id}/avatar?{timestamp}"
				alt="{developer.name}'s avatar"
				loading="lazy"
				class="rounded-full bg-gray-400 mx-auto w-20 h-20 lg:mx-0"
			/>
			<div>
				<h1 class="font-extrabold mt-3 mb-1 text-sm">
					{position.replaceAll("_", " ").toUpperCase()}
				</h1>

				<GradientText
					class="text-center from-green-light to-green-dark text-xl"
				>
					{developer.name}
				</GradientText>
			</div>
		</div>

		<p class="mt-2 mb-6 max-w-xs lg:mt-6 lg:mb-0">
			{developer.about}
		</p>

		<div
			class:h-full={open}
			class:rounded-t-lg={open}
			class:h-11={!open}
			class="absolute flex bg-gray-700 mx-auto transition-[border-radius,height] left-0 right-0 bottom-0 rounded-b-lg w-full lg:hidden"
		>
			<button
				class="flex gap-2 items-center m-auto mb-2 cursor-pointer w-full justify-center"
				on:click={() => (open = !open)}
			>
				<Plus
					class="w-6 h-6 transition-transform {open
						? 'rotate-45'
						: ''}"
				/>
				<p class="text-center my-auto">Show more</p>
			</button>
		</div>

		{#if open}
			<ul
				transition:fade={{ duration: 100 }}
				class="absolute pb-10 inset-0 left-4 m-auto h-fit w-fit list-disc lg:hidden"
			>
				{#each accomplishments as accomplishment}
					<li>{accomplishment}</li>
				{/each}
			</ul>
		{/if}
	</div>

	<ul class="hidden lg:block lg:mx-auto lg:shrink-0 lg:list-disc">
		{#each accomplishments as accomplishment}
			<li>{accomplishment}</li>
		{/each}
	</ul>
</div>
