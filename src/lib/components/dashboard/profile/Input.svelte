<script lang="ts">
	export let placeholder: string;
</script>

<div class="bg-gray-500/40 flex rounded-lg select-none">
	<div class="bg-gray-500/40 rounded-l-lg w-14 p-4">
		<slot />
	</div>
	<input
		type="text"
		class="w-full h-full px-2 bg-transparent focus:outline-none p-4"
		{placeholder}
	/>
</div>
