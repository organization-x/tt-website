<div
	class="px-4 mx-auto mb-10 max-w-screen-2xl h-96 lg:flex lg:mt-20 lg:justify-between lg:px-6 xl:px-10"
>
	<div class="flex flex-col justify-center shrink-0">
		<slot />
	</div>

	<div class="w-full m-auto mt-12 max-w-lg lg:m-auto">
		<slot name="image" />
	</div>
</div>
