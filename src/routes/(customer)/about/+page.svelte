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
		Explore what achievements we've
		<strong>accomplished</strong> and how we did it.
	</PageCaption>
</Hero>

<Section>
	<TextHeader>Where it all began.</TextHeader>

	<Text>
		Our main goal at AI Camp is to revolutionize AI education around the
		globe. In doing so, we have helped thousands of students prepare for
		university and industry levels. Our unique teaching approach, using the
		world's best instructors to teach our small class sizes, makes AI
		education intuitive, accessible, and successful. At AI Camp, we teach
		our students to learn by doing. They build impressive AI products,
		develop in-demand skills, and forge powerful bonds with their mentors,
		advisors, and teammates. AI camp is in the business of providing
		opportunity. A maxim we use to unify us is that we are only as great as
		the doors we open.
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
			AI Camp’s Team Tomorrow provides motivated students with internships
			and the opportunity to work for external companies. Through this
			program, students learn by doing and gain real job experience while
			attending school.
			<br />
			<a href="/developers" class="text-teal-light">Developers</a>
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
			Hippo2 is our custom-built internal and customer-facing interface
			that facilitates course registration, dashboard, automated
			communication, back office, and other operations that are vital
			towards helping AI Camp generate millions in revenue annually.
			<br />
			<a href="/projects" class="text-teal-light">Projects</a>
		</Stat>
		<Stat
			title="10+ external company partnerships"
			statAmount={10}
			statPostFix="+"
			delay={2000}
			statName="Where we've applied our skills in AI, Machine Learning, Healthcare, 3D printing, and more
			"
			class="before:bg-pink-dark"
		>
			Today, AI is helping us make drugs, get to work, and fill out
			paperwork. Tomorrow, AI will be composing our music, delivering our
			goods, and more. We believe it's critical to prepare for tomorrow,
			learning about AI, and expanding our knowledge as a team.
			<br />
			<a href="/" class="text-teal-light">Landing Page</a>
		</Stat>
		<Stat
			title="500+ projects"
			statAmount={500}
			statPostFix="+"
			delay={1000}
			statName="Projects made by students to help gain technical and professional skills"
			class="before:bg-pink-dark"
			side="right"
		>
			Our students build their foundation in core technical skills by
			utilizing tools like Python, computer vision, natural language
			processing, and data analytics to create revolutionary products
			deployed live on the web. However, Team Tomorrow doesn’t stop there.
			TT developers apply their knowledge and experience in AI, ML,
			software engineering, and product design to build pipelines, data
			dashboards, AI models, and more for companies like yours.
			<br />
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
		We have experienced first-hand that our traditional education did not
		prepare us for the real world. Even though we had advanced degrees from
		top universities, the job market was tough for us as we did not know
		what jobs were available, what to learn, or where to find help. In
		addition, college tuition has skyrocketed. Student debt in the U.S. has
		exceeded 1.6 trillion dollars, with the average student having $35,000
		of debt by the time they graduate. Making matters worse, 50% of
		graduating students are unable to find a job with their degree. We
		believed there had to be a better way, so we founded this camp to help
		students prepare for the real world. We hope that AI Camp can serve as
		an early intervention in students' lives so that they can design the
		lives they want to have. Our students not only learn AI but how also how
		to pick a major, how to learn, network, and eventually become leaders in
		their chosen fields.
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
		Here at Team Tomorrow, we make the future and are here to help build
		your company a brighter tomorrow. Our developers undergo rigorous
		curriculum and hands-on professional training to ensure they are ready
		to rise to the challenge. Now the only question is,
		<strong>are you?</strong>
	</Text>
</Section>
