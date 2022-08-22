<script lang="ts">
	export let name: string;
	export let current: boolean;
</script>

<div
	on:click
	class:opacity-50={!current}
	class="font-semibold h-14 shrink-0 flex items-center gap-2 justify-center bg-gray-500/40 rounded-lg py-4 px-6 snap-center select-none cursor-pointer"
>
	<slot />
	{name}
</div>
