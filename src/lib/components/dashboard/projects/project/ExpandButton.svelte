<script lang="ts">
	export let open: boolean;
	export let active: boolean;
</script>

<div
	class:border-white={active}
	class:border-transparent={!active}
	class="flex rounded-lg bg-gray-500/40 border-2 shrink-0"
>
	<button on:click class="flex gap-4 shrink-0 w-14 aspect-square">
		<slot name="button" />
	</button>
	<div
		class:w-0={!open}
		class:w-52={open}
		class:pl-4={open}
		class="flex gap-2 transition-widpad overflow-hidden"
	>
		<slot name="expanded" />
	</div>
</div>
