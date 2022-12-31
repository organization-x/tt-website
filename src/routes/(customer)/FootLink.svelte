<script lang="ts">
	import { getContext } from "svelte";

	import type { Writable } from "svelte/store";

	export let href: string;

	const tabindex = getContext<Writable<number>>("tabindex");
</script>

<li>
	<a {href} tabindex={$tabindex} rel="noreferrer noopener">
		<slot />
	</a>
</li>
