<script lang="ts">
	export let href: string;
	export let active = false;
	export let target: string | undefined = undefined;
</script>

<li class="px-4 py-3 rounded-lg {active ? ' bg-gray-500/40' : ''}">
	<a
		{href}
		{target}
		class="lg:flex lg:items-center lg:gap-2"
		rel="noreferrer noopener"
	>
		<slot />
	</a>
</li>
