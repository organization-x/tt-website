<script lang="ts">
	let className: string;

	export { className as class };
</script>

<h1
	class="bg-clip-text text-transparent bg-gradient-to-r w-full break-words inline-block font-semibold xl:leading-normal {className}"
>
	<slot />
</h1>
