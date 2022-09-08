<script lang="ts">
	let className: string;
	export let direction: string;

	export { className as class };
</script>

<div class="bg-gray-500/40 p-4 mx-4 rounded-lg relative {className}">
	<div
		class="from-transparent to-gray-500 bg-panel w-full h-full absolute inset-0 opacity-30 {direction}"
	/>
	<slot />
</div>
