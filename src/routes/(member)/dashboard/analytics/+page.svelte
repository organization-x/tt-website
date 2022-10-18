<script lang="ts">
	import { DateOption } from "$lib/enums";
	import DevTag from "$lib/components/DevTag.svelte";
	import DashHero from "$lib/components/dashboard/DashHero.svelte";
	import DashWrap from "$lib/components/dashboard/DashWrap.svelte";
	import DevTagLoading from "$lib/components/DevTagLoading.svelte";
	import Graph from "$lib/components/dashboard/analytics/Graph.svelte";
	import DashSection from "$lib/components/dashboard/DashSection.svelte";
	import DataKey from "$lib/components/dashboard/analytics/DataKey.svelte";
	import DateDropdown from "$lib/components/dashboard/DateDropdown.svelte";
	import Comparison from "$lib/components/dashboard/analytics/Comparison.svelte";
	import GraphLoading from "$lib/components/dashboard/analytics/GraphLoading.svelte";
	import ComparisonLoading from "$lib/components/dashboard/analytics/ComparisonLoading.svelte";

	let custom: Date;
	let selected = DateOption.Week;
	let request: Promise<App.AnalyticsResponse> = new Promise(() => {});

	// Encode dates based on the selected option
	const encodeDate = (option: DateOption) => {
		const now = new Date();

		switch (option) {
			case DateOption.Week:
				now.setDate(now.getDate() - 7);

				break;
			case DateOption.Month:
				now.setDate(now.getDate() - 30);

				break;
			case DateOption.Year:
				now.setMonth(now.getMonth() - 12);

				break;
			case DateOption.Custom:
				return {
					startDate: custom.toLocaleDateString("en-CA"),
					endDate: custom.toLocaleDateString("en-CA")
				};
		}

		return {
			startDate: now.toLocaleDateString("en-CA"),
			endDate: new Date().toLocaleDateString("en-CA")
		};
	};

	const search = () => {
		request = fetch("/api/analytics", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(encodeDate(selected) as App.AnalyticsRequest)
		}).then((res) => res.json());
	};

	// TODO: Finish up loading placeholders and test layout
	// TODO: Move onto kudos page!
</script>

<svelte:head>
	<title>Analytics Manager</title>
</svelte:head>

<DashWrap>
	<DashHero title="Your Analytics" />

	<DateDropdown
		on:change={() => (request = new Promise(() => {}))}
		on:search={({ detail }) =>
			(selected = detail.selected) &&
			(custom = detail.custom) &&
			search()}
	/>

	<div class="text-center font-semibold flex flex-col gap-8">
		<div class="flex flex-col gap-8">
			<DashSection
				title="Profile"
				class="flex flex-col gap-8 lg:flex-row"
			>
				<div
					class="bg-gray-500/40 p-6 rounded-lg md:flex md:items-center lg:flex-col lg:w-full"
				>
					{#await request}
						<div class="animate-pulse flex flex-col gap-2">
							<div
								class="rounded-full p-4 aspect-square w-52 mx-auto mb-7 flex items-center justify-center relative border-[17px] border-gray-400"
							>
								<div
									class="rounded-full h-5 w-28 bg-gray-400"
								/>
							</div>

							<div
								class="flex max-w-[15rem] mx-auto w-full justify-between items-center "
							>
								<div
									class="w-5 h-5 shrink-0 bg-gray-400 rounded-full"
								/>

								<div
									class="w-8 h-5 ml-3 rounded-full bg-gray-400"
								/>

								<div
									class="w-10 h-5 ml-auto rounded-full bg-gray-400"
								/>
							</div>

							<div
								class="flex max-w-[15rem] mx-auto w-full justify-between items-center"
							>
								<div
									class="w-5 h-5 shrink-0 bg-gray-400 rounded-full"
								/>

								<div
									class="w-8 h-5 ml-3 rounded-full bg-gray-400"
								/>

								<div
									class="w-20 h-5 ml-auto rounded-full bg-gray-400"
								/>
							</div>

							<ComparisonLoading />
						</div>
					{:then analytics}
						{@const views = analytics.returning + analytics.new}

						<div
							class="rounded-full p-4 aspect-square w-52 mx-auto mb-6 flex items-center justify-center relative border-[17px] md:w-48 md:m-0 lg:shrink-0
                    {views ? 'border-blue-dark' : 'border-gray-500/40'}"
						>
							{#if views}
								<svg
									class="absolute -inset-[17px]"
									viewBox="0 0 120 120"
									fill="none"
								>
									<circle
										class="stroke-blue-light stroke-[10] animate-progress"
										style="stroke-linecap: round; stroke-dasharray: 400;
                                                    stroke-dashoffset: {400 -
											Math.trunc(
												(analytics.new / views) * 400
											)};"
										cx="60"
										cy="60"
										r="55"
									/>
								</svg>

								<h1 class="font-semibold">
									<!-- Whichever category of users is higher will be displayed inside the circle -->
									{#if analytics.returning > analytics.new}
										{Math.trunc(
											(analytics.returning / views) * 100
										)}% Returning visitors
									{:else}
										{Math.trunc(
											(analytics.new / views) * 100
										)}% New visitors
									{/if}
								</h1>
							{:else}
								<h1 class="font-semibold">No views</h1>
							{/if}
						</div>

						<div
							class="md:w-40 md:mx-auto lg:h-full lg:flex lg:flex-col"
						>
							<div class="mt-8">
								<DataKey
									value={analytics.new}
									className={views
										? "fill-blue-light"
										: "fill-gray-500/40"}
									label="New"
								/>

								<DataKey
									value={analytics.returning}
									className={views
										? "fill-blue-dark"
										: "fill-gray-500/40"}
									label="Returning"
								/>
							</div>

							<Comparison
								current={views}
								previous={analytics.prevViews}
								label="views"
							/>
						</div>
					{/await}
				</div>

				<div
					class="flex flex-col gap-4 bg-gray-500/40 rounded-lg p-6 lg:w-full"
				>
					<h1 class="font-semibold text-lg">Top Soft Skills</h1>

					{#await request}
						<div class="flex flex-col gap-4 animate-pulse">
							<DevTagLoading />
							<DevTagLoading />
						</div>
					{:then analytics}
						{#each { length: 2 } as _, i}
							<DevTag name={analytics.softSkills[i]} />
						{/each}
					{/await}

					<h1 class="font-semibold text-lg mt-2">Top Tech Skills</h1>

					{#await request}
						<div class="flex flex-col gap-4 animate-pulse">
							<DevTagLoading />
							<DevTagLoading />

							<ComparisonLoading />
						</div>
					{:then analytics}
						{#each { length: 2 } as _, i}
							<DevTag name={analytics.techSkills[i]} />
						{/each}

						<Comparison
							current={analytics.searches}
							previous={analytics.prevSearches}
							label="searches"
						/>
					{/await}
				</div>
			</DashSection>

			<DashSection title="Projects" class="bg-gray-500/40">
				<div
					class="flex flex-col gap-4 rounded-lg p-6 lg:grid lg:grid-cols-2"
				>
					<h1 class="font-semibold text-lg">Top Tech Skills</h1>

					{#await request}
						<div class="flex flex-col gap-4 animate-pulse">
							<DevTagLoading />
							<DevTagLoading />

							<ComparisonLoading />
						</div>
					{:then analytics}
						{#each { length: 2 } as _, i}
							<DevTag name={analytics.projects.techSkills[i]} />
						{/each}

						<Comparison
							current={analytics.projects.searches}
							previous={analytics.projects.prevSearches}
							label="searches"
							class="col-start-1 row-start-2"
						/>
					{/await}
				</div>
			</DashSection>
		</div>

		<div class="bg-gray-500/40 px-4 py-6 rounded-lg">
			{#await request}
				<GraphLoading />
			{:then analytics}
				<Graph title="Views" data={analytics.projects.views} />
			{/await}
		</div>

		<div class="bg-gray-500/40 px-4 py-6 rounded-lg">
			{#await request}
				<GraphLoading />
			{:then analytics}
				<Graph
					title="Scroll Percent"
					domain={[0, 100]}
					data={analytics.projects.scrolled}
				/>
			{/await}
		</div>
	</div>
</DashWrap>
