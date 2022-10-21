<script lang="ts">
	import { onMount } from "svelte";
	import Text from "$lib/components/Text.svelte";
	import Hero from "$lib/components/Hero.svelte";
	import Button from "$lib/components/Button.svelte";
	import Step from "$lib/components/index/Step.svelte";
	import Gear from "$lib/components/index/Gear.svelte";
	import Aiot from "$lib/components/index/Aiot.svelte";
	import Logo from "$lib/components/icons/Logo.svelte";
	import Hippo from "$lib/components/index/Hippo.svelte";
	import Crane from "$lib/components/index/Crane.svelte";
	import AicBot from "$lib/components/index/AICBot.svelte";
	import TextHeader from "$lib/components/TextHeader.svelte";
	import Company from "$lib/components/index/Company.svelte";
	import DevCard from "$lib/components/index/DevCard.svelte";
	import Project from "$lib/components/index/Project.svelte";
	import Section from "$lib/components/index/Section.svelte";
	import MajorHeader from "$lib/components/MajorHeader.svelte";
	import Carousel from "$lib/components/index/Carousel.svelte";
	import GitMerge from "$lib/components/index/GitMerge.svelte";
	import GradientText from "$lib/components/GradientText.svelte";
	import MajorCaption from "$lib/components/MajorCaption.svelte";
	import GitDeploy from "$lib/components/index/GitDeploy.svelte";
	import GitCommit from "$lib/components/index/GitCommit.svelte";
	import DrawnArrow from "$lib/components/index/DrawnArrow.svelte";
	import Annotation from "$lib/components/index/Annotation.svelte";

	import type { PageData } from "./$types";
	import type { AnalyticsInstance } from "analytics";

	export let data: PageData;

	let analytics: AnalyticsInstance | undefined;

	onMount(async () => {
		if (!data.track) return;

		analytics = await import("$lib/analytics")
			.then(({ analytics }) => analytics)
			.catch(() => undefined);
	});

	// Grab tracking utilities for clicking buttons
	const trackClick = (name: string) => async () =>
		analytics &&
		(await analytics.track("button_click", {
			id: name
		}));
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<!-- TODO: Put Adarsh's proper rendered video here-->

<Hero
	class="from-teal-light to-teal-dark"
	title="Grasp the top 1% of junior developers."
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

<div
	class="mx-auto pb-8 max-w-xs relative lg:mt-32 lg:max-w-screen-xl overflow-hidden"
>
	<Button
		on:click={() => trackClick("contact_top")}
		href="/contact"
		class="lg:hidden">Contact Us</Button
	>

	<TextHeader>
		What is
		<GradientText class="from-purple-light to-purple-dark">
			Team Tomorrow?
		</GradientText>
	</TextHeader>

	<DrawnArrow />
</div>

<p
	class="my-4 px-4 max-w-lg mx-auto sm:px-10 lg:px-6 lg:mt-0 lg:text-center lg:max-w-2xl xl:px-10"
>
	<strong>
		Team Tomorrow is an ever expanding team of developers looking to provide
		companies access to our skills and our interests.
	</strong>
	You have access to developers that are
	<strong>eager to learn and collaborate</strong>, willing to communicate
	about in-depth and technical products, and are confident in doing what it
	takes to get a product done and polished fast.
</p>

<Section filled={true}>
	<TextHeader>Top companies depend on us.</TextHeader>

	<div class="mt-8 flex flex-col gap-6 lg:grid lg:grid-cols-2">
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
			and and improve experiences in the workflow.
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
			and leveraging APIs to help people make smart decisions when trading
			cryptocurrency assests like NFTs.
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

	<div class="relative mt-8 w-fit mx-auto lg:mt-16">
		<TextHeader>You're the next big thing.</TextHeader>
		<Annotation />
	</div>

	<Text>
		Lots of companies nowadays have trouble lifting off the ground since
		hiring expert software engineers normally is expensive, not here. We
		look to empower others and
		<strong>
			lift the next big thing off the ground in time, and well.
		</strong>
		Contact us now for more information on the next steps or continue to explore
		this website and find our
		<strong>
			amazing projects and developers leveraging different skills in
			different fields all the time.
		</strong>
	</Text>

	<Button
		on:click={() => trackClick("contact_after_companies")}
		href="/contact"
	>
		Contact Us
	</Button>
</Section>

<Section>
	<MajorHeader>
		Uncover
		<GradientText class="from-pink-light to-pink-dark">
			Projects
		</GradientText>
	</MajorHeader>

	<MajorCaption>
		Look through our projects and see our skills in action being used to
		craft <strong>real experiences.</strong>
	</MajorCaption>

	<Button
		on:click={() => trackClick("uncover_projects")}
		href="/projects"
		class="my-8">Uncover all our projects</Button
	>

	<Project project={data.projects[0]}>
		<Hippo slot="svg" />
	</Project>

	<Project project={data.projects[1]}>
		<Aiot slot="svg" />
	</Project>

	<Project project={data.projects[2]}>
		<AicBot slot="svg" />
	</Project>

	<Project project={data.projects[3]}>
		<Logo slot="svg" class="w-20 absolute -top-8 right-0 left-0 mx-auto" />
	</Project>

	<Button
		on:click={() => trackClick("uncover_projects")}
		href="/projects"
		class="mb-12 mt-12"
	>
		Uncover all our projects
	</Button>
</Section>

<Section filled={true}>
	<div class="relative my-12 w-fit mx-auto">
		<Crane />
		<TextHeader>Multiple ways to build your personal workforce.</TextHeader>
		<Gear />
	</div>

	<MajorHeader>
		Discover
		<GradientText class="from-blue-light to-blue-dark">Our</GradientText>
		Skillset
	</MajorHeader>

	<MajorCaption>
		Seamlessly browse our team members to find who <strong>you</strong> can recruit
		to best suite your needs
	</MajorCaption>

	<!-- TODO: Switch indexing to proper values -->

	<Carousel>
		<DevCard
			developer={data.developers[0]}
			position="Software Engineer"
			accomplishments={[
				"Worked on 80000 projects.",
				"Worked on 80000 projects.",
				"Worked on 80000 projects.",
				"Worked on 80000 projects."
			]}
		/>

		<DevCard
			developer={data.developers[0]}
			position="Software Engineer"
			accomplishments={[
				"Worked on 80000 projects.",
				"Worked on 80000 projects.",
				"Worked on 80000 projects.",
				"Worked on 80000 projects."
			]}
		/>

		<DevCard
			developer={data.developers[0]}
			position="Software Engineer"
			accomplishments={[
				"Worked on 80000 projects.",
				"Worked on 80000 projects.",
				"Worked on 80000 projects.",
				"Worked on 80000 projects."
			]}
		/>
	</Carousel>

	<div
		class="hidden lg:px-20 lg:flex lg:flex-col lg:gap-12 lg:mt-32 lg:max-w-screen-xl"
	>
		<DevCard
			developer={data.developers[0]}
			position="Software Engineer"
			accomplishments={[
				"Worked on 80000 projects.",
				"Worked on 80000 projects.",
				"Worked on 80000 projects.",
				"Worked on 80000 projects."
			]}
		/>

		<DevCard
			developer={data.developers[0]}
			position="Software Engineer"
			accomplishments={[
				"Worked on 80000 projects.",
				"Worked on 80000 projects.",
				"Worked on 80000 projects.",
				"Worked on 80000 projects."
			]}
		/>

		<DevCard
			developer={data.developers[0]}
			position="Software Engineer"
			accomplishments={[
				"Worked on 80000 projects.",
				"Worked on 80000 projects.",
				"Worked on 80000 projects.",
				"Worked on 80000 projects."
			]}
		/>
	</div>

	<Button
		on:click={() => trackClick("discover_developers")}
		href="/developers"
		class="mt-4 lg:mt-8">Discover</Button
	>

	<!-- TODO: Put actual important blog post here -->

	<TextHeader>Experience rapid takeoff with experience that fits.</TextHeader>

	<Text>
		A team only works with experience that matters.
		<strong>From DevOps to Deployment</strong>
		we've got you covered with the most popular tools and technologies used in
		workforces globally. Read a succesfull story of how we built a comprehensive
		product for one of our clients, and how we did it behind th scenes.
	</Text>

	<a
		href="/projects/something"
		rel="noopener noreferrer"
		class="p-4 block mb-8 mx-auto rounded-lg bg-gray-700/60 max-w-xs mt-8 border-t-4 ease-in-out duration-200 transition-transform sm:hover:scale-105 sm:flex sm:gap-8 sm:items-center sm:max-w-lg"
		style="border-color: #3B84D6"
	>
		<div
			class="rounded-lg bg-center bg-no-repeat bg-cover w-full shrink-0 aspect-square sm:w-28"
			style="background-image: url(/assets/projects/project/placeholder/banner.webp);"
		/>
		<div>
			<h1 class="font-semibold text-2xl mt-4">Blog Post</h1>
			<p class="leading-5 mt-2 sm:text-sm md:text-lg md:leading-6">
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Com qui
				rem et unde corporis placeat.
			</p>
		</div>
	</a>
</Section>

<MajorHeader>
	Let's
	<GradientText class="from-green-light to-green-dark">
		Get Started
	</GradientText>
</MajorHeader>

<MajorCaption>
	Connect with us and let us hand pick
	<strong>exclusive developers</strong>
	to make your product soar.
</MajorCaption>

<Carousel>
	<Step
		num={1}
		title="Choose your path"
		class="text-purple-light from-purple-light to-purple-dark"
	>
		Figure out what you want to acheive and the skills needed to accomplish
		such a task. Start by filtering through our team members to pinpoint
		and/or discover your ideal candidates. Or contact us immediatly to get
		reccomendations and an instant quote.

		<GitCommit slot="svg" />
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

		<GitMerge slot="svg" />
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

		<GitDeploy slot="svg" />
	</Step>
</Carousel>

<div
	class="hidden lg:max-w-2xl lg:mx-auto lg:flex lg:flex-col lg:gap-6 lg:mt-10 lg:bg-gray-500/40 lg:py-6 lg:pl-28 lg:pr-6 lg:-z-20 lg:rounded-xl lg:relative xl:max-w-screen-lg"
>
	<div class="flex flex-col lg:gap-4">
		<Step
			num={1}
			title="Choose your path"
			class="text-purple-light from-purple-light to-purple-dark"
		>
			Figure out what you want to acheive and the skills needed to
			accomplish such a task. Start by filtering through our team members
			to pinpoint and/or discover your ideal candidates. Or contact us
			immediatly to get reccomendations and an instant quote.
		</Step>

		<Step
			num={2}
			title="Evaluate options"
			class="text-teal-light from-teal-light to-teal-dark"
		>
			Look deep into the detailed information we provide on each of our
			team members. Evaluate our developers' projects, skill sets, social
			media, and more by clicking on their profile preview and exploring
			what they have to offer.
		</Step>

		<Step
			num={3}
			title="Get speedy results"
			class="text-pink-light from-pink-light to-pink-dark"
		>
			Contact us to schedule a virtual meeting for more information on
			pricing and next steps. We'll be happy to help you get started
			quickly and neatly without skipping a beat. Then watch our
			developers give the boost your project needs.
		</Step>
	</div>

	<div class="absolute rotate-90 flex my-auto -left-56 top-0 bottom-0 h-14">
		<GitCommit />
		<GitMerge />
		<GitDeploy />
	</div>
</div>

<Button
	on:click={() => trackClick("explore_developers")}
	href="/developers"
	class="mt-8">Explore Developers</Button
>
