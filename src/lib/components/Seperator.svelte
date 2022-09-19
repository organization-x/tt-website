<script lang="ts">
	let className: string | null = null;

	export { className as class };
</script>

<div class="w-full h-0.5 rounded-lg bg-gray-500 {className && className}" />
