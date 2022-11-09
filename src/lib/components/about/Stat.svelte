<script lang="ts">
	import { onMount } from "svelte";
	import { quintIn } from "svelte/easing";

	let className: string;
	export let title: string;
	export let side = "left";
	export let amount: number;
	export let caption: string;
	export let postFix: string;

	export { className as class };

	let count = 0;
	let parent: HTMLHeadingElement;

	const isLeft = side === "left";

	// When the number counter enters the viewport, start the animation of it counting upwards.
	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (!entries[0].isIntersecting) return;

				Array.from({ length: amount }).forEach((_, i) =>
					setTimeout(() => {
						count = i + 1;
					}, quintIn(i / amount) * 2000)
				);

				observer.disconnect();
			},
			{ threshold: 0.3 }
		);

		observer.observe(parent);

		return () => observer.disconnect();
	});
</script>

<div bind:this={parent} class="max-w-lg mx-auto">
	<h2 class:text-right={side !== "left"} class="font-semibold mx-2">
		{title.toUpperCase()}
	</h2>
	<div class="bg-gray-500/40 p-4 rounded-xl mt-2">
		<div
			class:before:-left-4={isLeft}
			class:ml-4={isLeft}
			class:before:left-auto={!isLeft}
			class:before:-right-4={!isLeft}
			class:text-right={!isLeft}
			class:mr-4={!isLeft}
			class="relative flex flex-col before:absolute before:inset-0 before:w-1 before:h-full before:rounded-sm {className}"
		>
			<h1 class="font-semibold text-4xl">
				{count}{postFix}
			</h1>
			<h4 class="text-2xl">{caption}</h4>
		</div>
		<p class:text-right={!isLeft} class="mt-4">
			<slot />
		</p>
	</div>
</div>
