<script>
	export let data;

	const dataVals = Object.values(data?.posts);
	//console.log(dataVals);
	const eventNamesAndIds = dataVals.map((event) => ({
		id: event.id,
		eventname: event.eventname,
		author: event.author
	}));
	let searchTerm = '';
	$: filteredList = eventNamesAndIds.filter(
		(item) => item.eventname.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
	);
</script>

<fieldset class="w-full space-y-1 text-zinc-100">
	<label for="Search" class="hidden">Search</label>
	<div class="relative">
		<span class="absolute inset-y-0 left-0 flex items-center pl-2">
			<button type="button" title="search" class="p-1 focus:outline-none focus:ring">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="w-6 h-6"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
					/>
				</svg>
			</button>
		</span>
		<input
			type="text"
			name="Search"
			bind:value={searchTerm}
			placeholder="Search..."
			class="w-52 py-3 pl-10 text-sm rounded-md sm:w-auto bg-zinc-800 border border-transparent outline outline-offset-2 outline-zinc-900 shadow-sm  focus:outline-lime-500 focus:ring-2 focus:ring-lime-500"
		/>
		{#if searchTerm.length > 0}
			<div
				class="absolute right-0 z-50 w-full md:w-64 bg-zinc-800 border border-zinc-900 rounded-md text-zinc-50 shadow-lg mt-2"
			>
				<ul class="p-2 space-y-1 overflow-auto max-h-64">
					{#if filteredList.length > 1}
						{#each filteredList as e (e.id)}
							<li>
								<a
									on:click={() => {
										searchTerm = '';
									}}
									class="flex flex-col md:flex-row items-center justify-between px-4 py-4 font-medium rounded-md hover:text-zinc-900 hover:bg-zinc-100 focus:bg-zinc-50"
									href={`/events/${e.id}`}
									><span>{e.eventname}</span><span
										class="block rounded bg-black px-1.5 py-0.5 text-[10px] text-white"
										>{e.author}</span
									></a
								>
							</li>
						{/each}
					{:else}
						<li>
							<span
								class="flex flex-col md:flex-row items-center justify-between px-4 py-4 font-medium rounded-md hover:text-zinc-900 hover:bg-zinc-100 focus:bg-zinc-50"
								><span>no results found</span>
							</span>
						</li>
					{/if}
				</ul>
			</div>
		{/if}
	</div>
</fieldset>
