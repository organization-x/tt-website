<script lang="ts">
	let className = "";
	export let href: string;

	export { className as class };
</script>

<a
	{href}
	class="block select-none mx-auto border border-solid border-white px-6 py-1 rounded-3xl w-fit transition-border hover:rounded-md {className}"
>
	<slot />
</a>
