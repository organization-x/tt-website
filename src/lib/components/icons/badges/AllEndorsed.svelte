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
		d="M14.8366 10.3988L12.003 2L9.1587 10.3988H0L7.41079 15.5983L4.59169 23.9812L12.0025 18.8005L19.4279 24L16.5941 15.5936L24 10.3988H14.8366Z"
		fill="#950BE4"
	/>
	<path d="M19.4282 22V24L18.5391 21.3672L19.4282 22Z" fill="#950BE4" />
	<path
		d="M4.59375 21.9766V23.9766L5.48828 21.3555L4.59375 21.9766Z"
		fill="#950BE4"
	/>
	<path
		d="M24 10.3993L23.9961 8.39844L21.1416 10.4023L24 10.3993Z"
		fill="#950BE4"
	/>
	<path
		d="M0 10.3993L0.00390625 8.39844L2.85842 10.4023L0 10.3993Z"
		fill="#950BE4"
	/>
	<path
		d="M14.8366 8.39882L12.003 0L9.1587 8.39881H0L7.41079 13.5983L4.59169 21.9812L12.0025 16.8005L19.4279 22L16.5941 13.5936L24 8.39882H14.8366Z"
		fill="url(#paint0_diamond_1406_32)"
	/>
	<defs>
		<radialGradient
			id="paint0_diamond_1406_32"
			cx="0"
			cy="0"
			r="1"
			gradientUnits="userSpaceOnUse"
			gradientTransform="translate(12 11) rotate(53.6098) scale(10.3306 10.6361)"
		>
			<stop stop-color="#950BE4" />
			<stop offset="1" stop-color="#C44AF2" />
		</radialGradient>
	</defs>
</svg>
