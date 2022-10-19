<script lang="ts">
	import Hero from "$lib/components/Hero.svelte";
	import Text from "$lib/components/Text.svelte";
	import Stat from "$lib/components/about/Stat.svelte";
	import PageTitle from "$lib/components/PageTitle.svelte";
	import Member from "$lib/components/about/Member.svelte";
	import Section from "$lib/components/index/Section.svelte";
	import TextHeader from "$lib/components/TextHeader.svelte";
	import PageCaption from "$lib/components/PageCaption.svelte";
	import MemberImage from "$lib/components/about/MemberImage.svelte";
</script>

<svelte:head>
	<title>About</title>
</svelte:head>

<Hero src="/assets/about/about.webm">
	<PageTitle class="from-green-light to-green-dark">
		A new era of collaboration and teamwork.
	</PageTitle>

	<PageCaption>
		Explore what acheivements we've
		<strong>accomplished</strong> and how we did it.
	</PageCaption>
</Hero>

<Section>
	<TextHeader>Where it all began.</TextHeader>

	<Text>
		AI Camp was founded to revolutionize AI education around the world. In
		doing so, we have helped thousands of students prepare for university,
		industry, and oftentimes both. Our superpower is our unique teaching
		approach. It is a fusion of the world's best instructors (Stanford, CMU,
		etc.) and small class sizes that makes AI education intuitive,
		accessible, and successful. We don't teach from A to Z. Instead, our
		students learn by doing. They build impressive AI products, develop
		in-demand skills, and forge powerful connections with our mentors and
		advisors. AI camp is in the business of providing opportunity. We are
		unified by the maxim that we are only as great as the doors we open.
	</Text>
</Section>

<Section filled={true}>
	<TextHeader>A fully-fueled rocketship already blasting off.</TextHeader>

	<!-- TODO: Put actual info in stat counters -->

	<div class="flex flex-col gap-8 mt-8">
		<Stat
			title="50+ Team Tomorrow members"
			statAmount={50}
			statPostFix="+"
			delay={1000}
			statName="50+ Team Tomorrow members"
			class="before:bg-pink-dark"
		>
			AI Camp’s Team Tomorrow provides internships to motivated students
			and gives them the chance to work for external companies. We believe
			that the best way to learn is by doing, and so through this program,
			students can learn the real way that professionals learn, and gain
			real experience at a job while still attending school.
			<a href="/developers" class="text-teal-light">Developers-Page</a>
		</Stat>
		<Stat
			title="$70k+ revenue"
			statAmount={70}
			statPostFix="k"
			delay={1000}
			statName="Generated through projects like Hippo2"
			class="before:bg-pink-dark"
			side="right"
		>
			Hippo2 is a custom system that a group of 14-19 year-olds built from
			the ground up in the span of 3 weeks with collaboration across
			interdisciplinary teams from engineering to design to create a
			cohesive and seamless experience for customers throughout their
			journey at AI Camp. It features custom dashboards for students and
			parents, account creation and linking systems, course registration
			flows, a full-fledged back office, analytics, and more.
			<a href="/projects" class="text-teal-light">Projects-Page</a>
		</Stat>
		<Stat
			title="10+ external company partnerships"
			statAmount={10}
			statPostFix="+"
			delay={2000}
			statName="We've applied our skills in AI, Machine Learning, Healthcare, 3D printing, and more
			"
			class="before:bg-pink-dark"
		>
			Today, AI is helping us making drugs, recommending optimum routes
			for us to navigate, and helping doctors to fill the paperwork.
			Tomorrow, AI can compose music for us and drive long winding roads
			to deliver goods. Learning AI is a good way to master your own
			future.

			<a href="/" class="text-teal-light">Landing-Page</a>
		</Stat>
		<Stat
			title="250+ projects"
			statAmount={250}
			statPostFix="+"
			delay={1000}
			statName="Made by students to help gain technical and professional skills"
			class="before:bg-pink-dark"
			side="right"
		>
			Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam
			reprehenderit blanditiis illum dignissimos voluptatem hic iure et
			quas neque laboriosam?
			<a
				href="https://www.ai-camp.org/student-products"
				class="text-teal-light">AI Camp Student Products</a
			>
		</Stat>
	</div>
</Section>

<Section>
	<TextHeader>The mission that brought us here.</TextHeader>

	<Text>
		We experienced first-hand that our traditional education did not prepare
		us for the real world. Even though we had advanced degrees from top
		universities, the job market was tough us as we did not what jobs were
		available, what to learn, or who could help. In addition, college
		tuition has skyrocketed. Student debt in the U.S. has exceeded 1.6
		trillion dollars with the average student having $35,000 of debt by the
		time they graduate. To make matters worse 50% of graduating students are
		unable to find a job with their degree. This must change. We founded
		this camp to help students prepare for the real world. We hope that AI
		Camp can serve as early intervention in a student's life so that they
		are able to design the lives they want to have. Our students not only
		learn AI but how also how to pick a major, how to learn, network, and
		eventually become leaders in their chosen fields.
	</Text>
</Section>

<Section filled={true}>
	<TextHeader>Meet the masters of their craft.</TextHeader>

	<div
		class="grid grid-cols-2 gap-6 pt-10 max-w-xl mx-auto md:gap-14 lg:grid-cols-4"
	>
		<Member name="Alex Duffy" pos="Head of Product">
			<MemberImage
				src="/assets/about/alex.webp"
				alt="Alex Duffy from Team Tomorrow"
				width={200}
				height={200}
			/>
		</Member>
		<Member name="Michael Ke Zhang" pos="Co-founder">
			<MemberImage
				src="/assets/about/michael.webp"
				alt="Michael Ke Zhang from Team Tomorrow"
				width={200}
				height={200}
			/>
		</Member>
		<Member name="Richard Hsu" pos="Co-founder">
			<MemberImage
				src="/assets/about/richard.webp"
				alt="Jackson Choyce from Team Tomorrow"
				width={200}
				height={200}
			/>
		</Member>
		<Member name="Ying Jiang" pos="Co-founder">
			<MemberImage
				src="/assets/about/ying.webp"
				alt="Ying Jiang from Team Tomorrow"
				width={200}
				height={200}
			/>
		</Member>
	</div>
</Section>

<Section>
	<TextHeader>Innovation moves the world and we're all for it.</TextHeader>

	<Text>
		Lorem ipsum dolor sit amet, consectetur adipisicing elit. Magni fuga,
		animi voluptatem temporibus earum ea illum hic suscipit nisi, accusamus
		molestiae aliquid minus similique facere vitae doloribus placeat
		aspernatur ullam quo dolore excepturi nostrum delectus consequatur?
		Vitae, earum repellendus ipsum facilis quisquam possimus delectus
		doloribus eius veritatis iste voluptatum consequuntur odit et, esse at
		ut velit, dolore quod? Eius, maxime? Ipsum ex placeat tempora, beatae
		nam delectus vero nihil odit consequuntur veritatis fugiat velit
		molestias, autem laboriosam cupiditate? Eius officiis eaque asperiores
		consequatur. Iste, fugit ipsa.
	</Text>
</Section>
