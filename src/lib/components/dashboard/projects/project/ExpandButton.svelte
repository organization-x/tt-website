<script lang="ts">
	let className: string;
	export let open: boolean;
	export let active: boolean;

	export { className as class };

	let element: HTMLDivElement;
</script>

<div
	bind:this={element}
	class:border-white={active}
	class:border-transparent={!active}
	class="flex items-center rounded-lg bg-gray-500/40 border-2 shrink-0"
>
	<button
		on:click
		class="flex gap-4 shrink-0 w-11 p-3 items-center justify-center"
	>
		<slot name="button" />
	</button>

	<div
		class:px-2={open}
		on:transitionend={() => {
			if (open)
				element.scrollIntoView({
					block: "nearest",
					behavior: "smooth"
				});
		}}
		class="flex gap-3 justify-center transition-widpad overflow-hidden h-full {open
			? className
			: 'w-0'}"
	>
		<slot name="expanded" />
	</div>
</div>
