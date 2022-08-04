<script lang="ts">
	let className: string;

	export { className as class };
</script>

<h1
	class="font-extrabold text-2xl text-center bg-clip-text text-transparent bg-gradient-radial {className} mt-6"
>
	<slot />
</h1>
