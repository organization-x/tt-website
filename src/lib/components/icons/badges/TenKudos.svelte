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
		d="M9.27708 22.3204L0 13.0433L4.62486 8.39111L9.27708 13.0433L19.293 3L24 7.59749L9.27708 22.3204Z"
		fill="#C61111"
	/>
	<path
		d="M23.9993 7.60049L23.9995 5.59167L22.9825 6.60356L23.9993 7.60049Z"
		fill="#C61111"
	/>
	<path d="M0 13.0469V11.043L1.00391 12.043L0 13.0469Z" fill="#C61111" />
	<path
		d="M9.27708 20.3204L0 11.0433L4.62486 6.39111L9.27708 11.0433L19.293 1L24 5.59749L9.27708 20.3204Z"
		fill="url(#paint0_radial_1439_30)"
	/>
	<defs>
		<radialGradient
			id="paint0_radial_1439_30"
			cx="0"
			cy="0"
			r="1"
			gradientUnits="userSpaceOnUse"
			gradientTransform="translate(12 10.6602) rotate(90) scale(9.66021 12)"
		>
			<stop offset="0.0625" stop-color="#C61111" />
			<stop offset="1" stop-color="#F83737" />
		</radialGradient>
	</defs>
</svg>
