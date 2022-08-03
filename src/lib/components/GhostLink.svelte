<script lang="ts">
	export let href: string;
	export let target: string;
</script>

<a
	on:click
	{href}
	{target}
	rel={target ? "noopener noreferrer" : undefined}
	class="border-2 border-white px-4 py-1 rounded-full hover:bg-white hover:text-gray-800 transition-colors"
>
	<slot />
</a>
