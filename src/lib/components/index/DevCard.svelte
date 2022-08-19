<script lang="ts">
	import type { Developer } from "../../types";

	import GradientText from "../GradientText.svelte";
	import Plus from "../icons/Plus.svelte";
	import { fade } from "svelte/transition";

	export let info: Developer;

	let open = false;
</script>

<div
	class="snap-center shrink-0 w-fit lg:flex lg:even:flex-row-reverse lg:items-center lg:gap-14"
>
	<div
		class="bg-gray-500/40 p-10 rounded-xl relative text-center max-w-lg mx-auto lg:mx-0 lg:p-8"
	>
		<div class="lg:flex lg:justify-center lg:gap-8">
			<img
				height="200"
				width="200"
				src={info.src}
				alt={info.alt}
				loading="lazy"
				class="rounded-full mx-auto w-20 h-20 xl:mx-0"
			/>
			<div>
				<h4 class="font-extrabold mt-2">
					{info.role.toUpperCase()}
				</h4>
				<GradientText
					class="text-center from-green-light to-green-dark text-xl"
				>
					{info.name}
				</GradientText>
			</div>
		</div>
		<p class="mt-2 mb-6 max-w-xs lg:mt-6 lg:mb-0">
			<slot />
		</p>
		<div
			class:h-full={open}
			class:rounded-t-lg={open}
			class:h-11={!open}
			class="absolute flex bg-gray-700 mx-auto transition-bright left-0 right-0 bottom-0 rounded-b-lg w-full lg:hidden"
		>
			<div
				class="flex gap-2 items-center m-auto mb-2 cursor-pointer"
				on:click={() => (open = !open)}
			>
				<Plus
					class="w-6 h-6 transition-transform {open
						? 'rotate-45'
						: ''}"
				/>
				<p class="text-center my-auto">Show more</p>
			</div>
		</div>
		{#if open}
			<ul
				transition:fade={{ duration: 100 }}
				class="absolute pb-10 inset-0 left-4 m-auto h-fit w-fit list-disc lg:hidden"
			>
				<li>Worked on 80000 projects.</li>
				<li>Worked on 80000 projects.</li>
				<li>Worked on 80000 projects.</li>
				<li>Worked on 80000 projects.</li>
			</ul>
		{/if}
	</div>

	<ul class="hidden lg:block lg:mx-auto lg:shrink-0 lg:list-disc">
		<li>Worked on 80000 projects.</li>
		<li>Worked on 80000 projects.</li>
		<li>Worked on 80000 projects.</li>
		<li>Worked on 80000 projects.</li>
	</ul>
</div>
