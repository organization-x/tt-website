<script lang="ts">
	import PageTitle from "$lib/components/PageTitle.svelte";
	import PageCaption from "$lib/components/PageCaption.svelte";
	import TextHeader from "$lib/components/TextHeader.svelte";
	import Hero from "$lib/components/Hero.svelte";
	import Button from "$lib/components/Button.svelte";
	import Section from "$lib/components/index/Section.svelte";
	import Stat from "$lib/components/about/Stat.svelte";
	import Member from "$lib/components/about/Member.svelte";
	import MemberImage from "$lib/components/about/MemberImage.svelte";
	import Text from "$lib/components/about/Text.svelte";
</script>

<svelte:head>
	<title>About</title>
</svelte:head>

<Hero>
	<PageTitle class="from-green-light to-green-dark">
		A new era of collaboration and teamwork.
	</PageTitle>

	<PageCaption>
		Explore what acheivements we've
		<strong>accomplished</strong> and how we did it.
	</PageCaption>

	<img
		slot="image"
		height="263"
		width="500"
		src="/about.webp"
		alt="Macbook slight cracked open eminating light"
	/>
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
	<!-- TODO: Stat counters seen on other sites, actual information to put on this page, board members -->

	<div class="flex flex-col gap-8 mt-8">
		<Stat
			title="Bountiful"
			statAmount="10 Million"
			statName="in revenue."
			class="before:bg-pink-dark"
		>
			Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam
			reprehenderit blanditiis illum dignissimos voluptatem hic iure et
			quas neque laboriosam?
		</Stat>
		<Stat
			title="Bountiful"
			statAmount="10 Million"
			statName="in revenue."
			class="before:bg-pink-dark"
			side="right"
		>
			Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam
			reprehenderit blanditiis illum dignissimos voluptatem hic iure et
			quas neque laboriosam?
		</Stat>
		<Stat
			title="Bountiful"
			statAmount="10 Million"
			statName="in revenue."
			class="before:bg-pink-dark"
		>
			Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam
			reprehenderit blanditiis illum dignissimos voluptatem hic iure et
			quas neque laboriosam?
		</Stat>
		<Stat
			title="Bountiful"
			statAmount="10 Million"
			statName="in revenue."
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

	<!-- Image of michael -->
</Section>

<!-- TODO: Fix grid sizing -->
<Section filled={true}>
	<TextHeader>Meet the masters of their craft.</TextHeader>

	<div
		class="grid grid-cols-2 gap-6 pt-10 max-w-lg mx-auto md:gap-12 lg:grid-cols-4"
	>
		<Member name="Jackson Choyce" pos="Company Manager">
			<MemberImage
				src="./jackson.webp"
				alt="Jackson Choyce from Team Tomorrow"
				width={200}
				height={200}
			/>
		</Member>
		<Member name="Jackson Choyce" pos="Company Manager">
			<MemberImage
				src="./jackson.webp"
				alt="Jackson Choyce from Team Tomorrow"
				width={200}
				height={200}
			/>
		</Member>
		<Member name="Jackson Choyce" pos="Company Manager">
			<MemberImage
				src="./jackson.webp"
				alt="Jackson Choyce from Team Tomorrow"
				width={200}
				height={200}
			/>
		</Member>
		<Member name="Jackson Choyce" pos="Company Manager">
			<MemberImage
				src="./jackson.webp"
				alt="Jackson Choyce from Team Tomorrow"
				width={200}
				height={200}
			/>
		</Member>
		<Member name="Jackson Choyce" pos="Company Manager">
			<MemberImage
				src="./jackson.webp"
				alt="Jackson Choyce from Team Tomorrow"
				width={200}
				height={200}
			/>
		</Member>
		<Member name="Jackson Choyce" pos="Company Manager">
			<MemberImage
				src="./jackson.webp"
				alt="Jackson Choyce from Team Tomorrow"
				width={200}
				height={200}
			/>
		</Member>
		<Member name="Jackson Choyce" pos="Company Manager">
			<MemberImage
				src="./jackson.webp"
				alt="Jackson Choyce from Team Tomorrow"
				width={200}
				height={200}
			/>
		</Member>
		<Member name="Jackson Choyce" pos="Company Manager">
			<MemberImage
				src="./jackson.webp"
				alt="Jackson Choyce from Team Tomorrow"
				width={200}
				height={200}
			/>
		</Member>
	</div>
</Section>

<Section>
	<TextHeader>In conclusion.</TextHeader>

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
