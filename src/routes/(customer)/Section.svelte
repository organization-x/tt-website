<script lang="ts">
	export let filled = false;
</script>

<div
	class:bg-gray-900={filled}
	class:section-clip={filled}
	class:pb-12={filled}
	class:lg:pb-16={filled}
	class="flex flex-col p-4 sm:px-6 lg:px-6 xl:px-10"
>
	<slot />
</div>
