<script lang="ts">
	import { page } from "$app/stores";

	import GitHub from "$lib/components/icons/GitHub.svelte";
	import Group from "$lib/components/icons/Group.svelte";
	import Instagram from "$lib/components/icons/Instagram.svelte";
	import LinkedIn from "$lib/components/icons/LinkedIn.svelte";
	import Wrench from "$lib/components/icons/Wrench.svelte";

	const user = $page.params.user;
</script>

<img
	src="https://unsplash.it/1200/800"
	alt="Banner"
	class="block w-full h-32 object-center object-cover"
/>

<main class="px-4 max-w-screen-lg mx-auto">
	<div class="flex">
		<div class="shrink-0 basis-32 pr-4">
			<img
				src="https://unsplash.it/400/400"
				alt="Profile"
				class="absolute w-28 h-28 rounded-full -translate-y-1/2 p-1 bg-gray-900"
			/>
			<div class="mt-16 mx-auto w-fit text-sm">
				<div class="flex gap-1 items-center">
					<span class="flex text-xl">
						<Group />
					</span>
					<p>Team</p>
				</div>
				<div class="flex gap-1 items-center">
					<span class="flex text-xl">
						<Wrench />
					</span>
					<p>Position {user}</p>
				</div>
			</div>
		</div>
		<div class="flex-1 mt-4">
			<h1 class="font-heading font-bold text-2xl">John Doe</h1>
			<p class="text-sm">
				Lorem ipsum dolor sit, amet consec tetur adipisicing elit.
				Nesciunt molestiae reiciendis repellat odio.
			</p>
		</div>
	</div>

	<ul
		class="mt-4 p-2 flex flex-wrap gap-2 justify-center bg-gray-800 rounded-lg text-4xl"
	>
		<li>
			<a href="https://github.com">
				<GitHub />
			</a>
		</li>
		<li>
			<a href="https://linkedin.com">
				<LinkedIn />
			</a>
		</li>
		<li>
			<a href="https://instagram.com">
				<Instagram />
			</a>
		</li>
	</ul>

	<section class="mt-4 p-4 bg-gray-800 rounded-lg">
		<h2 class="text-center text-3xl font-heading font-bold">Roles</h2>

		<div class="mt-4 grid grid-cols-2 gap-2">
			<div class="p-4 flex bg-gray-700 rounded-lg">Data Engineer</div>
			<div class="p-4 flex bg-gray-700 rounded-lg">Backend</div>
			<div class="p-4 flex bg-gray-700 rounded-lg">Frontend</div>
		</div>
	</section>
</main>
