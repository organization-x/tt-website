<script lang="ts">
	let className: string;

	export { className as class };
</script>

<h1
	class="bg-clip-text text-transparent bg-gradient-to-r {className} inline-block font-semibold"
>
	<slot />
</h1>
