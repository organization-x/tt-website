<script lang="ts">
	export let title: string;
	export let side = "left";
</script>

<div>
	<div class:ml-auto={side !== "left"} class="w-32">
		<slot name="img" />
	</div>
	<div class:text-right={side !== "left"} class="mt-4">
		<h1 class="font-semibold">{title}</h1>
		<p class="mt-1">
			<slot />
		</p>
	</div>
</div>
