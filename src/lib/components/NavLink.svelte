<script lang="ts">
	let className = "";
	export let href: string;
	export let active = false;
	export let target: string | null = null;

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
		class:lg:bg-gray-900={active}
		class="hover:bg-gray-900 lg:flex lg:items-center lg:justify-center lg:gap-2 lg:px-3.5 lg:py-3 lg:rounded-lg lg:transition-colors lg:duration-200 {className}"
		rel="noreferrer noopener"
	>
		<slot />
	</a>
</li>
