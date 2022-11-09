<script lang="ts">
	let className: string;
	export let checked = false;

	export { className as class };
</script>

<svg class={className} fill="currentColor" viewBox="0 0 24 24">
	<path
		d="M9.78 17.247a.5.5 0 0 0 .707 0l8.693-8.693a.5.5 0 0 0 0-.708l-1.16-1.16a.5.5 0 0 0-.707 0l-6.826 6.827a.5.5 0 0 1-.707 0L6.687 10.42a.5.5 0 0 0-.707 0l-1.16 1.16a.5.5 0 0 0 0 .707l4.96 4.96Z"
		class="transition-opacity"
		class:opacity-0={!checked}
	/>
	<path
		d="M2.667 24c-.734 0-1.362-.26-1.884-.783A2.57 2.57 0 0 1 0 21.333V2.667C0 1.933.26 1.305.783.783A2.571 2.571 0 0 1 2.667 0h18.666c.734 0 1.362.26 1.884.783.522.522.783 1.15.783 1.884v18.666a2.57 2.57 0 0 1-.783 1.884 2.57 2.57 0 0 1-1.884.783H2.667Zm0-3.167a.5.5 0 0 0 .5.5h17.666a.5.5 0 0 0 .5-.5V3.167a.5.5 0 0 0-.5-.5H3.167a.5.5 0 0 0-.5.5v17.666Z"
	/>
</svg>
