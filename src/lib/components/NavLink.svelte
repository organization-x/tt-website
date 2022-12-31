<script lang="ts">
	import { getContext, onMount } from "svelte";

	import type { Writable } from "svelte/store";

	let className = "";
	export let href: string;
	export let active = false;
	export let target: string | null = null;
	export let burgerOpen: boolean | null = null;

	export { className as class };

	const tabindex = getContext<Writable<number>>("tabindex");

	let i: number;
	let delay = 30;
	let element: HTMLLIElement;

	// Calculate the transition delay based off whether the burger menu is opening or
	// closing, when closing the top element is last while opening the last element is last
	$: if (element && i)
		delay = burgerOpen
			? i * 30
			: (element.parentNode!.children.length + 1 - i) * 30;

	// Get index of link in the burger menu
	onMount(
		() =>
			(i =
				Array.prototype.indexOf.call(
					element.parentNode!.children,
					element
				) + 1)
	);
</script>

<li
	bind:this={element}
	class:marker:text-white={active}
	class:marker:text-black={!active}
	class="px-4 py-3 lg:p-0 marker:transition-colors transition-transpacity duration-200 marker:duration-200"
	style="transition-delay: {delay}ms"
>
	<a
		{href}
		{target}
		class:lg:bg-gray-900={active}
		class="hover:bg-gray-900 lg:flex lg:items-center lg:justify-center lg:gap-2 lg:px-3.5 lg:py-3 lg:rounded-lg lg:transition-colors lg:duration-200 {className}"
		tabindex={$tabindex === 0 && burgerOpen !== null ? -1 : 0}
		rel="noreferrer noopener"
	>
		<slot />
	</a>
</li>
