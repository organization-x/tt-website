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
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<PageGradient />

<div
	class="px-4 mx-auto max-w-screen-xl lg:flex lg:mt-20 lg:justify-between lg:px-6 xl:px-10"
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
			class="p-4 block gap-6 mx-auto rounded-lg bg-gray-700/60 max-w-lg mt-8 border-t-4 ease-in-out duration-200 transition-transborder border-[#EFF24C] hover:scale-105 hover:border-red-dark"
		>
			<img
				src="/blog.webp"
				alt="Random shapes and colors in the formation of a hallway"
				loading="lazy"
				class="rounded-lg"
			/>
			<h1 class="font-semibold text-2xl mt-4">Blog Post</h1>
			<p class="leading-5 mt-2">
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Com qui
				rem et unde corporis placeat.
			</p>
		</a>
	</div>

	<MajorHeader>
		Explore
		<GradientText class="from-green-light to-green-dark"
			>Curated</GradientText
		>
		Teams
	</MajorHeader>

	<MajorCaption>
		Connect with us and let us hand pick
		<strong>exclusive developers</strong>
		to make your product soar.
	</MajorCaption>

	<div class="bg-gray-500/40 py-2 mt-6 rounded-lg max-w-lg mx-auto">
		<img
			class="w-full"
			src="/developers.webp"
			alt="Developers and their associated skills"
			loading="lazy"
		/>
	</div>

	<Button href="/contact" class="mt-8 mx-auto">Contact Us</Button>

	<TextHeader>So, where do I get started?</TextHeader>

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
			<svg
				slot="svg"
				class="w-full mt-3"
				viewBox="0 0 157 30"
				fill="none"
			>
				<path
					d="M82.25 18C82.25 20.3472 80.3472 22.25 78 22.25C75.6528 22.25 73.75 20.3472 73.75 18C73.75 15.6528 75.6528 13.75 78 13.75C80.3472 13.75 82.25 15.6528 82.25 18Z"
					stroke="white"
					stroke-width="1.5"
				/>
				<path
					d="M70.5 18H1"
					stroke="white"
					stroke-width="1.5"
					stroke-linecap="square"
				/>
				<path
					d="M155.5 18H86"
					stroke="white"
					stroke-width="1.5"
					stroke-linecap="square"
				/>
				<path
					d="M78 12.5V9"
					stroke="white"
					stroke-width="1.5"
					stroke-linecap="square"
				/>
				<path
					d="M78 26.5V23"
					stroke="white"
					stroke-width="1.5"
					stroke-linecap="square"
				/>
			</svg>
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
			<svg
				slot="svg"
				class="w-full mt-3"
				viewBox="0 0 157 30"
				fill="none"
			>
				<path
					d="M53.5 18H26"
					stroke="white"
					stroke-width="1.5"
					stroke-linecap="square"
				/>
				<path
					d="M155.5 18H42.5"
					stroke="white"
					stroke-width="1.5"
					stroke-linecap="square"
				/>
				<path
					d="M56 5C47 4.99998 42.5 18 26 18H1"
					stroke="white"
					stroke-width="1.5"
					stroke-linecap="square"
				/>
				<path
					d="M69.5 5H155.5"
					stroke="white"
					stroke-width="1.5"
					stroke-linecap="square"
				/>
				<path
					d="M67.25 5C67.25 7.34721 65.3472 9.25 63 9.25C60.6528 9.25 58.75 7.34721 58.75 5C58.75 2.65279 60.6528 0.75 63 0.75C65.3472 0.75 67.25 2.65279 67.25 5Z"
					stroke="white"
					stroke-width="1.5"
				/>
			</svg>
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
			<svg
				slot="svg"
				class="w-full mt-3"
				viewBox="0 0 156 30"
				fill="none"
			>
				<path
					d="M39.75 18C39.75 20.3472 37.8472 22.25 35.5 22.25C33.1528 22.25 31.25 20.3472 31.25 18C31.25 15.6528 33.1528 13.75 35.5 13.75C37.8472 13.75 39.75 15.6528 39.75 18Z"
					stroke="white"
					stroke-width="1.5"
				/>
				<path
					d="M94.75 18C94.75 20.3472 92.8472 22.25 90.5 22.25C88.1528 22.25 86.25 20.3472 86.25 18C86.25 15.6528 88.1528 13.75 90.5 13.75C92.8472 13.75 94.75 15.6528 94.75 18Z"
					stroke="white"
					stroke-width="1.5"
				/>
				<path
					d="M28.5 18H1"
					stroke="white"
					stroke-width="1.5"
					stroke-linecap="square"
				/>
				<path
					d="M83 18H42.5"
					stroke="white"
					stroke-width="1.5"
					stroke-linecap="square"
				/>
				<path
					d="M139 18H98.5"
					stroke="white"
					stroke-width="1.5"
					stroke-linecap="square"
				/>
				<path
					d="M90.5 12.5V9"
					stroke="white"
					stroke-width="1.5"
					stroke-linecap="square"
				/>
				<path
					d="M90.5 26.5V23"
					stroke="white"
					stroke-width="1.5"
					stroke-linecap="square"
				/>
				<path
					d="M31 12.5001C25 4.99995 17.5 5 1 5"
					stroke="white"
					stroke-width="1.5"
					stroke-linecap="square"
				/>
				<path
					d="M144.835 18.1788L146.099 18.7132C146.25 18.4109 146.407 18.1195 146.569 17.8388C146.731 17.5581 146.91 17.2774 147.104 16.9968L146.196 16.8186L144.835 18.1788ZM147.137 19.5229L148.985 21.3526C149.439 21.1799 149.925 20.9154 150.444 20.5592C150.963 20.203 151.449 19.7981 151.903 19.3447C152.66 18.5891 153.251 17.7498 153.679 16.8271C154.105 15.9039 154.292 15.0536 154.238 14.2764C153.459 14.2224 152.606 14.4085 151.676 14.8347C150.747 15.2613 149.904 15.8525 149.147 16.6081C148.693 17.0615 148.288 17.5473 147.931 18.0655C147.574 18.5837 147.31 19.0695 147.137 19.5229ZM150.022 18.4703C149.774 18.222 149.65 17.917 149.65 17.5551C149.65 17.1937 149.774 16.8888 150.022 16.6405C150.271 16.3922 150.579 16.2681 150.946 16.2681C151.314 16.2681 151.622 16.3922 151.871 16.6405C152.119 16.8888 152.243 17.1937 152.243 17.5551C152.243 17.917 152.119 18.222 151.871 18.4703C151.622 18.7186 151.314 18.8428 150.946 18.8428C150.579 18.8428 150.271 18.7186 150.022 18.4703ZM150.33 23.6682L151.692 22.308L151.514 21.4012C151.233 21.5955 150.952 21.7709 150.671 21.9272C150.39 22.0839 150.098 22.2379 149.795 22.389L150.33 23.6682ZM155.405 13.0943C155.61 14.4005 155.483 15.6715 155.024 16.9074C154.565 18.1437 153.773 19.3231 152.649 20.4458L152.973 22.0489C153.016 22.2648 153.005 22.4754 152.941 22.6805C152.876 22.8856 152.768 23.0637 152.616 23.2148L149.893 25.9352L148.531 22.7452L145.759 19.9763L142.565 18.6161L145.272 15.8957C145.424 15.7445 145.605 15.6366 145.816 15.5718C146.026 15.507 146.24 15.4962 146.456 15.5394L148.061 15.8633C149.185 14.7406 150.363 13.9471 151.595 13.4829C152.827 13.0187 154.097 12.8892 155.405 13.0943ZM143.716 22.0327C144.094 21.6549 144.556 21.4632 145.102 21.4576C145.648 21.4524 146.11 21.6387 146.488 22.0166C146.866 22.3944 147.053 22.8558 147.047 23.4007C147.042 23.9461 146.85 24.4077 146.472 24.7855C146.202 25.0554 145.751 25.2875 145.119 25.4818C144.486 25.6761 143.613 25.8489 142.5 26C142.651 24.8881 142.824 24.0163 143.019 23.3845C143.213 22.7532 143.446 22.3026 143.716 22.0327ZM144.64 22.9395C144.532 23.0475 144.424 23.2446 144.316 23.5309C144.208 23.8168 144.132 24.1054 144.089 24.3969C144.381 24.3537 144.67 24.281 144.956 24.1786C145.243 24.0759 145.44 23.9705 145.548 23.8625C145.678 23.733 145.748 23.5765 145.759 23.3929C145.769 23.2094 145.71 23.0529 145.58 22.9234C145.451 22.7938 145.294 22.7316 145.11 22.7368C144.926 22.7424 144.77 22.81 144.64 22.9395Z"
					fill="white"
				/>
			</svg>
		</Step>
	</Carousel>

	<Button href="/developers" class="mt-8 mx-auto">Takeoff</Button>
</div>
