<script lang="ts">
	export let src: string;
	export let alt: string;
	export let width: number;
	export let height: number;
</script>

<img class="w-48" loading="lazy" {src} {alt} {width} {height} />
