<script>
	export const prerender = true;
	export const csr = false;
</script>

<section class="text-zinc-200 body-font">
	<div class="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
		<div
			class="lg:flex-grow  lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center"
		>
			<h1 class="text-5xl font-bold leading-none sm:text-6xl typogra text-zinc-50 mb-6">
				Dude,
				<br class="hidden lg:inline-block" /><span class="text-lime-500"
					>Repondez s'il vous plait.</span
				>
			</h1>
			<p class="mb-8 leading-relaxed">
				Use this app to find out if your frens are joining you on the regular events.
			</p>
			<div class="flex justify-center">
				<a
					href="/new"
					class=" font-bold inline-flex items-center text-zinc-900 bg-lime-500 border-0 py-2 px-6 focus:outline-none hover:bg-lime-600 rounded-full text-sm md:text-base"
					>Create new RSVP</a
				>
				<a
					href="/about"
					class=" font-bold ml-4 rounded-full inline-flex items-center text-zinc-200 bg-zinc-800 border-0 py-2 px-6 focus:outline-none hover:bg-zinc-700 hover:text-zinc-50 text-sm md:text-base"
					>About</a
				>
			</div>
		</div>
		<div class="lg:max-w-lg lg:w-full md:w-1/2 w-5/6 hidden">
			<img class="object-cover object-center rounded" alt="hero" src="relationship.svg" />
		</div>
	</div>
</section>
