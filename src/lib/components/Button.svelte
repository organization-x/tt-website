<script lang="ts">
	let className = "";
	export let href: string;

	export { className as class };
</script>

<a
	on:click
	{href}
	class="block mx-auto text-lg bg-white text-black px-6 py-2 rounded-lg text-center w-fit transition-border hover:rounded-4xl {className}"
	rel="noopener noreferrer"
>
	<slot />
</a>
