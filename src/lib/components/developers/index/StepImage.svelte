<script lang="ts">
	export let src: string;
	export let alt: string;
</script>

<img
	class="w-32 md:shrink-0"
	height="500"
	width="500"
	loading="lazy"
	{src}
	{alt}
/>
