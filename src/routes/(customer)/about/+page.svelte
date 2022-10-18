<script lang="ts">
	import Hero from "$lib/components/Hero.svelte";
	import Text from "$lib/components/Text.svelte";
	import Stat from "$lib/components/about/Stat.svelte";
	import PageTitle from "$lib/components/PageTitle.svelte";
	import Member from "$lib/components/about/Member.svelte";
	import Section from "$lib/components/index/Section.svelte";
	import TextHeader from "$lib/components/TextHeader.svelte";
	import PageCaption from "$lib/components/PageCaption.svelte";
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
