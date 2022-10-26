<script lang="ts">
	let className = "";
	export let hidden: boolean;
	export let disabled: boolean;

	export { className as class };
</script>

<button on:click class="shrink-0 my-auto" {disabled}>
	<svg
		class:opacity-0={hidden}
		class:opacity-50={disabled}
		class:transition-opacity={!hidden}
		class="w-7 h- {className}"
		fill="currentColor"
		viewBox="0 0 24 24"
	>
		<path d="M17 24L5 12L17 0L19.13 2.13L9.26 12L19.13 21.87L17 24Z" />
	</svg>
</button>
