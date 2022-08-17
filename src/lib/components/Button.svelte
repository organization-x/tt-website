<script lang="ts">
	export let href: string;
	let className: string | undefined = undefined;

	export { className as class };
</script>

<a
	{href}
	class="block border border-solid border-white px-6 py-1 rounded-3xl w-fit transition-border-radius hover:rounded-md {className}"
>
	<slot />
</a>
