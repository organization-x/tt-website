<script lang="ts">
	import { tweened } from "svelte/motion";
	import { DateOption } from "$lib/enums";
	import { quintInOut } from "svelte/easing";
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
		request = fetch("/api/stats", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(encodeDate(selected) as App.AnalyticsRequest)
		})
			.then((res) => res.json())
			.then((analytics: App.AnalyticsResponse) => {
				percent.set(
					Math.trunc(
						(analytics.new /
							(analytics.new + analytics.returning)) *
							100
					)
				);

				return analytics;
			});
	};

	// Custom animation for circular view ratio gradient
	const percent = tweened(0, {
		duration: 1500,
		easing: quintInOut
	});
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
					class="bg-gray-500/40 p-6 rounded-lg md:flex md:gap-4 md:items-center lg:flex-col lg:w-full lg:gap-0"
				>
					{#await request}
						<div
							class="animate-pulse md:flex-row md:flex md:w-full md:items-center lg:flex-col lg:h-full"
						>
							<div
								class="rounded-full p-4 aspect-square w-52 mx-auto mb-9 relative bg-gray-400 md:w-48 md:m-0 md:shrink-0"
							>
								<div
									class="absolute inset-3 rounded-full flex items-center justify-center bg-gray-800"
								>
									<div
										class="rounded-full h-5 w-32 bg-gray-400"
									/>
								</div>
							</div>

							<div
								class="flex flex-col gap-2 md:mx-auto md:mt-1.5 lg:h-full lg:gap-1"
							>
								<div
									class="flex max-w-60 mx-auto w-full justify-between items-center md:mt-8 lg:mt-7"
								>
									<div
										class="w-5 h-5 shrink-0 bg-gray-400 rounded-full"
									/>

									<div
										class="w-8 h-5 ml-3 rounded-full bg-gray-400 lg:h-4 lg:ml-2"
									/>

									<div
										class="w-10 h-5 ml-auto rounded-full bg-gray-400 lg:h-4"
									/>
								</div>

								<div
									class="flex max-w-60 mx-auto w-full justify-between items-center"
								>
									<div
										class="w-5 h-5 shrink-0 bg-gray-400 rounded-full"
									/>

									<div
										class="w-8 h-5 ml-3 rounded-full bg-gray-400 lg:h-4 lg:ml-2"
									/>

									<div
										class="w-20 h-5 ml-auto rounded-full bg-gray-400 lg:h-4"
									/>
								</div>

								<div class="mt-5 md:mt-6 lg:mt-auto">
									<div
										class="w-56 h-5 mx-auto rounded-full bg-gray-400 mb-3"
									/>

									<div class="flex gap-3 justify-center">
										<div
											class="w-14 h-5 rounded-full bg-gray-400"
										/>

										<div
											class="w-5 h-5 rounded-sm bg-gray-400"
										/>

										<div
											class="w-14 h-5 rounded-full bg-gray-400"
										/>
									</div>
								</div>
							</div>
						</div>
					{:then analytics}
						{@const views = analytics.returning + analytics.new}

						<div
							class="rounded-full p-4 aspect-square w-52 mx-auto mb-6 from-blue-light to-blue-dark relative md:w-48 md:m-0 lg:shrink-0"
							style="background: conic-gradient(var(--tw-gradient-from) calc({$percent}%), var(--tw-gradient-to) 0)"
						>
							<div
								class="absolute inset-3 rounded-full bg-gray-800 flex items-center justify-center shadow-[0_0_5px_3px_rgba(0,0,0,0.4)]"
							>
								<h1 class="font-semibold">
									{#if views}
										<!-- Whichever category of users is higher will be displayed inside the circle -->
										{#if analytics.returning > analytics.new}
											{Math.trunc(
												(analytics.returning / views) *
													100
											)}% Returning visitors
										{:else}
											{Math.trunc(
												(analytics.new / views) * 100
											)}% New visitors
										{/if}
									{:else}
										No Views
									{/if}
								</h1>
							</div>
						</div>

						<div
							class="md:w-fit md:mx-auto lg:h-full lg:flex lg:flex-col"
						>
							<div class="mt-8">
								<DataKey
									value={analytics.new}
									className={views
										? "text-blue-light"
										: "text-gray-500/40"}
									label="New"
								/>

								<DataKey
									value={analytics.returning}
									className={views
										? "text-blue-dark"
										: "text-gray-500/40"}
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
						<DevTagLoading />
						<DevTagLoading />
					{:then analytics}
						{#each { length: 2 } as _, i}
							<DevTag name={analytics.softSkills[i]} />
						{/each}
					{/await}

					<h1 class="font-semibold text-lg mt-2">Top Tech Skills</h1>

					{#await request}
						<DevTagLoading />
						<DevTagLoading />

						<div class="animate-pulse mt-6 md:mt-7 lg:mt-1">
							<div
								class="w-56 h-5 mx-auto rounded-full bg-gray-400 mb-3"
							/>

							<div class="flex gap-3 justify-center">
								<div
									class="w-16 h-5 rounded-full bg-gray-400"
								/>

								<div class="w-5 h-5 rounded-sm bg-gray-400" />

								<div
									class="w-16 h-5 rounded-full bg-gray-400"
								/>
							</div>
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

			<DashSection
				title="Projects"
				class="bg-gray-500/40 rounded-lg flex flex-col gap-4 p-6 lg:grid lg:grid-cols-2"
			>
				<h1 class="font-semibold text-lg">Top Tech Skills</h1>

				{#await request}
					<DevTagLoading />
					<DevTagLoading />

					<div
						class="animate-pulse mt-6 md:mt-7 lg:mt-1 lg:col-start-1 lg:row-start-2"
					>
						<div
							class="w-56 h-5 mx-auto rounded-full bg-gray-400 mb-3"
						/>

						<div class="flex gap-3 justify-center">
							<div class="w-16 h-5 rounded-full bg-gray-400" />

							<div class="w-5 h-5 rounded-sm bg-gray-400" />

							<div class="w-16 h-5 rounded-full bg-gray-400" />
						</div>
					</div>
				{:then analytics}
					{#each { length: 2 } as _, i}
						<DevTag name={analytics.projects.techSkills[i]} />
					{/each}

					<Comparison
						current={analytics.projects.searches}
						previous={analytics.projects.prevSearches}
						label="searches"
						class="lg:col-start-1 lg:row-start-2"
					/>
				{/await}
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
