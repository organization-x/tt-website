<script lang="ts">
	export let burgerOpen: boolean;
</script>

<svg viewBox="0 0 38 25" fill="currentColor" class="w-8 h-8">
	<path
		d="M0 25V21H37.5V25H0Z"
		class="origin-center transition-transform"
		style={burgerOpen ? "transform: rotate(-45deg) translateY(-10px)" : ""}
	/>
	<path
		d="M0 15V11H37.5V15H0Z"
		class:opacity-0={burgerOpen}
		class="origin-center transition-opacity"
	/>
	<path
		d="M0 4.5V0.5H37.5V4.5H0Z"
		class="origin-center transition-transform"
		style={burgerOpen ? "transform: rotate(45deg) translateY(10px)" : ""}
	/>
</svg>
