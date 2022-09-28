<script lang="ts">
	export let name: string;
	export let active: boolean;
</script>

<button
	on:click
	class:opacity-50={!active}
	class="font-semibold h-14 transition-opacity w-48 shrink-0 flex items-center gap-2 justify-center bg-gray-500/40 rounded-lg py-4 px-6 snap-center select-none"
>
	<slot />
	{name}
</button>
