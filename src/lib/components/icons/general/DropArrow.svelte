<script lang="ts">
	let className: string;
	export let open: boolean;

	export { className as class };
</script>

<svg
	class:rotate-180={open}
	class="transition-transform {className}"
	fill="currentColor"
	viewBox="0 0 24 24"
>
	<path
		d="M16.293 9.293 12 13.586 7.707 9.293l-1.414 1.414L12 16.414l5.707-5.707z"
	/>
</svg>
