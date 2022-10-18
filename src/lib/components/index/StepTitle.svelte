<script lang="ts">
	let className: string;
	export let num: number;
	export let title: string;

	export { className as class };
</script>

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
