<script lang="ts">
	import GradientText from "../GradientText.svelte";
	import Plus from "../icons/Plus.svelte";
	import { slide } from "svelte/transition";

	import type { Developer } from "../types";

	export let info: Developer;

	let open = false;
</script>

<div
	class="snap-center shrink-0 w-fit xl:flex xl:even:flex-row-reverse xl:items-center xl:gap-14"
>
	<div
		class="bg-gray-500/40 p-10 rounded-xl relative text-center max-w-lg mx-auto xl:mx-0"
	>
		<div class="xl:flex xl:justify-center xl:gap-8">
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
		<p class="my-3 max-w-xs">
			<slot />
		</p>
		<div
			class="absolute flex items-center justify-center bg-gray-700 mx-auto left-0 right-0 bottom-0 rounded-b-lg h-10 w-full
                lg:hidden"
		>
			<div class="flex gap-2" on:click={() => (open = !open)}>
				<Plus class="w-6 h-6" />
				<p class="text-center my-auto">Show more</p>
			</div>
		</div>
		<!-- Slide in from top etc -->
		{#if open}
			<div
				transition:slide
				class="bg-gray-700 absolute inset-0 h-full m-auto rounded-lg flex justify-center items-center"
			>
				<ul class="list-disc">
					<li>Worked on 80000 projects.</li>
					<li>Worked on 80000 projects.</li>
					<li>Worked on 80000 projects.</li>
					<li>Worked on 80000 projects.</li>
				</ul>
			</div>
		{/if}
	</div>

	<ul class="hidden xl:block xl:mx-auto xl:list-disc">
		<li>Worked on 80000 projects.</li>
		<li>Worked on 80000 projects.</li>
		<li>Worked on 80000 projects.</li>
		<li>Worked on 80000 projects.</li>
	</ul>
</div>
