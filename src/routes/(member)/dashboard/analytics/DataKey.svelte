<script lang="ts">
	export let label: string;
	export let value: number;
	export let className: string;
</script>

<div
	class="flex items-center text-lg max-w-60 mx-auto w-full gap-3 lg:text-base"
>
	<div class="w-5 h-5 rounded-full shrink-0 bg-current {className}" />

	<h1>
		{value}
	</h1>

	<h1 class="text-right font-semibold w-full">
		{label}
	</h1>
</div>
