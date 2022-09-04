<script lang="ts">
	let className: string;
	export let src: string;
	export let alt: string;
	export let width: number;
	export let height: number;

	export { className as class };
</script>

<img
	class="absolute -top-12 right-0 left-0 mx-auto lg:-top-16 {className}"
	loading="lazy"
	{src}
	{alt}
	{width}
	{height}
/>
