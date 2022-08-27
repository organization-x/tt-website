<script lang="ts">
	import type { Developer } from "../types";

	export let info: Developer;
</script>

<a
	href={info.href}
	class="flex p-2 gap-2 items-center shrink-0 relative rounded-lg snap-center
    
    after:duration-200 after:transition-transform after:h-0.5 after:absolute after:right-4 after:-bottom-0.5 after:left-4 after:bg-white after:scale-x-0 hover:after:scale-x-100
    
    lg:after:h-3/4 lg:after:my-auto lg:after:w-0.5 lg:after:inset-0 lg:after:-left-0.5 lg:after:scale-y-0 lg:hover:after:scale-y-100"
>
	<img
		height="200"
		width="200"
		src={info.src}
		alt={info.alt}
		loading="lazy"
		class="rounded-full my-auto w-10"
	/>
	<div>
		<h1 class="leading-4">{info.name}</h1>
		<p class="text-xs">{info.pos}</p>
	</div>
</a>
