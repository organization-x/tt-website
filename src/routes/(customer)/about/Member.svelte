<script lang="ts">
	export let pos: string;
	export let src: string;
	export let name: string;
</script>

<div class="shrink-0 w-32">
	<img
		class="rounded-md mb-2 bg-gray-400 object-cover object-center"
		loading="lazy"
		width="512"
		height="512"
		alt="{name} from Team Tomorrow"
		{src}
	/>

	<h4 class="font-semibold">{name}</h4>
	<h5 class="text-sm">{pos}</h5>
</div>
