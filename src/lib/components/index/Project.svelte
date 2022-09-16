<script lang="ts">
	import Button from "../Button.svelte";
	import ProjectDev from "../ProjectDev.svelte";

	import type { ComponentType } from "svelte/types/runtime/internal/dev.js";

	export let href: string;
	export let title: string;
	export let icons: ComponentType[];
	export let developers: App.Developer[];
</script>

<div class="mt-20 lg:mt-32 lg:flex lg:gap-8 lg:even:flex-row-reverse">
	<div
		class="bg-gray-500/40 p-4 rounded-xl relative mx-auto max-w-lg lg:max-w-2xl lg:w-3/5 lg:h-100"
	>
		<slot name="img" />
		<h1
			class="text-2xl sm:text-2xl md:text-3xl font-semibold text-center mt-10"
		>
			{title}
		</h1>
		<p class="mt-6 text-center lg:text-base">
			<slot />
		</p>
		<Button {href} class="mt-6 mx-auto lg:mt-10">Uncover {title}</Button>
		<div class="flex gap-2 items-center justify-center mt-4 lg:mt-8">
			{#each icons as Icon}
				<Icon class="w-10 h-10" />
			{/each}
		</div>
		<div
			class="bg-gray-800 rounded-lg drop-shadow-lg mt-6 relative mx-auto max-w-md lg:hidden
            before:z-10 before:absolute before:rounded-lg before:top-0 before:left-0 before:w-8 before:h-full before:bg-gradient-to-r before:from-gray-800 before:to-transparent before:pointer-events-none
            
            after:z-10 after:absolute after:rounded-lg after:top-0 after:right-0 after:w-8 after:h-full after:bg-gradient-to-r after:from-transparent after:to-gray-800 after:pointer-events-none"
		>
			<div
				class="flex overflow-auto py-2 px-8 gap-8 snap-x snap-proximity rounded-lg scrollbar-hidden"
			>
				{#each developers as developer}
					<ProjectDev user={developer} />
				{/each}
			</div>
		</div>
	</div>

	<div
		class="hidden bg-gray-500/40 relative rounded-xl h-min lg:flex lg:flex-col lg:shrink-0 lg:w-1/3 lg:h-100
            
            before:z-10 before:absolute before:rounded-t-xl before:top-0 before:w-full before:h-8 before:bg-gradient-to-b before:from-gray-900 before:to-transparent before:pointer-events-none
            
            after:z-10 after:absolute after:rounded-b-xl after:bottom-0 after:w-full after:h-8 after:bg-gradient-to-t after:from-gray-900 after:to-transparent after:pointer-events-none"
	>
		<div class="p-4 flex flex-col gap-1 overflow-auto scrollbar">
			<h1 class="font-semibold mb-2">Developers</h1>
			{#each developers as developer}
				<ProjectDev user={developer} />
			{/each}
		</div>
	</div>
</div>
