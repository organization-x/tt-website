<script lang="ts">
	let className = "";
	export let active = true;

	export { className as class };
</script>

<svg
	class="{className}{active ? '' : ' grayscale'}"
	fill="currentColor"
	viewBox="0 0 24 24"
>
	<path
		d="M14.8366 10.4019L12.003 1.99927L9.1587 10.4019H0L7.41079 15.6037L4.59169 23.9905L12.0025 18.8074L19.4279 24.0093L16.5941 15.5991L24 10.4019H14.8366Z"
		fill="#950BE4"
	/>
	<path
		d="M19.4297 24.0148L19.4258 22.0016L18.5234 21.3688L19.4297 24.0148Z"
		fill="#950BE4"
	/>
	<path
		d="M4.58984 23.9946L4.59375 21.9885L5.47266 21.3723L4.58984 23.9946Z"
		fill="#950BE4"
	/>
	<path d="M24 10.3996V8.40063L21.1602 10.3996H24Z" fill="#950BE4" />
	<path
		d="M0.00390625 10.3996V8.40063L2.84375 10.3996H0.00390625Z"
		fill="#950BE4"
	/>
	<path
		d="M14.8366 8.40264L12.003 0L9.1587 8.40263H0L7.41079 13.6045L4.59169 21.9912L12.0025 16.8081L19.4279 22.01L16.5941 13.5998L24 8.40264H14.8366Z"
		fill="url(#paint0_diamond_1406_32)"
	/>
	<defs>
		<radialGradient
			id="paint0_diamond_1406_32"
			cx="0"
			cy="0"
			r="1"
			gradientUnits="userSpaceOnUse"
			gradientTransform="translate(12 11.005) rotate(53.6222) scale(10.3336 10.6378)"
		>
			<stop stop-color="#950BE4" />
			<stop offset="1" stop-color="#C44AF2" />
		</radialGradient>
	</defs>
</svg>
