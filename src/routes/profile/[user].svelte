<script lang="ts">
	import { page } from "$app/stores";

	import Group from "../../components/icons/Group.svelte";
	import Wrench from "../../components/icons/Wrench.svelte";

	const user = $page.params.user;

	console.log($page.params.user);
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
				class="absolute w-28 h-28 rounded-full -translate-y-1/2 border-4 border-black"
			/>
			<div class="mt-16 mx-auto w-fit">
				<div class="flex gap-2 items-center">
					<span class="flex text-xl">
						<Group />
					</span>
					<p>Team</p>
				</div>
				<div class="flex gap-2 items-center">
					<span class="flex text-xl">
						<Wrench />
					</span>
					<p>Position</p>
				</div>
			</div>
		</div>
		<div class="flex-1 mt-4">
			<h1 class="font-heading text-2xl text-green-light">John Doe</h1>
			<p class="text-sm">
				Lorem ipsum dolor sit, amet consec tetur adipisicing elit.
				Nesciunt molestiae reiciendis repellat odio.
			</p>
		</div>
	</div>
</main>
