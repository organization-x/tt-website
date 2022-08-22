<script lang="ts">
	export let current: boolean;
</script>

<div
	on:click
	class:grayscale={!current}
	class="h-14 flex cursor-pointer items-center gap-4 justify-center bg-gray-500/40 rounded-lg py-4 px-6 snap-center shrink-0"
>
	<slot />
</div>
