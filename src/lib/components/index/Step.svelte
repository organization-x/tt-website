<script lang="ts">
	import StepTitle from "./StepTitle.svelte";

	export let num: number;
	export let title: string;
	let className: string;

	export { className as class };
</script>

<div
	class="bg-gray-500/40 p-4 pt-2 -z-20 shrink-0 w-fit snap-center rounded-xl max-w-lg mx-auto xl:mx-0"
>
	<StepTitle {num} {title} class={className} />
	<p class="mt-3">
		<slot name="text" />
	</p>
	<slot name="svg" />
</div>
