<script lang="ts">
	export let open: boolean;
	export let active: boolean;

	let element: HTMLDivElement;
</script>

<div
	bind:this={element}
	class:border-white={active}
	class:border-transparent={!active}
	class="flex items-center rounded-lg bg-gray-500/40 border-2 shrink-0"
>
	<button on:click class="flex gap-4 shrink-0 w-12 h-12">
		<slot name="button" />
	</button>

	<div
		class:w-0={!open}
		class:w-56={open}
		class:px-2={open}
		on:transitionend={() => {
			if (open)
				element.scrollIntoView({
					block: "nearest",
					behavior: "smooth"
				});
		}}
		class="flex gap-3 justify-center transition-widpad overflow-hidden"
	>
		<slot name="expanded" />
	</div>
</div>
