<script lang="ts">
	let className: string;
	export let src: string;
	export let title: string;

	export { className as class };
</script>

<div
	class="px-4 text-center mx-auto mt-10 sm:mt-0 max-w-sm md:max-w-md lg:flex lg:text-left lg:mb-14 lg:mt-16 lg:justify-between lg:items-center lg:px-6 lg:gap-8 lg:max-w-4xl xl:max-w-6xl xl:px-8 xl:gap-12"
>
	<div class="flex flex-col justify-center shrink-0 mt-8">
		<h1
			class="font-extrabold text-3xl bg-clip-text text-transparent bg-gradient-radial mx-auto md:text-4xl lg:mt-0 lg:text-left lg:mx-0 lg:max-w-xs xl:text-5xl xl:leading-14 xl:max-w-md {className}"
		>
			{title}
		</h1>

		<p
			class="text-lg mt-8 mx-auto px-2 sm:text-base lg:text-left lg:mx-0 lg:px-0 lg:max-w-xs lg:mt-4 xl:text-lg"
		>
			<slot />
		</p>

		<slot name="button" />
	</div>

	<div
		class="w-full my-14 sm:my-10 lg:max-w-md lg:aspect-square lg:flex lg:items-center lg:my-0 xl:max-w-lg"
	>
		<video autoplay muted playsinline>
			<source {src} type="video/webm" />
		</video>
	</div>
</div>
