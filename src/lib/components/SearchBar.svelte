<script lang="ts">
	import Search from "$lib/components/icons/Search.svelte";
</script>

<div class="bg-gray-500/40 flex p-4 rounded-lg mt-8 select-none">
	<Search class="w-5 h-5" />
	<input
		on:input
		type="text"
		class="w-full h-full px-2 bg-transparent focus:outline-none"
		placeholder="Search Projects..."
	/>
</div>
