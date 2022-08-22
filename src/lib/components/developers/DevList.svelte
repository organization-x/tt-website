<script lang="ts">
	import type { ComponentType } from "svelte/types/runtime/internal/dev.js";

	export let title: string;
	let Icon: ComponentType;

	export { Icon as icon };
</script>

<div class="flex font-semibold justify-center items-center gap-2 mt-8">
	<Icon class="w-6 h-6" />
	<h1>{title}</h1>
</div>
<div class="flex flex-col gap-4 mt-4">
	<slot />
</div>

<!-- TODO: Add animated graphic to every page -->
<!-- TODO: Create desktop version of developers page -->
<!-- TODO: Add comments and/or finish other TODO's -->
