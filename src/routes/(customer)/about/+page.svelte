<script lang="ts">
	import Hero from "$lib/components/Hero.svelte";
	import Text from "$lib/components/Text.svelte";
	import Header from "$lib/components/Header.svelte";
	import Stat from "$lib/components/about/Stat.svelte";
	import Member from "$lib/components/about/Member.svelte";
	import Section from "$lib/components/index/Section.svelte";
</script>

<svelte:head>
	<title>About</title>
</svelte:head>

<Hero
	class="from-green-light to-green-dark"
	title="A new era of collaboration and teamwork"
	src="/assets/about/about.webm"
>
	Explore what achievements we've
	<strong>accomplished</strong> and how we did it.
</Hero>

<Section>
	<Header>Where it all began</Header>

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
	<Header>A fully-fueled rocketship already blasting off</Header>

	<div class="flex flex-col gap-8 mt-8">
		<Stat
			title="Constantly Expanding"
			amount={50}
			postFix="+"
			caption="members and counting"
			class="before:bg-pink-dark"
		>
			AI Camp's Team Tomorrow provides motivated students with internships
			and the opportunity to work for external companies. Through this
			program, passionate students learn by doing and gain real job
			experience while attending school. These top junior developers are
			ready for real work experience and have the skills to do it yet
			don't have an open door to the industry. Team Tomorrow creates this
			door and allows these students to show their true professionalism.
		</Stat>

		<Stat
			title="Proof In Profit"
			amount={70}
			postFix="K"
			caption="single-project revenue"
			class="before:bg-purple-dark"
			side="right"
		>
			Hippo2 is our custom-built internal and customer-facing interface
			that facilitates course registration, dashboard, automated
			communication, back office, and other operations that are vital
			towards helping AI Camp generate millions in revenue annually.
		</Stat>

		<Stat
			title="Multiple Partnerships"
			amount={100}
			postFix="+"
			caption="partnerships with big tech"
			class="before:bg-teal-dark"
		>
			Today, AI is helping us make drugs, get to work, and fill out
			paperwork. Tomorrow, AI will be composing our music, delivering our
			goods, and more. We believe it's critical to prepare for tomorrow by
			learning about AI and expanding our knowledge as a team. We strive
			toward being one of the best knowledge bases out there, with our
			members constantly exercizing and practicing their skills on several
			different proejcts with multiple different companies. After only a
			few years, we've contracted 100+ of our developers out and learned
			from the best.
		</Stat>

		<Stat
			title="Always Innovating"
			amount={500}
			postFix="+"
			caption="projects made by students"
			class="before:bg-blue-dark"
			side="right"
		>
			Our students build their foundation in core technical skills by
			utilize things like DevOps, best practices, analytics and AI fields
			like computer vision, natural language processing, and analytics to
			create revolutionary products deployed in multiple fields. However,
			Team Tomorrow doesn't stop there. Our developers apply their
			knowledge and experience to build pipelines, data dashboards, AI
			models, advanced web infrastructure, and more for companies like
			yours. Making sure to build stable and reliable platforms and
			services that follow the best practices in the industry.
		</Stat>
	</div>
</Section>

<Section>
	<Header>The mission that brought us here</Header>

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
	<Header>Meet the ones behind it all</Header>

	<div
		class="grid grid-cols-2 gap-6 pt-10 max-w-xl mx-auto md:gap-14 lg:grid-cols-4"
	>
		<Member
			src="/assets/about/alex.webp"
			name="Alex Duffy"
			pos="Head of Product"
		/>
		<Member
			src="/assets/about/michael.webp"
			name="Michael Ke Zhang"
			pos="Co-Founder"
		/>
		<Member
			src="/assets/about/richard.webp"
			name="Richard Hsu"
			pos="Co-Founder"
		/>
		<Member
			src="/assets/about/ying.webp"
			name="Ying Jiang"
			pos="Co-Founder"
		/>
	</div>
</Section>

<Section>
	<Header>Innovation moves the world and we're all for it</Header>

	<Text>
		Here at Team Tomorrow, we make the future and are here to help build
		your company a brighter tomorrow. Our developers undergo rigorous
		curriculum and hands-on professional training to ensure they are ready
		to overcome any challenge. Now the only question is,
		<strong>are you?</strong>
	</Text>
</Section>
