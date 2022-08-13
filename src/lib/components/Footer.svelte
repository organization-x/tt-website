<script lang="ts">
	import AICamp from "./AICamp.svelte";
	import FootLink from "./FootLink.svelte";
	import Envelope from "./icons/Envelope.svelte";
	import Instagram from "./icons/Instagram.svelte";
	import YouTube from "./icons/YouTube.svelte";
	import Logo from "./Logo.svelte";
</script>

<footer class="bg-black left-0 p-6 text-xl mt-10">
	<div class="mx-auto max-w-xs">
		<ul class="flex flex-col gap-3">
			<FootLink href="/">Home</FootLink>
			<FootLink href="/about">About</FootLink>
			<FootLink href="/contact">Contact Us</FootLink>
			<FootLink href="/developers">Developers</FootLink>
			<FootLink href="/projects">Projects</FootLink>
			<FootLink href="https://ai-camp.org">AI Camp</FootLink>
		</ul>
		<div class="mt-7 flex justify-between">
			<div class="flex gap-4 items-center">
				<Logo class="w-8 h-8" />
				<AICamp class="w-8 h-8" />
			</div>
			<div class="flex gap-4 items-center">
				<a
					href="https://instagram.com/aicamp1"
					target="_blank"
					rel="noreferrer"
					title="AI Camp Instagram"
				>
					<Instagram class="w-8 h-8" />
				</a>
				<a
					href="https://www.youtube.com/channel/UCUGJzo5EwViLGpAgYphNyzg"
					target="_blank"
					rel="noreferrer"
					title="AI Camp YouTube"
				>
					<YouTube class="w-10 h-10" />
				</a>
				<a
					href="mailto:hello@ai-camp.org"
					target="_blank"
					rel="noreferrer"
					title="AI Camp Email"
				>
					<Envelope class="w-8 h-8" />
				</a>
			</div>
		</div>
	</div>
</footer>
