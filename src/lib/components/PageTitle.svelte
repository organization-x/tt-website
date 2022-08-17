<script lang="ts">
	let className: string;

	export { className as class };
</script>

<h1
	class="font-extrabold text-2xl sm:text-3xl text-center bg-clip-text text-transparent bg-gradient-radial max-w-sm mx-auto mt-6 lg:mt-0 lg:text-left lg:mx-0 lg:max-w-xs lg:text-4xl xl:text-5xl xl:max-w-md {className}"
>
	<slot />
</h1>
