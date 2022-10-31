<script lang="ts">
	let className: string;
	export let src: string;
	export let title: string;

	export { className as class };
</script>

<div
	class="px-4 mx-auto mb-10 max-w-screen-2xl lg:flex lg:mt-20 lg:justify-between lg:px-6 xl:px-10 lg:gap-8"
>
	<div class="flex flex-col justify-center shrink-0">
		<h1
			class="font-extrabold text-3xl sm:text-4xl text-center bg-clip-text text-transparent bg-gradient-radial max-w-sm mx-auto mt-6 lg:mt-0 lg:text-left lg:mx-0 lg:max-w-xs lg:text-4xl xl:text-5xl xl:max-w-md xl:leading-14 {className}"
		>
			{title}
		</h1>

		<p
			class="text-center max-w-sm mt-4 mx-auto px-8 lg:text-left lg:leading-6 lg:mx-0 lg:px-0 lg:max-w-xs"
		>
			<slot />
		</p>

		<slot name="button" />
	</div>

	<div class="w-full m-auto mt-12 max-w-lg lg:m-auto">
		<video autoplay muted playsinline>
			<source {src} type="video/webm" />
		</video>
	</div>
</div>
