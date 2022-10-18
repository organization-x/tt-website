<script lang="ts">
	export let label: string;
	export let value: number;
	export let className: string;
</script>

<div class="flex text-lg max-w-[15rem] mx-auto w-full gap-3 lg:text-base">
	<svg class="w-5 h-5 mt-1 shrink-0">
		<circle class={className} cx="10" cy="10" r="10" />
	</svg>

	<h1>
		{value}
	</h1>

	<h1 class="text-right font-semibold w-full">
		{label}
	</h1>
</div>
