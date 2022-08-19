<script lang="ts">
	export let name: string;
	export let pos: string;
</script>

<div class="shrink-0 w-32">
	<slot />
	<h4 class="font-semibold">{name}</h4>
	<h5 class="text-sm">{pos}</h5>
</div>
