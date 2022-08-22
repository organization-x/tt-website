<script lang="ts">
	export let isCurrent: boolean;
</script>

<div on:click class="cursor-pointer p-0.5" class:text-white={isCurrent}>
	<svg
		class="w-2 h-2 transition-colors"
		fill="currentColor"
		viewBox="0 0 24 24"
	>
		<circle cx="12" cy="12" r="12" />
	</svg>
</div>
