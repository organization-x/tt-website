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
	<TextHeader>A fully-fueled rocketship already blasting off.</TextHeader>

	<!-- TODO: Put actual info in stat counters -->

	<div class="flex flex-col gap-8 mt-8">
		<Stat
			title="50+ TT members"
			statAmount={50}
			statPostFix="+"
			delay={1000}
			statName="50+ TT members"
			class="before:bg-pink-dark"
		>
			Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam
			reprehenderit blanditiis illum dignissimos voluptatem hic iure et
			quas neque laboriosam?
			<a href="https://www.ai-camp.org/student-products">Test</a>
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
			Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam
			reprehenderit blanditiis illum dignissimos voluptatem hic iure et
			quas neque laboriosam?
		</Stat>
		<Stat
			title="10+ external company partnerships"
			statAmount={10}
			statPostFix="+"
			delay={2000}
			statName="Where we apply a variety of technical fields: AI, ML, Web Dev, Healthcare, 3D printing"
			class="before:bg-pink-dark"
		>
			Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam
			reprehenderit blanditiis illum dignissimos voluptatem hic iure et
			quas neque laboriosam?
		</Stat>
		<Stat
			title="250+ projects"
			statAmount={250}
			statPostFix="+"
			delay={1000}
			statName="made by students to help gain technical and proffesional skills"
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
		<Member name="Alex Duffy" pos="Head of Product">
			<MemberImage
				src="/assets/about/alex.webp"
				alt="Alex Duffy from Team Tomorrow"
				width={200}
				height={200}
			/>
		</Member>
		<Member name="Michael Ke Zhang" pos="Co Founder">
			<MemberImage
				src="/assets/about/michael.webp"
				alt="Michael Ke Zhang from Team Tomorrow"
				width={200}
				height={200}
			/>
		</Member>
		<Member name="Richard Hsu" pos="Co Founder">
			<MemberImage
				src="/assets/about/richard.webp"
				alt="Jackson Choyce from Team Tomorrow"
				width={200}
				height={200}
			/>
		</Member>
		<Member name="Ying Jiang" pos="Co Founder">
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
