<script lang="ts">
	import PageTitle from "$lib/components/PageTitle.svelte";
	import PageGradient from "$lib/components/PageGradient.svelte";
	import PageCaption from "$lib/components/PageCaption.svelte";
	import TextHeader from "$lib/components/TextHeader.svelte";
	import Footer from "$lib/components/Footer.svelte";
</script>

<svelte:head>
	<title>About</title>
</svelte:head>

<div class="mx-4">
	<PageGradient />

	<PageTitle class="from-green-light to-green-dark">
		About Team Tomorrow and AI Camp.
	</PageTitle>

	<PageCaption>
		Explore what acheivements we've <strong>accomplished</strong> and how we
		did it.
	</PageCaption>

	<img
		class="mt-6"
		src="/about.webp"
		alt="Brain shape made up of connected nodes"
	/>

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
		consequatur. Iste, fugit ipsa. Qui nulla fugiat quae sequi. Quae, hic.
		Sapiente delectus facere quasi officia laudantium magnam fuga. Labore
		eum magnam, expedita ad, voluptatibus dolore ducimus odit modi amet eos
		sunt quam. Fugit quae dignissimos harum a rem? Perspiciatis temporibus
		reiciendis unde amet nemo omnis deleniti rem odio blanditiis cupiditate
		ducimus, pariatur necessitatibus iusto illo fugiat tenetur repellat et
		aspernatur! Nam sapiente doloribus corrupti voluptatem ducimus eos
		deserunt ex sed quasi corporis qui odit sequi id, vero explicabo error
		dignissimos voluptates a repellat repudiandae cumque iste? Optio vitae
		iure voluptatem quaerat doloremque illo sint vel, facilis beatae, nemo
		dolores eligendi labore reiciendis voluptatibus obcaecati veniam
		corrupti distinctio laborum adipisci impedit, repellat sequi? Ex laborum
		mollitia dolores ipsum.
	</p>
</div>

<Footer />
