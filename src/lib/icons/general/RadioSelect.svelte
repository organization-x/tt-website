<script lang="ts">
	let className: string;
	export let selected = false;

	export { className as class };
</script>

<svg class={className} fill="currentColor" viewBox="0 0 24 24">
	<path
		d="M12 0C5.385 0 0 5.383 0 12c0 6.615 5.385 12 12 12 6.616 0 12-5.385 12-12 0-6.616-5.384-12-12-12Zm0 20.571c-4.726 0-8.571-3.845-8.571-8.571 0-4.727 3.845-8.572 8.571-8.572 4.727 0 8.572 3.845 8.572 8.572 0 4.726-3.845 8.571-8.572 8.571Z"
	/>
	<path
		d="M12 6.857C9.211 6.857 6.857 9.21 6.857 12c0 2.789 2.354 5.143 5.143 5.143 2.79 0 5.143-2.354 5.143-5.143 0-2.79-2.353-5.143-5.143-5.143Z"
		class="transition-opacity"
		class:opacity-0={!selected}
	/>
</svg>
