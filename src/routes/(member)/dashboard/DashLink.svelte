<script lang="ts">
	import { getContext } from "svelte";

	import type { Writable } from "svelte/store";

	export let href = "";
	let className: string;
	export let icon = false;
	export let target = "_self";

	export { className as class };

	const tabindex = getContext<Writable<number>>("tabindex");
</script>

<a
	{href}
	{target}
	class:py-5={!icon}
	class:lg:px-6={!icon}
	class:py-4={icon}
	class:lg:px-3.5={icon}
	class:lg:py-3.5={icon}
	rel="noreferrer noopener"
	class="block text-center px-4 rounded-lg shrink-0 transition-backpacity duration-200 {className}"
	tabindex={$tabindex}
>
	<slot />
</a>
