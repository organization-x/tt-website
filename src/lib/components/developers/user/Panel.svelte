<script lang="ts">
	let className: string;

	export { className as class };
</script>

<div class="bg-gray-500/40 p-4 rounded-lg relative isolate {className}">
	<div
		class="pointer-events-none w-full h-full absolute inset-0 opacity-30 -z-10"
	/>
	<slot />
</div>
