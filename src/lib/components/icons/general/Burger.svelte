<script lang="ts">
	export let burgerOpen: boolean;
</script>

<svg viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8">
	<path
		d="M0 18.5a.5.5 0 0 1 .5-.5h23a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5H.5a.5.5 0 0 1-.5-.5v-2Z"
		class="origin-center transition-transform"
		style={burgerOpen ? "transform: rotate(-45deg) translateY(-7.5px)" : ""}
	/>
	<path
		d="M0 11a.5.5 0 0 1 .5-.5h23a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5H.5A.5.5 0 0 1 0 13v-2Z"
		class:opacity-0={burgerOpen}
		class="origin-center transition-opacity"
	/>
	<path
		d="M0 3.5A.5.5 0 0 1 .5 3h23a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5H.5a.5.5 0 0 1-.5-.5v-2Z"
		class="origin-center transition-transform"
		style={burgerOpen ? "transform: rotate(45deg) translateY(7.5px)" : ""}
	/>
</svg>
