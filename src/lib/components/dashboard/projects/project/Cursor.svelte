<script lang="ts">
	export let name: string;
	export let color: string;

	let hover = true;

	// Show label temporarily after the cursor updates
	let timeout = setTimeout(() => {
		hover = false;
	}, 3000);

	const onHover = (hovering: boolean) => {
		clearTimeout(timeout);

		if (hovering) hover = true;
		else
			timeout = setTimeout(() => {
				hover = false;
			}, 3000);
	};

	// Custom slide transition for revealing the cursor name
	const slide = (node: Element) => {
		return {
			duration: 50,
			css: (t: number, u: number) => `clip-path: inset(0 0 % ${u * 100}%)`
		};
	};
</script>

<span
	on:mouseenter={() => onHover(true)}
	on:mouseleave={() => onHover(false)}
	class="select-none relative border-x-[1.5px] -m-[1.5px] break-normal cursor-text"
	style="border-color: {color}"
>
	{#if hover}
		<div
			transition:slide
			class="rounded-sm rounded-br-none text-xs -right-[1.5px] px-1 py-0.5 absolute -top-5 whitespace-nowrap select-none pointer-events-none "
			style="background-color: {color};"
			contenteditable="false"
		>
			{name}
		</div>
	{/if}
</span>
