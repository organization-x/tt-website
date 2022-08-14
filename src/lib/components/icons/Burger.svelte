<script lang="ts">
	export let open: boolean;
</script>

<svg viewBox="0 0 38 25" fill="currentColor" class="w-8 h-8">
	<path
		d="M0 25V21H37.5V25H0Z"
		class="origin-center transition-transform"
		style={open ? "transform: rotate(-45deg) translateY(-10px)" : ""}
	/>
	<path
		d="M0 15V11H37.5V15H0Z"
		class="origin-center transition-opacity {open ? 'opacity-0' : ''}"
	/>
	<path
		d="M0 4.5V0.5H37.5V4.5H0Z"
		class="origin-center transition-transform"
		style={open ? "transform: rotate(45deg) translateY(10px)" : ""}
	/>
</svg>
