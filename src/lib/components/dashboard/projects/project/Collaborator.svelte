<script lang="ts">
	import { slide } from "svelte/transition";
	import { onMount, createEventDispatcher } from "svelte";

	import { positions } from "$lib/enums";
	import DashButton from "../../DashButton.svelte";
	import DropArrow from "$lib/components/icons/DropArrow.svelte";
	import RadioSelect from "$lib/components/icons/RadioSelect.svelte";

	export let cantRemove: boolean;
	export let user: App.ProjectAuthor;

	let open = false;
	let parent: HTMLDivElement;

	const dispatch = createEventDispatcher<{ click: { id: string } }>();

	// Close menu when clicking outside of it
	onMount(() => {
		const onClick = ({ target }: Event) => {
			if (!parent.contains(target as Node)) open = false;
		};

		addEventListener("click", onClick);

		return () => removeEventListener("click", onClick);
	});
</script>

<div
	transition:slide
	bind:this={parent}
	class="flex flex-col bg-gray-500/40 rounded-lg"
>
	<button
		on:click={() => (open = !open)}
		class="flex justify-between items-center p-4"
	>
		<!-- TODO: Update icon url to proper value-->
		<img
			src="/developers/user/placeholder/icon.webp"
			alt="{user.name}'s avatar"
			class="w-10 h-10 rounded-full"
		/>
		<h1 class="text-lg">{user.name}</h1>
		<DropArrow {open} class="w-7 h-7 transition-transform" />
	</button>
	{#if open}
		<div class="p-4" transition:slide={{ duration: 200 }}>
			<h1 class="font-semibold text-lg ml-1.5">Position</h1>
			<div class="flex flex-col gap-4 mt-4">
				{#each positions as position}
					<button
						on:click={() => (user.position = position)}
						class="flex items-center gap-2"
					>
						<RadioSelect
							selected={user.position === position}
							class="w-8 h-8"
						/>
						<h1 class="text-lg">{position}</h1>
					</button>
				{/each}
			</div>
			{#if !cantRemove}
				<DashButton
					class="mt-8 bg-blue-light"
					on:click={() => dispatch("click", { id: user.id })}
				>
					Remove
				</DashButton>
			{/if}
		</div>
	{/if}
</div>
