<script lang="ts">
	let className = "";
	export let title: string;

	export { className as class };
</script>

<div class="flex flex-col gap-5">
	<h1 class="font-semibold text-2xl text-center">{title}</h1>
	<div class="h-full {className}">
		<slot />
	</div>
</div>
