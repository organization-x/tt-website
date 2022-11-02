<script lang="ts">
	export let src: string;
	export let alt: string;
	export let title: string;
	export let side = "left";
</script>

<div
	class:md:flex-row-reverse={side !== "left"}
	class:items-end={side !== "left"}
	class="flex flex-col gap-4 md:text-base md:flex-row md:items-center"
>
	<img
		class="w-32 md:shrink-0"
		height="1024"
		width="1024"
		loading="lazy"
		{src}
		{alt}
	/>
	<div class:text-right={side !== "left"} class="mt-4">
		<h1 class="font-semibold">{title}</h1>
		<p class="mt-1">
			<slot />
		</p>
	</div>
</div>
