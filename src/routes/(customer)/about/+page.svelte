<script lang="ts">
	import Hero from "$lib/components/Hero.svelte";
	import Text from "$lib/components/Text.svelte";
	import Stat from "$lib/components/about/Stat.svelte";
	import Member from "$lib/components/about/Member.svelte";
	import Section from "$lib/components/index/Section.svelte";
	import TextHeader from "$lib/components/TextHeader.svelte";
</script>

<svelte:head>
	<title>About</title>
</svelte:head>

<Hero
	class="from-green-light to-green-dark"
	title="A new era of collaboration and teamwork."
	src="/assets/about/about.webm"
>
	Explore what achievements we've
	<strong>accomplished</strong> and how we did it.
</Hero>

<Section>
	<TextHeader>Where it all began.</TextHeader>

	<Text>
		AI Camp was founded to revolutionize AI education around the world. In
		doing so, we have helped thousands of students prepare for university,
		industry, and oftentimes both. Our superpower is our unique teaching
		approach. It is a fusion of the world's best instructors (Stanford, CMU,
		etc...) and small class sizes that makes AI education intuitive,
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
			title="Bountiful"
			amount={10}
			postFix="M"
			caption="in revenue."
			class="before:bg-pink-dark"
		>
			Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam
			reprehenderit blanditiis illum dignissimos voluptatem hic iure et
			quas neque laboriosam?
		</Stat>
		<Stat
			title="Bountiful"
			amount={10}
			postFix="M"
			caption="in revenue."
			class="before:bg-pink-dark"
			side="right"
		>
			Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam
			reprehenderit blanditiis illum dignissimos voluptatem hic iure et
			quas neque laboriosam?
		</Stat>
		<Stat
			title="Bountiful"
			amount={100}
			postFix="M"
			caption="in revenue."
			class="before:bg-pink-dark"
		>
			Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam
			reprehenderit blanditiis illum dignissimos voluptatem hic iure et
			quas neque laboriosam?
		</Stat>
		<Stat
			title="Bountiful"
			amount={10}
			postFix="M"
			caption="in revenue."
			class="before:bg-pink-dark"
			side="right"
		>
			Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam
			reprehenderit blanditiis illum dignissimos voluptatem hic iure et
			quas neque laboriosam?
		</Stat>
	</div>
</Section>

<Section>
	<TextHeader>The mission that brought us here.</TextHeader>

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

<Section filled={true}>
	<TextHeader>Meet the masters of their craft.</TextHeader>

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
			pos="Co Founder"
		/>
		<Member
			src="/assets/about/richard.webp"
			name="Richard Hsu"
			pos="Co Founder"
		/>
		<Member
			src="/assets/about/ying.webp"
			name="Ying Jiang"
			pos="Co Founder"
		/>
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
