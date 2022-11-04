<script lang="ts">
	let className: string;
	export let selected = false;

	export { className as class };
</script>

<svg class={className} fill="currentColor" viewBox="0 0 24 24">
	<path
		d="M12 5c-3.859 0-7 3.141-7 7s3.141 7 7 7 7-3.141 7-7-3.141-7-7-7zm0 12c-2.757 0-5-2.243-5-5s2.243-5 5-5 5 2.243 5 5-2.243 5-5 5z"
	/>
	<path
		d="M12 9c-1.627 0-3 1.373-3 3s1.373 3 3 3 3-1.373 3-3-1.373-3-3-3z"
		class="transition-opacity"
		class:opacity-0={!selected}
	/>
</svg>
