<script lang="ts">
	export let num: number;
	export let title: string;
	let className: string;

	export { className as class };
</script>

<div
	class="bg-gray-500/40 p-4 pt-2 -z-20 shrink-0 w-fit snap-center rounded-xl max-w-lg mx-auto xl:mx-0"
>
	<div
		class="flex gap-6 justify-center items-center mx-auto font-semibold py-4"
	>
		<div
			class="flex w-12 h-12 bg-gray-700 rounded-full relative text-3xl after:content-[''] after:absolute after:-top-1.5 after:-bottom-1.5 after:-left-1.5 after:-right-1.5 after:rounded-full after:bg-gradient-conic after:-z-10 {className}"
		>
			<h1 class="m-auto">{num}</h1>
		</div>
		<h1 class="text-xl">{title}</h1>
	</div>
	<p class="mt-3">
		<slot name="text" />
	</p>
	<slot name="svg" />
</div>
