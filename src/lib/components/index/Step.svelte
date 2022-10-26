<script lang="ts">
	let className: string;
	export let num: number;
	export let title: string;

	export { className as class };
</script>

<div
	class="bg-gray-500/40 flex flex-col justify-between p-4 pt-2 -z-20 shrink-0 w-fit snap-center rounded-xl max-w-lg mx-auto lg:bg-transparent lg:mx-0 lg:max-w-none lg:p-0"
>
	<div
		class="flex gap-6 justify-center items-center font-semibold py-4 mx-auto lg:mx-0 lg:w-fit"
	>
		<div
			class="flex select-none w-12 h-12 bg-gray-900 rounded-full relative text-3xl after:absolute after:-inset-1.5 after:rounded-full after:bg-gradient-conic after:-z-10 {className}"
		>
			<h1 class="m-auto">{num}</h1>
		</div>
		<h1 class="text-xl">{title}</h1>
	</div>

	<p class="mt-3">
		<slot />
	</p>

	<slot name="svg" />
</div>
