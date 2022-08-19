<script lang="ts">
	import PageTitle from "$lib/components/PageTitle.svelte";
	import PageCaption from "$lib/components/PageCaption.svelte";
	import TextHeader from "$lib/components/TextHeader.svelte";
	import Hero from "$lib/components/Hero.svelte";
	import Button from "$lib/components/Button.svelte";
	import Section from "$lib/components/index/Section.svelte";
</script>

<svelte:head>
	<title>About</title>
</svelte:head>

<Hero>
	<PageTitle class="from-green-light to-green-dark">
		Forming a new era of collaboration and teamwork.
	</PageTitle>

	<PageCaption>
		Team Tomorrow isn't an ordinary name. Explore what acheivements we've
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

	<p class="mt-4">
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
	</p>
</Section>

<Section filled={true}>
	<TextHeader>A fully-fueled rocketship already blasting off.</TextHeader>
	<!-- TODO: Stat counters seen on other sites, actual information to put on this page, board members -->
</Section>
