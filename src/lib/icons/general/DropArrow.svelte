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
		d="M21.38 4.867a.5.5 0 0 0-.707 0l-8.32 8.32a.5.5 0 0 1-.707 0l-8.32-8.32a.5.5 0 0 0-.706 0L.354 7.133a.5.5 0 0 0 0 .707l11.292 11.293a.5.5 0 0 0 .708 0L23.646 7.84a.5.5 0 0 0 0-.707L21.38 4.867Z"
	/>
</svg>
