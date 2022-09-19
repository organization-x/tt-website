<script lang="ts">
	let className = "";
	export let active: boolean;

	export { className as class };
</script>

<button
	on:click
	class:border-white={active}
	class:border-transparent={!active}
	class="p-4 aspect-square w-16 rounded-lg bg-gray-500/40 text-xl shrink-0 border-2 {className}"
>
	<slot />
</button>
