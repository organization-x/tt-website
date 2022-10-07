<script lang="ts">
	import Text from "$lib/components/Text.svelte";
	import Hero from "$lib/components/Hero.svelte";
	import Button from "$lib/components/Button.svelte";
	import Aws from "$lib/components/icons/Aws.svelte";
	import Cog from "$lib/components/index/Cog.svelte";
	import Step from "$lib/components/index/Step.svelte";
	import React from "$lib/components/icons/React.svelte";
	import Crane from "$lib/components/index/Crane.svelte";
	import PageTitle from "$lib/components/PageTitle.svelte";
	import Python from "$lib/components/icons/Python.svelte";
	import TextHeader from "$lib/components/TextHeader.svelte";
	import Company from "$lib/components/index/Company.svelte";
	import Pytorch from "$lib/components/icons/Pytorch.svelte";
	import DevCard from "$lib/components/index/DevCard.svelte";
	import Project from "$lib/components/index/Project.svelte";
	import Section from "$lib/components/index/Section.svelte";
	import DevText from "$lib/components/index/DevText.svelte";
	import PageCaption from "$lib/components/PageCaption.svelte";
	import MajorHeader from "$lib/components/MajorHeader.svelte";
	import Carousel from "$lib/components/index/Carousel.svelte";
	import GitMerge from "$lib/components/index/GitMerge.svelte";
	import GradientText from "$lib/components/GradientText.svelte";
	import MajorCaption from "$lib/components/MajorCaption.svelte";
	import GitDeploy from "$lib/components/index/GitDeploy.svelte";
	import GitCommit from "$lib/components/index/GitCommit.svelte";
	import DrawnArrow from "$lib/components/index/DrawnArrow.svelte";
	import TensorFlow from "$lib/components/icons/TensorFlow.svelte";
	import JavaScript from "$lib/components/icons/JavaScript.svelte";
	import Annotation from "$lib/components/index/Annotation.svelte";
	import GoogleCloud from "$lib/components/icons/GoogleCloud.svelte";
	import ProjectImage from "$lib/components/index/ProjectImage.svelte";
	import CompanyImage from "$lib/components/index/CompanyImage.svelte";

	// TODO: Actually fill dev data
	const placeholder: App.Developer = {
		position: "Software Engineer",
		user: {
			name: "Jackson Choyce",
			url: "placeholder"
		}
	};
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<!-- TODO: Put Adarsh's proper rendered video here-->

<Hero src="/assets/index/index.webm">
	<PageTitle class="from-teal-light to-teal-dark">
		Grasp the top 1% of junior developers.
	</PageTitle>

	<PageCaption>
		Develop something exciting with skills from low-level mastery to
		meticulous design. Accelerate progress with the backing you need.
		<strong>A great team</strong>.
	</PageCaption>

	<Button href="/contact" class="hidden lg:block lg:mt-6 lg:mx-0">
		Contact Us
	</Button>
</Hero>

<div
	class="mx-auto pb-8 max-w-xs relative lg:mt-32 lg:max-w-screen-xl overflow-hidden"
>
	<Button href="/contact" class="lg:hidden">Contact Us</Button>
	<TextHeader>
		What is
		<GradientText class="from-purple-light to-purple-dark">
			Team Tomorrow?
		</GradientText>
	</TextHeader>
	<DrawnArrow />
</div>

<p
	class="my-8 px-4 max-w-lg mx-auto sm:px-10 lg:px-6 lg:mt-0 lg:text-center lg:max-w-2xl xl:px-10"
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

	<div class="mt-8 flex flex-col gap-6 lg:grid lg:grid-cols-2 relative">
		<Company icons={[GoogleCloud, Python, TensorFlow, Pytorch]}>
			<CompanyImage
				slot="img"
				src="/assets/index/healthcare.webp"
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
				src="/assets/index/obico.webp"
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
				src="/assets/index/ethereum.webp"
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
				src="/assets/index/imprint.webp"
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

	<Button href="/contact">Contact Us</Button>
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

	<Button href="/projects" class="my-8">Uncover all our projects</Button>

	<!-- TODO: Actual profile pictures for developers-->

	<Project
		title="Hippo2"
		href="/projects/hippo2"
		developers={[
			{
				position: "Software Engineer",
				user: {
					name: "Alex Nguyen",
					url: "placeholder"
				}
			},
			{
				position: "Engineering Manager",
				user: {
					name: "Alexander Zhou",
					url: "placeholder"
				}
			},
			{
				position: "Product Designer",
				user: {
					name: "Bernice",
					url: "placeholder"
				}
			},
			{
				position: "Software Engineer",
				user: {
					name: "Hyrum",
					url: "placeholder"
				}
			},
			{
				position: "Engineering Manager",
				user: {
					name: "Jackson",
					url: "placeholder"
				}
			},
			{
				position: "Software Engineer",
				user: {
					name: "Joseph",
					url: "placeholder"
				}
			},
			{
				position: "Software Engineer",
				user: {
					name: "Leo",
					url: "placeholder"
				}
			},
			{
				position: "Software Engineer",
				user: {
					name: "Mathan",
					url: "placeholder"
				}
			},
			{
				position: "Software Engineer",
				user: {
					name: "Matthew",
					url: "placeholder"
				}
			},
			{
				position: "Software Engineer",
				user: {
					name: "Ray",
					url: "placeholder"
				}
			},
			{
				position: "Software Engineer",
				user: {
					name: "Sean",
					url: "placeholder"
				}
			},
			{
				position: "Product Manager",
				user: {
					name: "Sricharan",
					url: "placeholder"
				}
			},
			{
				position: "Software Engineer",
				user: {
					name: "Zachary",
					url: "placeholder"
				}
			}
		]}
		icons={[Python, React]}
	>
		Hippo2 is our custom-built internal and customer-facing interface that
		facilitates course registration, dashboard, automated communication,
		back office, and other operations that are vital towards helping AI Camp
		generate millions in revenue annually.
		<ProjectImage
			slot="img"
			src="/assets/index/hippo2.webp"
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
				position: "Software Engineer",
				user: {
					name: "Advay",
					url: "placeholder"
				}
			},
			{
				position: "Software Engineer",
				user: {
					name: "Alex",
					url: "placeholder"
				}
			},
			{
				position: "Engineering Manager",
				user: {
					name: "Alexander",
					url: "placeholder"
				}
			},
			{
				position: "Design and Engineering",
				user: {
					name: "Ansh",
					url: "placeholder"
				}
			},
			{
				position: "Lead Desiner",
				user: {
					name: "Axel",
					url: "placeholder"
				}
			},
			{
				position: "Design an Engineering",
				user: {
					name: "Blake",
					url: "placeholder"
				}
			},
			{
				position: "Engineerig Manager",
				user: {
					name: "Jackson",
					url: "placeholder"
				}
			},
			{
				position: "Product Mnager",
				user: {
					name: "Mitch",
					url: "placeholder"
				}
			},
			{
				position: "Design an Engineering",
				user: {
					name: "Phakawat",
					url: "placeholder"
				}
			},
			{
				position: "Software ngineer",
				user: {
					name: "Rohan",
					url: "placeholder"
				}
			},
			{
				position: "Software ngineer",
				user: {
					name: "Sanjay",
					url: "placeholder"
				}
			},
			{
				position: "Software ngineer",
				user: {
					name: "Zac",
					url: "placeholder"
				}
			}
		]}
		icons={[React]}
	>
		Learning AI seems like an impossible task. In reality, it's not. AI On
		Thumbs is a mobile app that provides an easy way to learn and interact
		with AI just with your phone. It provides easy high-level examples to
		let anyone interested dive right into AI. Made for developers, by
		developers.
		<ProjectImage
			slot="img"
			src="/assets/index/aiot.webp"
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
				position: "Engineering Maager",
				user: {
					name: "Alexander",
					url: "placeholder"
				}
			},
			{
				position: "Software Enginer",
				user: {
					name: "Blake",
					url: "placeholder"
				}
			},
			{
				position: "Designer",
				user: {
					name: "Eegan",
					url: "placeholder"
				}
			},
			{
				position: "Designer",
				user: {
					name: "Ishaan",
					url: "placeholder"
				}
			},
			{
				position: "Engineering Maager",
				user: {
					name: "Jackson",
					url: "placeholder"
				}
			},
			{
				position: "Software Enginer",
				user: {
					name: "Ray",
					url: "placeholder"
				}
			},
			{
				position: "Software Enginer",
				user: {
					name: "Zac",
					url: "placeholder"
				}
			}
		]}
		icons={[Python]}
	>
		Hippo2 is our custom-built internal and customer-facing interface that
		facilitates course registration, dashboard, automated communication,
		back office, and other operations that are vital towards helping AI Camp
		generate millions in revenue annually.
		<ProjectImage
			slot="img"
			src="/assets/index/bot.webp"
			alt="Green robot"
			width={200}
			height={200}
			class="w-24 lg:w-28"
		/>
	</Project>

	<!-- TODO: Actual 4th project -->
	<Project
		title="AI Camp Bot"
		href="/projects/aicbot"
		developers={[
			placeholder,
			placeholder,
			placeholder,
			placeholder,
			placeholder,
			placeholder
		]}
		icons={[Python, TensorFlow]}
	>
		Running a camp with 1,000+ students and multiple mentors is no easy
		task. That's why our developers created a bot to automate huge data
		collection and analytical tracking tasks to make sure AI Camp's summer
		program can run without hurdles.
		<ProjectImage
			slot="img"
			src="/assets/index/bot.webp"
			alt="Green robot"
			width={200}
			height={200}
			class="w-24 lg:w-28"
		/>
	</Project>

	<Button href="/projects" class="mb-12 mt-12">
		Uncover all our projects
	</Button>
</Section>

<Section filled={true}>
	<div class="relative my-12 w-fit mx-auto">
		<Crane />
		<TextHeader>Multiple ways to build your personal workforce.</TextHeader>
		<Cog />
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

	<!-- TODO: Choose actual top 3 devs here -->

	<Carousel amount={3}>
		<DevCard author={placeholder}>
			<li>Worked on 80000 projects.</li>
			<li>Worked on 80000 projects.</li>
			<li>Worked on 80000 projects.</li>
			<li>Worked on 80000 projects.</li>

			<DevText slot="about">
				Lorem, ipsum dolor sit amet consectetur adipisicing elit.
				Perferendis aspernatur distinctio at vero. Hic, possimus itaque
				dolores minima totam quasi.
			</DevText>
		</DevCard>
		<DevCard author={placeholder}>
			<li>Worked on 80000 projects.</li>
			<li>Worked on 80000 projects.</li>
			<li>Worked on 80000 projects.</li>
			<li>Worked on 80000 projects.</li>

			<DevText slot="about">
				Lorem, ipsum dolor sit amet consectetur adipisicing elit.
				Perferendis aspernatur distinctio at vero. Hic, possimus itaque
				dolores minima totam quasi.
			</DevText>
		</DevCard>
		<DevCard author={placeholder}>
			<li>Worked on 80000 projects.</li>
			<li>Worked on 80000 projects.</li>
			<li>Worked on 80000 projects.</li>
			<li>Worked on 80000 projects.</li>

			<DevText slot="about">
				Lorem, ipsum dolor sit amet consectetur adipisicing elit.
				Perferendis aspernatur distinctio at vero. Hic, possimus itaque
				dolores minima totam quasi.
			</DevText>
		</DevCard>

		<div
			slot="alt"
			class="hidden lg:px-20 lg:flex lg:flex-col lg:gap-12 lg:mt-32 lg:max-w-screen-xl"
		>
			<DevCard author={placeholder}>
				<li>Worked on 80000 projects.</li>
				<li>Worked on 80000 projects.</li>
				<li>Worked on 80000 projects.</li>
				<li>Worked on 80000 projects.</li>

				<DevText slot="about">
					Lorem, ipsum dolor sit amet consectetur adipisicing elit.
					Perferendis aspernatur distinctio at vero. Hic, possimus
					itaque dolores minima totam quasi.
				</DevText>
			</DevCard>
			<DevCard author={placeholder}>
				<li>Worked on 80000 projects.</li>
				<li>Worked on 80000 projects.</li>
				<li>Worked on 80000 projects.</li>
				<li>Worked on 80000 projects.</li>

				<DevText slot="about">
					Lorem, ipsum dolor sit amet consectetur adipisicing elit.
					Perferendis aspernatur distinctio at vero. Hic, possimus
					itaque dolores minima totam quasi.
				</DevText>
			</DevCard>
			<DevCard author={placeholder}>
				<li>Worked on 80000 projects.</li>
				<li>Worked on 80000 projects.</li>
				<li>Worked on 80000 projects.</li>
				<li>Worked on 80000 projects.</li>

				<DevText slot="about">
					Lorem, ipsum dolor sit amet consectetur adipisicing elit.
					Perferendis aspernatur distinctio at vero. Hic, possimus
					itaque dolores minima totam quasi.
				</DevText>
			</DevCard>
		</div>
	</Carousel>

	<Button href="/developers" class="mt-4 lg:mt-8">Discover</Button>

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

<Carousel amount={3}>
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
	<div
		slot="alt"
		class="hidden lg:max-w-2xl lg:mx-auto lg:flex lg:flex-col lg:gap-6 lg:mt-10 lg:bg-gray-500/40 lg:py-6 lg:pl-28 lg:pr-6 lg:-z-20 lg:rounded-xl lg:relative xl:max-w-screen-lg"
	>
		<div class="flex flex-col lg:gap-4">
			<Step
				num={1}
				title="Choose your path"
				class="text-purple-light from-purple-light to-purple-dark"
			>
				Figure out what you want to acheive and the skills needed to
				accomplish such a task. Start by filtering through our team
				members to pinpoint and/or discover your ideal candidates. Or
				contact us immediatly to get reccomendations and an instant
				quote.
			</Step>
			<Step
				num={2}
				title="Evaluate options"
				class="text-teal-light from-teal-light to-teal-dark"
			>
				Look deep into the detailed information we provide on each of
				our team members. Evaluate our developers' projects, skill sets,
				social media, and more by clicking on their profile preview and
				exploring what they have to offer.
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
		<div
			class="absolute rotate-90 flex my-auto -left-56 top-0 bottom-0 h-14"
		>
			<GitCommit />
			<GitMerge />
			<GitDeploy />
		</div>
	</div>
</Carousel>

<Button href="/developers" class="mt-8">Explore Developers</Button>
