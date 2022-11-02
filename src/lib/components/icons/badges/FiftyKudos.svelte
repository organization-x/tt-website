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
	<path d="M8.57136 22.2857L10.2856 24V22.2857H8.57136Z" fill="#07A7CB" />
	<rect
		x="10.2856"
		y="15.4286"
		width="5.14286"
		height="8.57143"
		fill="#07A7CB"
	/>
	<path
		d="M23.9999 10.2857L22.2856 8.57141V10.2857H23.9999Z"
		fill="#07A7CB"
	/>
	<rect
		x="1.71436"
		y="15.4286"
		width="5.14286"
		height="22.2857"
		transform="rotate(-90 1.71436 15.4286)"
		fill="#07A7CB"
	/>
	<path
		d="M6.97374e-05 13.7143L1.71436 15.4286L1.71436 13.7143H6.97374e-05Z"
		fill="#07A7CB"
	/>
	<rect
		x="10.2856"
		y="1.71423"
		width="5.14286"
		height="8.57143"
		fill="#07A7CB"
	/>
	<path d="M15.4286 1.71429L13.7144 0V1.71429H15.4286Z" fill="#07A7CB" />
	<rect
		x="8.57129"
		y="13.7142"
		width="5.14286"
		height="8.57143"
		fill="url(#paint0_linear_1394_328)"
	/>
	<rect
		y="13.7142"
		width="5.14286"
		height="22.2857"
		transform="rotate(-90 0 13.7142)"
		fill="url(#paint1_linear_1394_328)"
	/>
	<rect
		x="8.57129"
		width="5.14286"
		height="8.57143"
		fill="url(#paint2_linear_1394_328)"
	/>
	<defs>
		<linearGradient
			id="paint0_linear_1394_328"
			x1="11.1427"
			y1="13.7142"
			x2="11.1427"
			y2="22.2857"
			gradientUnits="userSpaceOnUse"
		>
			<stop stop-color="#079B6F" />
			<stop offset="0.0001" stop-color="#07A7CB" />
			<stop offset="0.682292" stop-color="#12F1FF" />
		</linearGradient>
		<linearGradient
			id="paint1_linear_1394_328"
			x1="2.71423"
			y1="13.7142"
			x2="2.57143"
			y2="35.9999"
			gradientUnits="userSpaceOnUse"
		>
			<stop offset="0.109375" stop-color="#12F1FF" />
			<stop offset="0.505208" stop-color="#07A7CB" />
			<stop offset="0.932292" stop-color="#12F1FF" />
		</linearGradient>
		<linearGradient
			id="paint2_linear_1394_328"
			x1="11.1427"
			y1="0"
			x2="11.1427"
			y2="8.57143"
			gradientUnits="userSpaceOnUse"
		>
			<stop offset="0.296875" stop-color="#12F1FF" />
			<stop offset="1" stop-color="#07A7CB" />
		</linearGradient>
	</defs>
</svg>
