<script>
	//import { generateAndWriteKeys, restoreKeys } from '$lib/indexedDBUtil';
	import { generateAndWriteKeys, restoreKeys } from '$lib/utils/cryptoDBfunctions';
	import { browser } from '$app/environment';
	import { userInfo } from '$lib/localStore.js';
	let name = '';
	let eckey = null;
	$: existingUser = false;
	$: submitting = false;
	let keytext = null;
	let files = null;

	$: if (files) {
		const fileText = files[0].text();
		fileText.then((text) => {
			//console.log(text);
			keytext = JSON.parse(text);
			//console.log(keytext);
			const { pubk, pvk, sig, userdetails } = keytext;
			restoreKeys(pvk, pubk, userdetails, sig);
		});
		files = null;
	}

	const userName = $userInfo ? JSON.parse($userInfo.userdetails).nickname : null;
	async function writeKey() {
		submitting = true;
		if (!browser || name === '') return;
		try {
			eckey = await generateAndWriteKeys(name);
		} catch (e) {
			console.info('Issue in generating or storing keys:', e);
			existingUser = true;
		}
		submitting = false;
		return;
	}
</script>

<section class="text-zinc-50">
	<div
		class="container flex flex-col justify-center p-6 mx-auto sm:py-12 lg:py-24 lg:flex-row lg:justify-between"
	>
		<div
			class="flex items-center justify-center p-6 mt-8 lg:mt-0 h-72 sm:h-80 lg:h-96 xl:h-112 2xl:h-128"
		>
			{#if !eckey}
				<img
					src="Design.svg"
					alt="illustration"
					class="object-contain h-72 sm:h-80 lg:h-96 xl:h-112 2xl:h-128"
				/>
			{:else}
				<div class="flex flex-col justify-center items-center">
					<img
						src="Technologies.svg"
						alt="illustration"
						class="object-contain h-72 sm:h-80 lg:h-96 xl:h-112 2xl:h-128"
					/>
					<div
						class="inline-flex items-center divide-x rounded-full bg-lime-400 text-zinc-800 divide-gray-700"
					>
						<a
							download="dude_rsvp.key"
							href="data:application/json,{JSON.stringify(eckey)}"
							class="font-bold inline-flex items-center py-2 px-6 hover:bg-lime-600 text-sm md:text-base hover:rounded-full"
						>
							Download key backup
						</a>
					</div>
				</div>
			{/if}
		</div>
		<div
			class="flex flex-col justify-center p-6 text-center lg:max-w-md xl:max-w-lg lg:text-left backdrop-blur bg-black/40 rounded-3xl {submitting &&
				`opacity-10`}"
		>
			{#if existingUser || userName}
				<h1 class="text-5xl font-bold leading-none sm:text-6xl typogra">
					Have we
					<span class="text-lime-400">met</span> ?
				</h1>
			{:else}
				<h1 class="text-5xl font-bold leading-none sm:text-6xl typogra">
					Create or
					<span class="text-lime-400">restore</span> verification
				</h1>
			{/if}
			{#if !userName}
				<div class="flex flex-col space-y-2 mt-4">
					<label for="username" class="text-zinc-200">Your name/Nickname</label>

					<div>
						<input
							type="text"
							name="username"
							bind:value={name}
							class="w-full border-zinc-200 p-4 pr-12  shadow-sm rounded-2xl text-zinc-900 mb-1"
							placeholder="that'd be stored and used further on"
							required
						/>

						<span class="text-sm text-zinc-500 mt-2"
							>We recommend using distinctive, unique name - instead of 'Adam' use Adam S. 'Johny'
							would be easier to recognize as 'JohnyBoy74'</span
						>
					</div>
				</div>
			{/if}
			{#if existingUser}
				<p class="mt-6 mb-8 text-lg sm:mb-12">
					We already know a user with this nickname.
					<br class="hidden md:inline lg:hidden" />If this is yours, please use restore button. If
					not, consider adding your favorite number at the end.
				</p>
			{:else if userName}
				<p class="mt-6 mb-8 text-lg sm:mb-12">
					Hey {decodeURI(userName)} nice to see you again.
					<br class="hidden md:inline lg:hidden" />It is good to ve validated huh? How we can help?
				</p>
			{:else}
				<p class="mt-6 mb-8 text-lg sm:mb-12">
					Verification is super easy. You just click on the green button
					<br class="hidden md:inline lg:hidden" />and you are done. When the verification key is
					generated, you can download a recovery file that later serve to restore your account on
					any device.
				</p>
			{/if}

			<div
				class="flex flex-col space-y-4 sm:items-center sm:justify-center sm:flex-row sm:space-y-0 sm:space-x-4 lg:justify-start"
			>
				{#if !userName}
					<button
						on:click|preventDefault={() => writeKey()}
						class=" font-bold inline-flex items-center text-zinc-900 bg-lime-500 border-0 py-2 px-6 focus:outline-none hover:bg-lime-600 rounded-full text-sm md:text-base"
						>Create verification</button
					>
					<label
						class=" font-bold ml-4 rounded-full inline-flex items-center text-zinc-200 bg-zinc-800 border-0 py-2 px-6 focus:outline-none hover:bg-zinc-700 hover:text-zinc-50 text-sm md:text-base"
						for="restore">Restore</label
					>
					<input class="hidden" accept=".key" bind:files id="restore" name="restore" type="file" />
					<a href="/about#auth" class="ml-4 rounded-full inline-flex items-center py-2 px-2">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="w-6 h-6 text-zinc-200 hover:text-zinc-50"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							stroke-width="2"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
							/></svg
						></a
					>
				{:else}
					<a
						class=" font-bold inline-flex items-center text-zinc-900 bg-lime-500 border-0 py-2 px-6 focus:outline-none hover:bg-lime-600 rounded-full text-sm md:text-base"
						href="mailto:vorcigernix@gmail.com">Something don't work?</a
					>
				{/if}
			</div>
		</div>
	</div>
</section>
