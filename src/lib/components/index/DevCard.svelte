<script lang="ts">
	import GradientText from "../GradientText.svelte";
	import type { Developer } from "../types";

	export let info: Developer;
</script>

<div
	class="snap-center shrink-0 w-fit xl:flex xl:even:flex-row-reverse xl:items-center xl:gap-14"
>
	<div
		class="bg-gray-500/40 p-10 rounded-xl text-center max-w-lg mx-auto xl:mx-0"
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
		<p class="mt-2 max-w-xs">
			<slot />
		</p>
	</div>

	<ul class="hidden xl:block xl:mx-auto xl:list-disc">
		<li>Worked on 80000 projects.</li>
		<li>Worked on 80000 projects.</li>
		<li>Worked on 80000 projects.</li>
		<li>Worked on 80000 projects.</li>
	</ul>
</div>
