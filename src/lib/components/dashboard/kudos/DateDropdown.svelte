<script lang="ts">
	import DropdownItem from "$lib/components/DropdownItem.svelte";
	import DropArrow from "$lib/components/icons/DropArrow.svelte";
	import LeftArrow from "$lib/components/icons/LeftArrow.svelte";
	import RightArrow from "$lib/components/icons/RightArrow.svelte";

	enum DateOption {
		Week = "Last 7 days",
		Month = "Last 30 days",
		Year = "Last 12 months",
		Custom = "Custom"
	}

	export let selected: DateOption = DateOption.Week;

	const options = Object.values(DateOption);

	let open = false;
	let days: Date[];
	let childOpen = false;
	let parent: HTMLDivElement;
	let childParent: HTMLDivElement;

	// Keep track of the current date the custom date is on
	let current = new Date();

	// Reset the current date to midnight so the comparison works properly
	current.setHours(0, 0, 0, 0);

	// Store iterable data for generating the calender
	$: {
		const month = current.getMonth();
		const year = current.getFullYear();
		const date = new Date(year, month, 0).getDate();

		days = Array.from(
			{ length: date },
			(_, i) => new Date(year, month, i + 1)
		);
	}

	// Check if click is outside of the dropdown, if so, close it
	const windowClick = ({ target }: Event) => {
		if (open && !parent.contains(target as Node)) {
			open = false;
			childOpen = false;
		} else if (childParent && !childParent.contains(target as Node))
			childOpen = false;
	};
</script>

<svelte:window on:click={windowClick} />

<div bind:this={parent} class="relative max-w-sm mx-auto">
	<button
		on:click={() => (open = !open)}
		class:rounded-b-lg={!open}
		class="flex items-center justify-between p-4 w-full bg-gray-800 rounded-t-lg"
	>
		<h1>
			{selected === DateOption.Custom
				? current.toLocaleDateString("en-US")
				: selected}
		</h1>
		<DropArrow {open} class="w-6 h-6" />
	</button>

	{#if open}
		<div
			class="absolute w-full h-fit inset-0 top-14 shadow-lg bg-gray-800 rounded-b-lg z-40 p-4"
		>
			<div bind:this={childParent} class="relative">
				<button
					on:click={() => (childOpen = !childOpen)}
					class:rounded-b-lg={!childOpen}
					class="flex items-center justify-between p-4 w-full bg-gray-900 rounded-t-lg"
				>
					<h1>{selected}</h1>
					<DropArrow open={childOpen} class="w-6 h-6" />
				</button>

				{#if childOpen}
					<div
						class="absolute w-full h-fit flex flex-col inset-0 top-14 shadow-lg bg-gray-900 rounded-b-lg max-h-[15rem] overflow-auto z-50"
					>
						{#each options as option}
							<DropdownItem
								radio={true}
								on:click={() => (selected = option)}
								selected={selected === option}
							>
								{option.replaceAll("_", " ")}
							</DropdownItem>
						{/each}
					</div>
				{/if}
			</div>

			<div
				disabled={selected !== DateOption.Custom}
				class:opacity-70={selected !== DateOption.Custom}
				class:text-gray-500={selected !== DateOption.Custom}
				class:pointer-events-none={selected !== DateOption.Custom}
				class="mt-6"
			>
				<div class="flex justify-between">
					<h1 class="font-semibold">
						{current.toLocaleString("en-US", {
							month: "long",
							year: "numeric"
						})}
					</h1>
					<div class="flex gap-2">
						<button
							on:click={() => {
								current.setMonth(current.getMonth() - 1);
								current = current;
							}}
						>
							<LeftArrow class="w-5 h-5" />
						</button>
						<button
							on:click={() => {
								current.setMonth(current.getMonth() + 1);
								current = current;
							}}
						>
							<RightArrow class="w-5 h-5" />
						</button>
					</div>
				</div>
				<div class="grid grid-cols-7 grid-rows-5 gap-2 -ml-1 mt-4">
					{#each days as day, i}
						<button
							on:click={() => (current = day)}
							class:bg-blue-light={current.toString() ===
								day.toString()}
							class="font-bold rounded-lg p-2 shrink-0 w-fit aspect-square"
						>
							{i + 1}
						</button>
					{/each}
				</div>
			</div>
		</div>
	{/if}
</div>
