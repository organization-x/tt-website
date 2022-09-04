<script lang="ts">
	import { onMount } from "svelte/internal";

	let className: string;
	export let title: string;
	export let delay: number;
	export let side = "left";
	export let statName: string;
	export let statAmount: number;
	export let statPostFix: string;

	export { className as class };

	let count = 0;
	let element: HTMLHeadingElement;

	// Easing function for numbers increasing.
	const easing = (x: number): number => {
		return Math.sqrt(1 - Math.pow(x - 1, 2));
	};

	// When the number counter enters the viewport, start the animation of it counting upwards.
	onMount(() => {
		const observer = new IntersectionObserver(
			(e) => {
				if (!e[0].isIntersecting) return;
				for (let i = 0; i <= statAmount; i++) {
					setTimeout(() => {
						count = i;
					}, easing(i / statAmount) * delay);
				}
				observer.disconnect();
			},
			{ threshold: 0.3 }
		);
		observer.observe(element);

		return () => observer.disconnect();
	});
</script>

<div bind:this={element} class="max-w-lg mx-auto">
	<h2 class:text-right={side !== "left"} class="font-semibold mx-2">
		{title.toUpperCase()}
	</h2>
	<div class="bg-gray-500/40 p-4 rounded-xl mt-2">
		<div
			class:before:-left-4={side === "left"}
			class:ml-4={side === "left"}
			class:before:left-auto={side !== "left"}
			class:before:-right-4={side !== "left"}
			class:text-right={side !== "left"}
			class:mr-4={side !== "left"}
			class="relative flex flex-col before:absolute before:inset-0 before:w-1 before:h-full before:rounded-sm {className}"
		>
			<h1 class="font-semibold text-4xl">
				{count}{statPostFix}
			</h1>
			<h4 class="text-2xl">{statName}</h4>
		</div>
		<p class:text-right={side !== "left"} class="mt-4">
			<slot />
		</p>
	</div>
</div>
