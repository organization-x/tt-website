<script lang="ts">
	export let name: string;
	export let current: boolean;
</script>

<div
	on:click
	class:grayscale={!current}
	class:cursor-pointer={!current}
	class="font-semibold flex jsutify-center gap-4 items-center h-14 bg-gray-500/40 rounded-lg px-4 snap-center shrink-0"
>
	<slot />
	<h1>{name}</h1>
</div>
