<script lang="ts">
	let className = "";
	export let href: string;

	export { className as class };
</script>

<a
	on:click
	{href}
	class="block mx-auto border text-xl md:text-base md:leading-7 border-solid border-white px-6 py-1 rounded-3xl w-fit transition-border hover:rounded-md {className}"
	rel="noopener noreferrer"
>
	<slot />
</a>
