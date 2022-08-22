<script lang="ts">
	export let current: boolean;
	export let name: string;
</script>

<div
	on:click
	class:grayscale={!current}
	class="font-semibold flex jsutify-center gap-4 items-center h-14 cursor-pointer bg-gray-500/40 rounded-lg px-4 snap-center shrink-0"
>
	<slot />
	<h1>{name}</h1>
</div>
