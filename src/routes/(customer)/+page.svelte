<script lang="ts">
	import { onMount } from "svelte";

	import Aiot from "./Aiot.svelte";
	import Step from "./Step.svelte";
	import Hero from "./Hero.svelte";
	import Hippo from "./Hippo.svelte";
	import { carousel } from "$lib/seo";
	import Header from "./Header.svelte";
	import AicBot from "./AICBot.svelte";
	import Caption from "./Caption.svelte";
	import Company from "./Company.svelte";
	import DevCard from "./DevCard.svelte";
	import Project from "./Project.svelte";
	import Section from "./Section.svelte";
	import GitMerge from "./GitMerge.svelte";
	import Carousel from "./Carousel.svelte";
	import GitCommit from "./GitCommit.svelte";
	import GitDeploy from "./GitDeploy.svelte";
	import Text from "$lib/components/Text.svelte";
	import Logo from "$lib/icons/logos/Logo.svelte";
	import Button from "$lib/components/Button.svelte";
	import GradientText from "$lib/components/GradientText.svelte";

	import type { PageData } from "./$types";
	import type { AnalyticsInstance } from "analytics";

	export let data: PageData;

	let analytics: AnalyticsInstance | undefined;

	// Grab tracking utilities for clicking buttons
	const trackClick = (name: string) => async () =>
		analytics &&
		(await analytics.track("button_click", {
			id: name
		}));

	onMount(async () => {
		if (!data.track) return;

		analytics = await import("$lib/analytics")
			.then(({ analytics }) => analytics)
			.catch(() => undefined);
	});
</script>

<svelte:head>
	<title>Home</title>

	{@html carousel(data.items)}
</svelte:head>

<!-- TODO: Create graphic for landing -->

<Hero
	class="from-teal-light to-teal-dark"
	title="Hire the top 1% of junior developers"
	src="/assets/index/index.webm"
>
	Develop something exciting with skills from low-level mastery to meticulous
	design. Accelerate progress with the backing you need.
	<strong>A great team</strong>.

	<Button
		slot="button"
		on:click={() => trackClick("contact_top")}
		href="/contact"
		class="hidden lg:block lg:mt-6 lg:mx-0"
	>
		Contact Us
	</Button>
</Hero>

<div class="px-2 sm:px-6 lg:mb-6 lg:pt-4">
	<Button
		on:click={() => trackClick("contact_top")}
		href="/contact"
		class="lg:hidden"
	>
		Contact Us
	</Button>

	<Header>
		What is
		<GradientText class="from-purple-light to-purple-dark">
			Team Tomorrow?
		</GradientText>
	</Header>

	<Text>
		<strong>
			Team Tomorrow is an ever expanding team of developers looking to
			provide companies access to our skills and our interests.
		</strong>
		You have access to developers that are
		<strong>eager to learn and collaborate</strong>, willing to communicate
		about in-depth and technical products, and are confident in doing what
		it takes to get a product done and polished fast.
	</Text>
</div>

<Section filled={true}>
	<Header>Top companies depend on us</Header>

	<div
		class="mt-8 flex flex-col max-w-screen-xl mx-auto gap-6 lg:grid lg:grid-cols-2"
	>
		<Company
			skills={["Google_Cloud", "Python", "TensorFlow", "Pytorch"]}
			image={{
				src: "/assets/index/healthcare.webp",
				alt: "Generic healthcare logo",
				width: 575,
				height: 172
			}}
		>
			Focusing on intelligent automation for healthcare at a company, our
			developers build tools to automate repetitive tasks to reduce costs
			and improve experiences in the workflow.
		</Company>

		<Company
			skills={["Python", "Pytorch"]}
			image={{
				src: "/assets/index/obico.webp",
				alt: "Obico logo",
				width: 574,
				height: 198
			}}
		>
			Determined to bring an open-source fix towards 3D Printing flaws at
			Obico, one of our developers is looking to create and polish a
			mobile app that will make that vision possible in the hands of
			millions of people around the world.
		</Company>

		<Company
			skills={["JavaScript", "React"]}
			image={{
				src: "/assets/index/ethereum.webp",
				alt: "Ethereum logo",
				width: 574,
				height: 144
			}}
		>
			Our team has valuable skills in the WEB3 field. Team Tomorrow
			developers actively build tools utilizing data from the blockchain
			and leveraging APIs to help people make good decisions when trading
			cryptocurrency assets like NFTs.
		</Company>

		<Company
			skills={["Python", "AWS"]}
			image={{
				src: "/assets/index/imprint.webp",
				alt: "Imprint logo",
				width: 574,
				height: 139
			}}
		>
			Imprint is a full-stack e-commerce platform for rewarding customers
			and backing up their purchase decisions. One of our developers has
			created and shipped automatic VPNs for employees and is continuing
			to do AWS management.
		</Company>
	</div>

	<Header>Let's create the next big thing</Header>

	<Text>
		Many companies nowadays have trouble lifting off the ground since hiring
		expert software engineers can be expensive, but not here. We strive to
		empower our developers to create
		<strong>your next big thing</strong>
		Contact us <strong>now</strong> for more information on the next steps,
		or continue to explore our website and uncover our
		<strong>
			stunning projects and the developers who have created them.
		</strong>
	</Text>

	<Button
		on:click={() => trackClick("contact_after_companies")}
		href="/contact"
		class="mt-2"
	>
		Contact Us
	</Button>
</Section>

<Section>
	<Header>
		Uncover Real-World
		<GradientText class="from-pink-light to-pink-dark">
			Projects
		</GradientText>
	</Header>

	<Caption>
		Look through our projects and see our skills in action being used to
		craft <strong>real experiences.</strong>
	</Caption>

	<div class="my-6 max-w-screen-xl w-full mx-auto lg:-mt-10">
		{#if data.projects[0]}
			<Project {trackClick} project={data.projects[0]}>
				<Hippo slot="svg" />
			</Project>
		{/if}

		{#if data.projects[1]}
			<Project {trackClick} project={data.projects[1]}>
				<Aiot slot="svg" />
			</Project>
		{/if}

		{#if data.projects[2]}
			<Project {trackClick} project={data.projects[2]}>
				<AicBot slot="svg" />
			</Project>
		{/if}

		{#if data.projects[3]}
			<Project {trackClick} project={data.projects[3]}>
				<Logo
					slot="svg"
					class="w-20 absolute -top-8 right-0 left-0 mx-auto"
				/>
			</Project>
		{/if}
	</div>

	<Button
		on:click={() => trackClick("uncover_projects")}
		href="/projects"
		class="mb-12 mt-10"
	>
		Uncover all our projects
	</Button>
</Section>

<Section filled={true}>
	<Header>
		Discover Advanced
		<GradientText class="from-blue-light to-blue-dark">
			Skillsets
		</GradientText>
	</Header>

	<Caption>
		Seamlessly browse our team members to find who <strong>you</strong> can recruit
		to best suite your needs
	</Caption>

	<Carousel class="lg:flex lg:flex-col lg:gap-12 lg:max-w-xl">
		{#if data.developers[0]}
			<DevCard developer={data.developers[0]} />
		{/if}

		{#if data.developers[1]}
			<DevCard developer={data.developers[1]} />
		{/if}

		{#if data.developers[2]}
			<DevCard developer={data.developers[2]} />
		{/if}
	</Carousel>

	<Button
		on:click={() => trackClick("discover_developers")}
		href="/developers"
	>
		Discover
	</Button>

	<Header>Or, let us pick the best</Header>

	<Text>
		If you're not sure about choosing your own developers through our
		discovery system, <strong>we can choose for you</strong> and get the
		precise team to do the job. Although, we highly reccomend looking
		through our <strong>numerous projects and achievements</strong> first to
		get a better idea of what we can do.
	</Text>

	<Button
		on:click={() => trackClick("contact_after_developers")}
		href="/contact"
		class="mt-2"
	>
		Contact Us
	</Button>
</Section>

<Header>
	Time To
	<GradientText class="from-green-light to-green-dark">Take Off</GradientText>
</Header>

<Caption>
	Once you haven chosen the best pathway, it's time to
	<strong>take off</strong>
	and get started. Let's make your project soar.
</Caption>

<Carousel
	class="px-2 lg:mx-auto lg:flex lg:flex-col lg:gap-6 lg:mt-10 lg:bg-gray-900 lg:py-6 lg:pl-28 lg:pr-6 lg:-z-20 lg:rounded-lg lg:relative lg:max-w-xl xl:max-w-4xl xl:grid xl:grid-cols-3 xl:px-8 xl:gap-y-10"
>
	<Step
		num={1}
		title="Choose your path"
		class="text-purple-light from-purple-light to-purple-dark"
	>
		Figure out what you want to achieve and the skills needed to accomplish
		such a task. Start by filtering through our team members to pinpoint
		your ideal candidates. Or contact us immediately to get recommendations
		and an instant quote.

		<GitCommit slot="svg" class="lg:hidden" />
	</Step>

	<Step
		num={2}
		title="Evaluate options"
		class="text-teal-light from-teal-light to-teal-dark"
	>
		Look deep into the detailed information we provide on each of our team
		members. Evaluate our developers' projects, skill sets, social media,
		and more by clicking on their profile preview and exploring what they
		have to offer.

		<GitMerge slot="svg" class="lg:hidden" />
	</Step>

	<Step
		num={3}
		title="Get speedy results"
		class="text-pink-light from-pink-light to-pink-dark"
	>
		Contact us to schedule a virtual meeting for more information on pricing
		and next steps. We'll be happy to help you get started quickly and
		neatly without skipping a beat. Then watch our developers give the boost
		your project needs.

		<GitDeploy slot="svg" class="lg:hidden" />
	</Step>

	<div
		class="hidden lg:flex lg:absolute lg:rotate-90 lg:my-auto lg:-left-56 lg:top-0 lg:bottom-0 lg:h-14 xl:rotate-0 xl:static xl:col-span-3 xl:justify-center"
	>
		<GitCommit class="xl:h-16 xl:mt-0" />
		<GitMerge class="xl:h-16 xl:mt-0" />
		<GitDeploy class="xl:h-16 xl:mt-0" />
	</div>
</Carousel>

<Button
	on:click={() => trackClick("explore_developers")}
	href="/developers"
	class="mt-8"
>
	Discover Developers
</Button>
