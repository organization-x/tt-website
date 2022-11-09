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
		class="w-5 h-5 {className}"
		fill="currentColor"
		viewBox="0 0 24 24"
	>
		<path
			d="M17.354 23.646a.5.5 0 0 1-.708 0L5.354 12.354a.5.5 0 0 1 0-.708L16.646.354a.5.5 0 0 1 .708 0l1.422 1.422a.5.5 0 0 1 0 .708l-9.162 9.162a.5.5 0 0 0 0 .708l9.162 9.162a.5.5 0 0 1 0 .708l-1.422 1.422Z"
		/>
	</svg>
</button>
