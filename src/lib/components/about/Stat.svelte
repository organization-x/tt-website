<script lang="ts">
	export let title: string;
	export let statAmount: string;
	export let side = "left";
	export let statName: string;
	let className: string;

	export { className as class };
</script>

<div class="max-w-lg mx-auto">
	<h2 class:text-right={side !== "left"} class="font-semibold mx-2">
		{title.toUpperCase()}
	</h2>
	<div class="bg-gray-500/40 p-4 rounded-xl mt-2">
		<div
			class:before:-left-4={side === "left"}
			class:ml-4={side === "left"}
			class:before:left-auto={side !== "left"}
			class:before:-right-4={side !== "left"}
			class:text-right={side !== "left"}
			class:mr-4={side !== "left"}
			class="relative flex flex-col before:absolute before:inset-0 before:w-1 before:h-full before:rounded-sm {className}"
		>
			<h1 class="font-semibold text-4xl">{statAmount}</h1>
			<h4 class="text-2xl">{statName}</h4>
		</div>
		<p class:text-right={side !== "left"} class="mt-4">
			<slot />
		</p>
	</div>
</div>
