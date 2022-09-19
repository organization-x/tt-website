<script lang="ts">
	export let title: string | null = null;
</script>

{#if title}
	<div>
		<h1 class="font-semibold text-xl">{title}</h1>
		<div class="flex flex-col gap-4 bg-gray-500/40 p-4 mt-3 rounded-lg">
			<slot />
		</div>
	</div>
{:else}
	<div class="flex flex-col gap-4 bg-gray-500/40 p-4 mt-3 rounded-lg">
		<slot />
	</div>
{/if}
