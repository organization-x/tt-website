<script lang="ts">
	import PageTitle from "$lib/components/PageTitle.svelte";
	import PageGradient from "$lib/components/PageGradient.svelte";
	import PageCaption from "$lib/components/PageCaption.svelte";
	import Button from "$lib/components/Button.svelte";
	import TextHeader from "$lib/components/TextHeader.svelte";
	import DrawnArrow from "$lib/components/index/DrawnArrow.svelte";
	import Company from "$lib/components/index/Company.svelte";
	import GoogleCloud from "$lib/components/icons/GoogleCloud.svelte";
	import Python from "$lib/components/icons/Python.svelte";
	import TensorFlow from "$lib/components/icons/TensorFlow.svelte";
	import Pytorch from "$lib/components/icons/Pytorch.svelte";
	import JavaScript from "$lib/components/icons/JavaScript.svelte";
	import React from "$lib/components/icons/React.svelte";
	import GradientText from "$lib/components/GradientText.svelte";
	import Project from "$lib/components/index/Project.svelte";
	import MajorHeader from "$lib/components/index/MajorHeader.svelte";
	import MajorCaption from "$lib/components/index/MajorCaption.svelte";
	import Carousel from "$lib/components/index/Carousel.svelte";
	import Annotation from "$lib/components/index/Annotation.svelte";
	import DevCard from "$lib/components/index/DevCard.svelte";
	import Step from "$lib/components/index/Step.svelte";
	import GitDeploy from "$lib/components/index/GitDeploy.svelte";
	import GitMerge from "$lib/components/index/GitMerge.svelte";
	import GitCommit from "$lib/components/index/GitCommit.svelte";
	import StepTitle from "$lib/components/index/StepTitle.svelte";
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<PageGradient />

<div
	class="px-4 mx-auto max-w-screen-2xl lg:flex lg:mt-20 lg:justify-between lg:px-6 xl:px-10"
>
	<div class="flex flex-col justify-center shrink-0">
		<PageTitle class="from-teal-light to-teal-dark">
			Industry professionals at your fingertips.
		</PageTitle>

		<PageCaption>
			Develop something exciting with the backing you need.
			<strong>A great team</strong>.
		</PageCaption>

		<Button href="/contact" class="hidden lg:block lg:mt-6"
			>Contact Us</Button
		>
	</div>

	<img
		class="mt-6 mx-auto w-96 lg:mx-0 lg:w-[30rem]"
		src="/landing.webp"
		height="256"
		width="428"
		alt="Macbook cracked open eminating light"
	/>
</div>

<div class="px-4 mx-auto sm:px-10 lg:px-6 xl:px-10 max-w-screen-xl">
	<div
		class="flex flex-col mx-auto max-w-screen-lg items-center w-fit relative"
	>
		<Button href="/contact" class="mt-3 lg:hidden">Contact Us</Button>
		<TextHeader>
			What is
			<GradientText class="from-purple-light to-purple-dark">
				Team Tomorrow?
			</GradientText>
		</TextHeader>
		<DrawnArrow />
	</div>

	<p class="mt-8 max-w-lg mx-auto lg:text-center lg:max-w-2xl">
		<strong>
			Team Tomorrow is an ever expanding team of developers looking to
			provide companies access to our skills and our interests.
		</strong>
		You have access to developers that are
		<strong>eager to learn and collaborate</strong>, willing to communicate
		about in-depth and technical products, and are confident in doing what
		it takes to get a product done and polished fast.
	</p>

	<TextHeader>Top companies depend on us.</TextHeader>

	<div class="mt-8 flex flex-col gap-6 lg:grid lg:grid-cols-2 relative">
		<Company
			img={{
				src: "/healthcare.webp",
				alt: "Generic healthcare brand logo",
				width: 575,
				height: 172
			}}
			icons={[GoogleCloud, Python, TensorFlow, Pytorch]}
		>
			Focusing on intelligent automation for healthcare at a company, our
			developers build tools to automate repetitive tasks to reduce costs
			and and improve experiences in the workflow.
		</Company>
		<Company
			img={{
				src: "/obico.webp",
				alt: "Obico logo",
				width: 574,
				height: 198
			}}
			icons={[Python, TensorFlow]}
		>
			Determined to bring an open-source fix towards 3D Printing flaws at
			Obico, one of our developers is looking to create and polish a
			mobile app that will make that vision possible in the hands of
			millions of people around the world.
		</Company>
		<Company
			img={{
				src: "/ethereum.webp",
				alt: "Ethereum logo",
				width: 574,
				height: 144
			}}
			icons={[JavaScript, React]}
		>
			Our team has valuable skills in the WEB3 field. Team Tomorrow
			developers actively build tools utilizing data from the blockchain
			and leveraging APIs to help people make smart decisions when trading
			cryptocurrency assests like NFTs.
		</Company>
		<Company
			img={{
				src: "/obico.webp",
				alt: "Obico logo",
				width: 574,
				height: 198
			}}
			icons={[Python, TensorFlow]}
		>
			Determined to bring an open-source fix towards 3D Printing flaws at
			Obico, one of our developers is looking to create and polish a
			mobile app that will make that vision possible in the hands of
			millions of people around the world.
		</Company>
	</div>

	<div class="relative mt-12 w-fit mx-auto lg:mt-16">
		<TextHeader>You're the next big thing.</TextHeader>
		<Annotation />
	</div>

	<p class="mt-8 max-w-lg mx-auto lg:text-center lg:max-w-2xl">
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
	</p>

	<Button href="/contact" class="mt-8 mx-auto">Contact Us</Button>

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

	<Button href="/projects" class="mt-6 mx-auto">
		Uncover all our projects
	</Button>

	<!-- TODO: Fill in correct project members and their respective photos -->

	<div class="xl:grid xl:grid-cols-2 xl:gap-8">
		<Project
			img={{
				src: "/hippo2.webp",
				alt: "Hippo emoji",
				width: 250,
				height: 159
			}}
			imgClass="w-32 lg:w-36"
			title="Hippo2"
			href="/projects/hippo2"
			developers={[
				{
					name: "Jackson",
					role: "Designer",
					src: "./jackson.webp",
					alt: "Jackson Choyce from Team Tomorrow",
					href: "/user/docker"
				},
				{
					name: "Jackson",
					role: "Designer",
					src: "./jackson.webp",
					alt: "Jackson Choyce from Team Tomorrow",
					href: "/user/docker"
				},
				{
					name: "Jackson",
					role: "Designer",
					src: "./jackson.webp",
					alt: "Jackson Choyce from Team Tomorrow",
					href: "/user/docker"
				}
			]}
		>
			Hippo2 is our custom-built internal and customer-facing interface
			that facilitates course registration, dashboard, automated
			communication, back office, and other operations that are vital
			towards helping AI Camp generate millions in revenue annually.
		</Project>

		<Project
			img={{
				src: "/aiot.webp",
				alt: "AI On Thumbs green brain logo",
				width: 200,
				height: 200
			}}
			imgClass="w-24 lg:w-28"
			title="AI On Thumbs"
			href="/projects/aiot"
			side="right"
			developers={[
				{
					name: "Jackson",
					role: "Designer",
					src: "./jackson.webp",
					alt: "Jackson Choyce from Team Tomorrow",
					href: "/user/docker"
				},
				{
					name: "Jackson",
					role: "Designer",
					src: "./jackson.webp",
					alt: "Jackson Choyce from Team Tomorrow",
					href: "/user/docker"
				},
				{
					name: "Jackson",
					role: "Designer",
					src: "./jackson.webp",
					alt: "Jackson Choyce from Team Tomorrow",
					href: "/user/docker"
				}
			]}
		>
			Hippo2 is our custom-built internal and customer-facing interface
			that facilitates course registration, dashboard, automated
			communication, back office, and other operations that are vital
			towards helping AI Camp generate millions in revenue annually.
		</Project>

		<Project
			img={{
				src: "/bot.webp",
				alt: "Green robot",
				width: 200,
				height: 200
			}}
			imgClass="w-24 lg:w-28"
			title="AI Camp Bot"
			href="/projects/aicbot"
			developers={[
				{
					name: "Jackson",
					role: "Designer",
					src: "./jackson.webp",
					alt: "Jackson Choyce from Team Tomorrow",
					href: "/user/docker"
				},
				{
					name: "Jackson",
					role: "Designer",
					src: "./jackson.webp",
					alt: "Jackson Choyce from Team Tomorrow",
					href: "/user/docker"
				},
				{
					name: "Jackson",
					role: "Designer",
					src: "./jackson.webp",
					alt: "Jackson Choyce from Team Tomorrow",
					href: "/user/docker"
				}
			]}
		>
			Hippo2 is our custom-built internal and customer-facing interface
			that facilitates course registration, dashboard, automated
			communication, back office, and other operations that are vital
			towards helping AI Camp generate millions in revenue annually.
		</Project>

		<Project
			img={{
				src: "/bot.webp",
				alt: "Green robot",
				width: 200,
				height: 200
			}}
			imgClass="w-24 lg:w-28"
			title="AI Camp Bot"
			href="/projects/aicbot"
			developers={[
				{
					name: "Jackson",
					role: "Designer",
					src: "./jackson.webp",
					alt: "Jackson Choyce from Team Tomorrow",
					href: "/user/docker"
				},
				{
					name: "Jackson",
					role: "Designer",
					src: "./jackson.webp",
					alt: "Jackson Choyce from Team Tomorrow",
					href: "/user/docker"
				},
				{
					name: "Jackson",
					role: "Designer",
					src: "./jackson.webp",
					alt: "Jackson Choyce from Team Tomorrow",
					href: "/user/docker"
				}
			]}
		>
			Hippo2 is our custom-built internal and customer-facing interface
			that facilitates course registration, dashboard, automated
			communication, back office, and other operations that are vital
			towards helping AI Camp generate millions in revenue annually.
		</Project>
	</div>

	<Button href="/projects" class="my-14 mx-auto">
		Uncover all our projects
	</Button>

	<TextHeader>Multiple ways to build your personal workforce.</TextHeader>

	<MajorHeader>
		Discover
		<GradientText class="from-blue-light to-blue-dark">Our</GradientText>
		Skillset
	</MajorHeader>

	<MajorCaption>
		Seamlessly browse our team members to find who <strong>you</strong> can recruit
		to best suite your needs
	</MajorCaption>

	<Carousel>
		<DevCard
			info={{
				name: "Jackson Choyce",
				role: "Designer",
				src: "/jackson.webp",
				alt: "Jackson Choyce from Team Tomorrow",
				href: "/user/docker"
			}}
		>
			Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione,
			repellendus.
		</DevCard>
		<DevCard
			info={{
				name: "Jackson Choyce",
				role: "Designer",
				src: "/jackson.webp",
				alt: "Jackson Choyce from Team Tomorrow",
				href: "/user/docker"
			}}
		>
			Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione,
			repellendus.
		</DevCard>
		<DevCard
			info={{
				name: "Jackson Choyce",
				role: "Designer",
				src: "/jackson.webp",
				alt: "Jackson Choyce from Team Tomorrow",
				href: "/user/docker"
			}}
		>
			Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione,
			repellendus.
		</DevCard>
	</Carousel>

	<Button href="/developers" class="mx-auto mt-6 xl:mt-12">Discover</Button>

	<div class="my-14 lg:my-20">
		<TextHeader
			>Experience rapid takeoff with experience that fits.</TextHeader
		>

		<p class="mt-4 max-w-lg mx-auto text-center">
			A team only works with experience that matters.
			<strong>From DevOps to Deployment</strong>
			we've got you covered with the most popular tools and technologies used
			in workforces globally. Instantly find the developer that works for you
			by reading our blog post below.
		</p>

		<a
			href="/projects/something"
			class="p-4 block gap-6 mx-auto rounded-lg bg-gray-700/60 max-w-lg mt-8 border-t-4 ease-in-out duration-200 transition-transborder border-[#EFF24C] hover:scale-105 sm:flex sm:items-center"
		>
			<img
				src="/blog.webp"
				alt="Random shapes and colors in the formation of a hallway"
				loading="lazy"
				class="rounded-lg sm:w-28"
			/>
			<div>
				<h1 class="font-semibold text-2xl mt-4">Blog Post</h1>
				<p class="leading-5 mt-2 sm:text-sm md:text-lg md:leading-6">
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Com
					qui rem et unde corporis placeat.
				</p>
			</div>
		</a>
	</div>

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

	<div class="lg:hidden">
		<Carousel>
			<Step
				num={1}
				title="Choose your path"
				class="text-purple-light from-purple-light to-purple-dark"
			>
				<span slot="text">
					Lorem ipsum dolor sit amet consectetur adipisicing elit.
					Temporibus, ipsum quibusdam earum aperiam debitis odit
					dolorem veritatis qui praesentium voluptatem?
				</span>
				<GitCommit slot="svg" />
			</Step>
			<Step
				num={2}
				title="Evaluate options"
				class="text-teal-light from-teal-light to-teal-dark"
			>
				<span slot="text">
					Lorem ipsum dolor sit amet consectetur adipisicing elit.
					Temporibus, ipsum quibusdam earum aperiam debitis odit
					dolorem veritatis qui praesentium voluptatem?
				</span>
				<GitMerge slot="svg" />
			</Step>
			<Step
				num={3}
				title="Get speedy results"
				class="text-pink-light from-pink-light to-pink-dark"
			>
				<span slot="text">
					Lorem ipsum dolor sit amet consectetur adipisicing elit.
					Temporibus, ipsum quibusdam earum aperiam debitis odit
					dolorem veritatis qui praesentium voluptatem?
				</span>
				<GitDeploy slot="svg" />
			</Step>
		</Carousel>
	</div>

	<div
		class="hidden max-w-lg lg:mx-auto lg:flex lg:flex-col lg:gap-6 lg:mt-10 lg:bg-gray-500/40 lg:py-4 lg:pl-28 lg:pr-6 lg:-z-20 lg:rounded-xl lg:relative"
	>
		<div>
			<StepTitle
				num={1}
				title="Choose your path"
				class="text-purple-light from-purple-light to-purple-dark"
			/>
			<p>
				Lorem ipsum dolor sit amet consectetur adipisicing elit.
				Temporibus, ipsum quibusdam earum aperiam debitis odit dolorem
				veritatis qui praesentium voluptatem?
			</p>
		</div>
		<div>
			<StepTitle
				num={2}
				title="Evaluate options"
				class="text-teal-light from-teal-light to-teal-dark"
			/>
			<p>
				Lorem ipsum dolor sit amet consectetur adipisicing elit.
				Temporibus, ipsum quibusdam earum aperiam debitis odit dolorem
				veritatis qui praesentium voluptatem?
			</p>
		</div>
		<div>
			<StepTitle
				num={3}
				title="Get speedy results"
				class="text-pink-light from-pink-light to-pink-dark"
			/>
			<p>
				Lorem ipsum dolor sit amet consectetur adipisicing elit.
				Temporibus, ipsum quibusdam earum aperiam debitis odit dolorem
				veritatis qui praesentium voluptatem?
			</p>
		</div>
		<div
			class="absolute rotate-90 flex my-auto -left-60 top-0 bottom-0 h-[3.2rem]"
		>
			<GitCommit />
			<GitMerge />
			<GitDeploy />
		</div>
	</div>

	<Button href="/developers" class="mt-8 mx-auto">Takeoff</Button>
</div>
