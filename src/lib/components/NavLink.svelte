<script lang="ts">
	export let href: string;
	export let active = false;
	export let target: string | undefined = undefined;
</script>

<li class="p-4 lg:p-0">
	<a
		{href}
		{target}
		class="lg:rounded-lg lg:py-3 lg:px-4{active ? ' bg-gray-500/40' : ''}"
		rel="noreferrer noopener"
	>
		<slot />
	</a>
</li>
