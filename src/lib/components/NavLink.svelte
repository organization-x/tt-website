<script lang="ts">
	export let href: string;
	export let active = false;
	export let target: string | null = null;
	let className = "";

	export { className as class };
</script>

<li
	class:marker:text-black={!active}
	class:marker:text-white={active}
	class="px-4 py-3 lg:p-0 marker:transition-colors marker:duration-200"
>
	<a
		{href}
		{target}
		class="lg:flex lg:items-center lg:gap-2 lg:px-4 lg:py-3 lg:rounded-lg lg:transition-colors lg:duration-200 lg:hover:bg-gray-500/40 {className} {active
			? ' lg:bg-gray-500/40'
			: ''}"
		rel="noreferrer noopener"
	>
		<slot />
	</a>
</li>
