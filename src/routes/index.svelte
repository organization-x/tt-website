<script lang="ts">
	import PageTitle from "$lib/components/PageTitle.svelte";
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
	import Section from "$lib/components/index/Section.svelte";
	import Hero from "$lib/components/Hero.svelte";
	import ProjectImage from "$lib/components/index/ProjectImage.svelte";
	import CompanyImage from "$lib/components/index/CompanyImage.svelte";
	import Aws from "$lib/components/icons/Aws.svelte";
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<!-- Landing with macbook and intro phrase -->

<Hero>
	<PageTitle class="from-teal-light to-teal-dark">
		Industry professionals at your fingertips.
	</PageTitle>

	<PageCaption>
		Develop something exciting with the backing you need.
		<strong>A great team</strong>.
	</PageCaption>

	<Button href="/contact" class="hidden lg:block lg:mt-6">Contact Us</Button>
	<img
		slot="image"
		height="850"
		width="1200"
		src="/landing.webp"
		alt="Macbook slight cracked open eminating light"
	/>
</Hero>

<!-- First section outlining who we are and what we do -->

<div class="flex flex-col mx-auto max-w-screen-lg items-center w-fit relative">
	<Button href="/contact" class="mt-3 lg:hidden">Contact Us</Button>
	<TextHeader>
		What is
		<GradientText class="from-purple-light to-purple-dark">
			Team Tomorrow?
		</GradientText>
	</TextHeader>
	<DrawnArrow />
</div>

<p
	class="my-8 px-4 sm:px-10 lg:px-6 xl:px-10 max-w-lg mx-auto lg:text-center lg:max-w-2xl"
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

<!-- Second section showcasing companies we have worked with/are currently working with -->

<Section filled={true}>
	<TextHeader>Top companies depend on us.</TextHeader>

	<div class="mt-8 flex flex-col gap-6 lg:grid lg:grid-cols-2 relative">
		<Company icons={[GoogleCloud, Python, TensorFlow, Pytorch]}>
			<CompanyImage
				slot="img"
				src="/healthcare.webp"
				alt="Generic healthcare brand logo"
				width={575}
				height={172}
			/>
			Focusing on intelligent automation for healthcare at a company, our developers
			build tools to automate repetitive tasks to reduce costs and and improve
			experiences in the workflow.
		</Company>
		<Company icons={[Python, TensorFlow]}>
			<CompanyImage
				slot="img"
				src="/obico.webp"
				alt="Obico logo"
				width={574}
				height={198}
			/>
			Determined to bring an open-source fix towards 3D Printing flaws at Obico,
			one of our developers is looking to create and polish a mobile app that
			will make that vision possible in the hands of millions of people around
			the world.
		</Company>
		<Company icons={[JavaScript, React]}>
			<CompanyImage
				slot="img"
				src="/ethereum.webp"
				alt="Ethereum logo"
				width={574}
				height={144}
			/>
			Our team has valuable skills in the WEB3 field. Team Tomorrow developers
			actively build tools utilizing data from the blockchain and leveraging
			APIs to help people make smart decisions when trading cryptocurrency
			assests like NFTs.
		</Company>
		<Company icons={[Python, Aws]}>
			<CompanyImage
				slot="img"
				src="/imprint.webp"
				alt="Imprint logo"
				width={574}
				height={139}
			/>
			Imprint is a full-stack e-commerce platform for rewarding customers and
			backing up their purchase decisions. One of our developers has created
			and shipped automatic VPNs for employees and is continuing to do AWS
			management.
		</Company>
	</div>

	<div class="relative mt-8 w-fit mx-auto lg:mt-16">
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
</Section>

<!-- Showing off projects we have done, the people who worked on them, and the skills used in them -->
<!-- TODO: Fill in correct project members and their respective photos, get 4th project to put here too, fill in correct skill icons -->
<!-- TODO: Alphabetically organize developers to look proffesional -->

<Section>
	<MajorHeader>
		Uncover
		<GradientText class="from-pink-light to-pink-dark"
			>Projects</GradientText
		>
	</MajorHeader>

	<MajorCaption>
		Look through our projects and see our skills in action being used to
		craft <strong>real experiences.</strong>
	</MajorCaption>

	<Button href="/projects" class="mt-6 mx-auto"
		>Uncover all our projects</Button
	>

	<Project
		title="Hippo2"
		href="/projects/hippo2"
		developers={[
			{
				name: "Zachary",
				role: "Software Engineer",
				src: "./jackson.webp",
				alt: "Zachary Brammer from Team Tomorrow",
				href: "/zacharybrammer"
			},
			{
				name: "Bernice",
				role: "Product Designer",
				src: "./jackson.webp",
				alt: "Bernice Lau from Team Tomorrow",
				href: "/bernicelau"
			},
			{
				name: "Sean",
				role: "Software Engineer",
				src: "./jackson.webp",
				alt: "Sean Kim from Team Tomorrow",
				href: "/seankim"
			},
			{
				name: "Sricharan",
				role: "Product Manager",
				src: "./jackson.webp",
				alt: "Sricharan Guddanti from Team Tomorrow",
				href: "/sricharanguddanti"
			},
			{
				name: "Mathan",
				role: "Software Engineer",
				src: "./jackson.webp",
				alt: "Mathan Xaysena from Team Tomorrow",
				href: "/mathanxaysena"
			},
			{
				name: "Alex",
				role: "Software Engineer",
				src: "./jackson.webp",
				alt: "Alex Nguyen from Team Tomorrow",
				href: "/alexnguyen"
			},
			{
				name: "Alexander",
				role: "Engineering Manager",
				src: "./jackson.webp",
				alt: "Alexander Zhou from Team Tomorrow",
				href: "/alexanderzhou"
			},
			{
				name: "Jackson",
				role: "Engineering Manager",
				src: "./jackson.webp",
				alt: "Engineering Manager from Team Tomorrow",
				href: "/jacksonchoyce"
			},
			{
				name: "Leo",
				role: "Software Engineer",
				src: "./jackson.webp",
				alt: "Leo Du from Team Tomorrow",
				href: "/leodu"
			},
			{
				name: "Hyrum",
				role: "Software Engineer",
				src: "./jackson.webp",
				alt: "Hyrum Hansen from Team Tomorrow",
				href: "/hryumhansen"
			},
			{
				name: "Ray",
				role: "Software Engineer",
				src: "./jackson.webp",
				alt: "Ray Flanagan from Team Tomorrow",
				href: "/rayflanagan"
			},
			{
				name: "Matthew",
				role: "Software Engineer",
				src: "./jackson.webp",
				alt: "Matthew Martono from Team Tomorrow",
				href: "/matthewmartono"
			},
			{
				name: "Joseph",
				role: "Software Engineer",
				src: "./jackson.webp",
				alt: "Joseph Salinas from Team Tomorrow",
				href: "/josephsalinas"
			}
		]}
		icons={[Python, TensorFlow]}
	>
		Hippo2 is our custom-built internal and customer-facing interface that
		facilitates course registration, dashboard, automated communication,
		back office, and other operations that are vital towards helping AI Camp
		generate millions in revenue annually.
		<ProjectImage
			slot="img"
			src="/hippo2.webp"
			alt="Hippo emoji"
			width={250}
			height={159}
			class="w-32 lg:w-36"
		/>
	</Project>

	<Project
		title="AI On Thumbs"
		href="/projects/aiot"
		developers={[
			{
				name: "Alexander",
				role: "Engineering Manager",
				src: "./jackson.webp",
				alt: "Alexander Zhou from Team Tomorrow",
				href: "/alexanderzhou"
			},
			{
				name: "Rohan",
				role: "Software Engineer",
				src: "./jackson.webp",
				alt: "Rohan Joshi from Team Tomorrow",
				href: "/rohanjoshi"
			},
			{
				name: "Axel",
				role: "Lead Designer",
				src: "./jackson.webp",
				alt: "Axel Mora from Team Tomorrow",
				href: "/axelmora"
			},
			{
				name: "Jackson",
				role: "Engineering Manager",
				src: "./jackson.webp",
				alt: "Jackson Choyce from Team Tomorrow",
				href: "/jacksonchoyce"
			},
			{
				name: "Mitch",
				role: "Product Manager",
				src: "./jackson.webp",
				alt: "Mitch Cutts from Team Tomorrow",
				href: "/mitchcutts"
			},
			{
				name: "Zac",
				role: "Software Engineer",
				src: "./jackson.webp",
				alt: "Zac Brammer from Team Tomorrow",
				href: "/zacbrammer"
			},
			{
				name: "Alex",
				role: "Software Engineer",
				src: "./jackson.webp",
				alt: "Alex Fry from Team Tomorrow",
				href: "/alexfry"
			},
			{
				name: "Sanjay",
				role: "Software Engineer",
				src: "./jackson.webp",
				alt: "Sanjay Manoj from Team Tomorrow",
				href: "/sanjaymanoj"
			},
			{
				name: "Advay",
				role: "Software Engineer",
				src: "./jackson.webp",
				alt: "Advay Aravind from Team Tomorrow",
				href: "/advayaravind"
			},
			{
				name: "Blake",
				role: "Design and Engineering",
				src: "./jackson.webp",
				alt: "Blake Martin from Team Tomorrow",
				href: "/blakemartin"
			},
			{
				name: "Ansh",
				role: "Design and Engineering",
				src: "./jackson.webp",
				alt: "Ansh Chaurasia from Team Tomorrow",
				href: "/anshchaurasia"
			},
			{
				name: "Phakawat",
				role: "Design and Engineering",
				src: "./jackson.webp",
				alt: "Phakawat Wangkriangkri from Team Tomorrow",
				href: "/phakawatwangkriangkri"
			}
		]}
		icons={[Python, TensorFlow]}
	>
		Learning AI seems like an impossible task. In reality, it's not. AI On
		Thumbs is a mobile app that provides an easy way to learn and interact
		with AI just with your phone. It provides easy high-level examples to
		let anyone interested dive right into AI. Made for developers, by
		developers.
		<ProjectImage
			slot="img"
			src="/aiot.webp"
			alt="AI On Thumbs green brain logo"
			width={200}
			height={200}
			class="w-24 lg:w-28"
		/>
	</Project>

	<Project
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
			},
			{
				name: "Jackson",
				role: "Designer",
				src: "./jackson.webp",
				alt: "Jackson Choyce from Team Tomorrow",
				href: "/user/docker"
			}
		]}
		icons={[Python, TensorFlow]}
	>
		Running a camp with 1,000+ students and multiple mentors is no easy
		task. That's why our developers created a bot to automate huge data
		collection and analytical tracking tasks to make sure AI Camp's summer
		program can run without hurdles.
		<ProjectImage
			slot="img"
			src="/bot.webp"
			alt="Green robot"
			width={200}
			height={200}
			class="w-24 lg:w-28"
		/>
	</Project>

	<Project
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
			},
			{
				name: "Jackson",
				role: "Designer",
				src: "./jackson.webp",
				alt: "Jackson Choyce from Team Tomorrow",
				href: "/user/docker"
			}
		]}
		icons={[Python, TensorFlow]}
	>
		Hippo2 is our custom-built internal and customer-facing interface that
		facilitates course registration, dashboard, automated communication,
		back office, and other operations that are vital towards helping AI Camp
		generate millions in revenue annually.
		<ProjectImage
			slot="img"
			src="/bot.webp"
			alt="Green robot"
			width={200}
			height={200}
			class="w-24 lg:w-28"
		/>
	</Project>

	<Button href="/projects" class="my-14 mx-auto"
		>Uncover all our projects</Button
	>
</Section>

<!-- Showcasing some of our top TT members and their skills and what theyve accomplished -->

<Section filled={true}>
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

	<!-- Blog post advert hopefully catching anyones attention, this could be swapped around with our most prized blog post for the time -->

	<div class="my-8 lg:my-20">
		<TextHeader
			>Experience rapid takeoff with experience that fits.</TextHeader
		>

		<p class="mt-4 max-w-lg mx-auto text-center">
			A team only works with experience that matters.
			<strong>From DevOps to Deployment</strong>
			we've got you covered with the most popular tools and technologies used
			in workforces globally. Read a succesfull story of how we built a comprehensive
			product for one of our clients, and how we did it behind th scenes.
		</p>

		<a
			href="/projects/something"
			class="p-4 block gap-6 mx-auto rounded-lg bg-gray-700/60 max-w-xs mt-8 border-t-4 ease-in-out duration-200 transition-transform border-[#EFF24C] sm:hover:scale-105 sm:flex sm:items-center sm:max-w-lg"
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
</Section>

<!-- Instructions section on how to get building your team if you havent already clicked on of the previous buttons -->

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
				Temporibus, ipsum quibusdam earum aperiam debitis odit dolorem
				veritatis qui praesentium voluptatem?
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
				Temporibus, ipsum quibusdam earum aperiam debitis odit dolorem
				veritatis qui praesentium voluptatem?
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
				Temporibus, ipsum quibusdam earum aperiam debitis odit dolorem
				veritatis qui praesentium voluptatem?
			</span>
			<GitDeploy slot="svg" />
		</Step>
	</Carousel>
</div>

<div
	class="hidden lg:max-w-screen-lg lg:mx-auto lg:flex lg:flex-col lg:gap-6 lg:mt-10 lg:bg-gray-500/40 lg:py-6 lg:pl-28 lg:pr-6 lg:-z-20 lg:rounded-xl lg:relative"
>
	<div>
		<StepTitle
			num={1}
			title="Choose your path"
			class="text-purple-light from-purple-light to-purple-dark"
		/>
		<p class="mt-3">
			Figure out what you want to acheive and the skills needed to
			accomplish such a task. Start by filtering through our team members
			to pinpoint and/or discover your ideal candidates. Or contact us
			immediatly to get reccomendations and an instant quote.
		</p>
	</div>
	<div>
		<StepTitle
			num={2}
			title="Evaluate options"
			class="text-teal-light from-teal-light to-teal-dark"
		/>
		<p class="mt-3">
			Look deep into the detailed information we provide on each of our
			team members. Evaluate our developers' projects, skill sets, social
			media, and more by clicking on their profile preview and exploring
			what they have to offer.
		</p>
	</div>
	<div>
		<StepTitle
			num={3}
			title="Get speedy results"
			class="text-pink-light from-pink-light to-pink-dark"
		/>
		<p class="mt-3">
			Contact us to schedule a virtual meeting for more information on
			pricing and next steps. We'll be happy to help you get started
			quickly and neatly without skipping a beat. Then watch our
			developers give the boost your project needs.
		</p>
	</div>
	<div
		class="absolute rotate-90 flex my-auto -left-48 top-0 bottom-0 h-[2.7rem]"
	>
		<GitCommit />
		<GitMerge />
		<GitDeploy />
	</div>
</div>

<Button href="/developers" class="mt-8 mx-auto">Explore Developers</Button>
