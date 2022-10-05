<script lang="ts">
	export let href = "";
	let className: string;
	export let icon = false;

	export { className as class };
</script>

<a
	{href}
	class:p-4={!icon}
	class:p-3={icon}
	rel="noreferrer noopener"
	class="block text-center rounded-lg shrink-0 transition-[background-color,opacity] duration-200 {className}"
>
	<slot />
</a>
