<script lang="ts">
	export let filled = false;
</script>

<div class:bg-gray-900={filled} class:section-clip={filled}>
	<div
		class:pt-4={filled}
		class:pb-10={filled}
		class="flex flex-col sm:px-10 lg:px-6 xl:px-10 px-4 max-w-screen-xl mx-auto"
	>
		<slot />
	</div>
</div>
