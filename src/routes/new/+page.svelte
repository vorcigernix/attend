<script>
	import { getDay, getWeekOfMonth, format, addDays, getDate } from 'date-fns';
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';
	import { userNameStore } from '$lib/localStore.js';
	import { draw } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	/** @type {import('./$types').ActionData} */
	export let form;
	let submitting = false;
	let freqradio = 1;
	let today = getDay(new Date());
	let dayselection = [today];
	async function handleClick() {
		await navigator.clipboard.writeText(`https://${$page.url.host}/events/${form.url}`);
	}
	$: getDayNum = () => {
		return dayselection.map((d) => {
			const diff = addDays(new Date(), d - today);
			return getDate(diff);
		});
	};
	//console.log($page.url.host)
</script>

{#if form?.success}
	<section class="py-6 lg:pt-24 text-zinc-50">
		<div
			class="container mx-auto flex flex-col items-center justify-center p-4 space-y-8 md:p-10 md:px-24 xl:px-48"
		>
			<h1
				class="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-lime-500 via-red-500 to-lime-500 background-animate text-center"
			>
				Jop, máš to tam.
			</h1>
			<div class="text-xl font-medium text-center flex">
				Tvoje nová parádní událost je připravená. Bylo by dobrý tu adresu zkopírovat a poslat
				kámošům, protože určitě zapomeneš jak si to pojmenoval a už to nikdy nenajdeš. Máme na to
				tlačítko, ale Ctrl+V v mailu už musíš zmáčknout sám/sama.
			</div>
			<div class="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:space-x-8">
				<button
					class="px-8 py-3 text-lg font-semibold  bg-lime-500 text-zinc-900 rounded-full"
					on:click={handleClick}>Zkopíruj adresu</button
				>
				<a
					href={`https://${$page.url.host}/events/${form.url}`}
					class="px-8 py-3 text-lg font-normal border  bg-zinc-100 text-zinc-900 border-zinc-300 rounded-full"
					>Jdi na událost</a
				>
			</div>
		</div>
	</section>
{:else}
	<section class="flex flex-wrap lg:h-screen md:pt-24 justify-center">
		{#if submitting}
			<svg
				viewBox="0 0 200 200"
				class="w-32 text-zinc-900 md:hidden"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					in:draw={{ duration: 5000, delay: 500, easing: quintOut }}
					d="M 167.919 98.112 A 65.282 65.282 0 0 1 102.637 163.394 A 65.282 65.282 0 0 1 37.355 98.112 A 65.282 65.282 0 0 1 102.637 32.83 A 65.282 65.282 0 0 1 167.919 98.112 Z"
					style="stroke: rgb(255, 255, 255); fill: none; stroke-width: 2px;"
				/>
				<path
					in:draw={{ duration: 5000, delay: 500, easing: quintOut }}
					d="M 70.361 51.331 A 14.642 14.642 0 0 1 55.719 65.973 A 14.642 14.642 0 0 1 41.077 51.331 A 14.642 14.642 0 0 1 55.719 36.689 A 14.642 14.642 0 0 1 70.361 51.331 Z"
					style="stroke: rgb(255, 255, 255); stroke-width: 2px;"
					fill="currentColor"
				/>
				<path
					in:draw={{ duration: 5000, delay: 500, easing: quintOut }}
					d="M 51.731 98.003 A 14.642 14.642 0 0 1 37.089 112.645 A 14.642 14.642 0 0 1 22.447 98.003 A 14.642 14.642 0 0 1 37.089 83.361 A 14.642 14.642 0 0 1 51.731 98.003 Z"
					style="stroke: rgb(255, 255, 255); stroke-width: 2px;"
					fill="currentColor"
				/>
				<path
					in:draw={{ duration: 5000, delay: 500, easing: quintOut }}
					d="M 70.377 144.673 A 14.642 14.642 0 0 1 55.735 159.315 A 14.642 14.642 0 0 1 41.093 144.673 A 14.642 14.642 0 0 1 55.735 130.031 A 14.642 14.642 0 0 1 70.377 144.673 Z"
					style="stroke: rgb(255, 255, 255); stroke-width: 2px;"
					fill="currentColor"
				/>
				<path
					in:draw={{ duration: 5000, delay: 500, easing: quintOut }}
					d="M 116.945 162.584 A 14.642 14.642 0 0 1 102.303 177.226 A 14.642 14.642 0 0 1 87.661 162.584 A 14.642 14.642 0 0 1 102.303 147.942 A 14.642 14.642 0 0 1 116.945 162.584 Z"
					style="stroke: rgb(255, 255, 255); stroke-width: 15px;"
					fill="currentColor"
				/>
				<path
					in:draw={{ duration: 5000, delay: 500, easing: quintOut }}
					d="M 164.128 144.696 A 14.642 14.642 0 0 1 149.486 159.338 A 14.642 14.642 0 0 1 134.844 144.696 A 14.642 14.642 0 0 1 149.486 130.054 A 14.642 14.642 0 0 1 164.128 144.696 Z"
					style="stroke: rgb(255, 255, 255); stroke-width: 15px;"
					fill="currentColor"
				/>
				<path
					in:draw={{ duration: 5000, delay: 500, easing: quintOut }}
					d="M 182.477 98.084 A 14.642 14.642 0 0 1 167.835 112.726 A 14.642 14.642 0 0 1 153.193 98.084 A 14.642 14.642 0 0 1 167.835 83.442 A 14.642 14.642 0 0 1 182.477 98.084 Z"
					style="stroke: rgb(255, 255, 255); stroke-width: 15px;"
					fill="currentColor"
				/>
				<path
					in:draw={{ duration: 5000, delay: 500, easing: quintOut }}
					d="M 163.71 51.059 A 14.642 14.642 0 0 1 149.068 65.701 A 14.642 14.642 0 0 1 134.426 51.059 A 14.642 14.642 0 0 1 149.068 36.417 A 14.642 14.642 0 0 1 163.71 51.059 Z"
					style="stroke: rgb(255, 255, 255); stroke-width: 15px;"
					fill="currentColor"
				/>
				<path
					in:draw={{ duration: 5000, delay: 500, easing: quintOut }}
					d="M 117.176 33.324 A 14.642 14.642 0 0 1 102.534 47.966 A 14.642 14.642 0 0 1 87.892 33.324 A 14.642 14.642 0 0 1 102.534 18.682 A 14.642 14.642 0 0 1 117.176 33.324 Z"
					style="stroke: rgb(255, 255, 255); stroke-width: 2px;"
					fill="currentColor"
				/>
			</svg>{/if}
		<div class="w-full px-4 py-12 sm:px-6 sm:py-16 lg:w-1/2 lg:px-8">
			<div class="mx-auto max-w-lg text-center">
				<h1 class="text-2xl font-bold sm:text-3xl">Založ novou událost!</h1>

				<p class="mt-4 text-zinc-500">
					Potřebujem vědět nějaký základní věci, aby ostatní co se chtěj přihlásit věděli na co se
					to jako hlásí.
				</p>
			</div>

			<form
				method="POST"
				class="mx-auto mt-8 mb-0 max-w-md space-y-6 text-zinc-900 {submitting && `opacity-10`}"
				use:enhance={({ form, data, action, cancel }) => {
					submitting = true;
					return async ({ result, update }) => {
						if (result.type === 'success') {
							$userNameStore = data.get('username');
							form.reset();
						}
						update();
					};
				}}
			>
				<div class="flex flex-col space-y-2">
					<label for="username" class="text-sm text-zinc-400">Tvoje jméno</label>

					<div>
						<input
							type="text"
							name="username"
							value={$userNameStore}
							class="w-full border-zinc-200 p-4 pr-12 text-sm shadow-sm rounded-2xl"
							placeholder="takhle tě uvidí ostatní"
							required
						/>
					</div>
				</div>

				<div class="flex flex-col space-y-2">
					<label for="eventname" class="text-sm text-zinc-400">Jméno události</label>
					<div>
						<input
							type="text"
							name="eventname"
							class="w-full border-zinc-200 p-4 pr-12 text-sm shadow-sm rounded-2xl"
							placeholder="podle čeho ostatní poznaj kam jdou"
							autocomplete="off"
							required
						/>
					</div>
				</div>

				<div>
					<fieldset class="flex flex-col space-y-2">
						<legend class="text-sm text-zinc-400">Každej</legend>
						<div
							class="inline-flex items-center justify-center p-2 rounded-md cursor-pointer w-full"
						>
							{#if freqradio != 0}
								<input
									type="text"
									class="text-center border-zinc-200 text-sm shadow-sm rounded-2xl outline-none appearance-none w-10 h-10 spin-button-none mr-4"
									name="interval"
									value="1"
									min="1"
									step="1"
									max="31"
									required
								/>
							{/if}
							<div>
								<input
									type="radio"
									id="frequencyChoice0"
									name="frequency"
									bind:group={freqradio}
									value={0}
									checked
									class="hidden peer"
									required
								/>
								<label
									for="frequencyChoice0"
									class="px-4 py-2 rounded-l-full peer-checked:bg-lime-500 bg-zinc-800 peer-checked:text-zinc-900 text-zinc-50 cursor-pointer"
									>Den</label
								>
							</div>
							<div>
								<input
									type="radio"
									id="frequencyChoice1"
									name="frequency"
									bind:group={freqradio}
									value={1}
									checked
									class="hidden peer"
									required
								/>
								<label
									for="frequencyChoice1"
									class="px-4 py-2 peer-checked:bg-lime-500 bg-zinc-800 peer-checked:text-zinc-900 text-zinc-50 cursor-pointer"
									>Tejden</label
								>
							</div>
							<div>
								<input
									type="radio"
									id="frequencyChoice2"
									name="frequency"
									bind:group={freqradio}
									value={2}
									class="hidden peer"
									required
								/>
								<label
									for="frequencyChoice2"
									class="px-4 py-2 rounded-r-full bg-zinc-800 peer-checked:bg-lime-500 peer-checked:text-zinc-900 text-zinc-50 cursor-pointer"
									>Měsíc</label
								>
							</div>
						</div>
					</fieldset>
				</div>

				<div>
					<fieldset class="w-full">
						<legend class="text-sm text-zinc-400 mb-2">Dny</legend>
						<div class="gap-4 flex justify-between" required>
							<div class="flex flex-col ">
								<input
									type="checkbox"
									id="mo"
									class="hidden peer"
									name="day"
									bind:group={dayselection}
									value={1}
								/>
								<label
									for="mo"
									class="rounded-full w-8 h-8 justify-center items-center flex font-bold bg-zinc-900 text-zinc-50 cursor-pointer flex-grow p-2 text-center peer-checked:bg-lime-500 peer-checked:font-bold peer-checked:text-zinc-900"
									>Po</label
								>
							</div>

							<div class="flex flex-col">
								<input
									type="checkbox"
									id="tue"
									class="hidden peer"
									name="day"
									bind:group={dayselection}
									value={2}
								/>
								<label
									for="tue"
									class="rounded-full w-8 h-8 justify-center items-center flex font-bold bg-zinc-900 text-zinc-50 cursor-pointer flex-grow p-2 text-center peer-checked:bg-lime-500 peer-checked:font-bold peer-checked:text-zinc-900"
									>Út</label
								>
							</div>

							<div class="flex flex-col">
								<input
									type="checkbox"
									id="wed"
									class="hidden peer"
									name="day"
									bind:group={dayselection}
									value={3}
								/>
								<label
									for="wed"
									class="rounded-full w-8 h-8 justify-center items-center flex font-bold bg-zinc-900 text-zinc-50 cursor-pointer flex-grow p-2 text-center peer-checked:bg-lime-500 peer-checked:font-bold peer-checked:text-zinc-900"
									>St</label
								>
							</div>

							<div class="flex flex-col">
								<input
									type="checkbox"
									id="thu"
									class="hidden peer"
									name="day"
									bind:group={dayselection}
									value={4}
								/>
								<label
									for="thu"
									class="rounded-full w-8 h-8 justify-center items-center flex font-bold bg-zinc-900 text-zinc-50 cursor-pointer flex-grow p-2 text-center peer-checked:bg-lime-500 peer-checked:font-bold peer-checked:text-zinc-900"
									>Čt</label
								>
							</div>

							<div class="flex flex-col">
								<input
									type="checkbox"
									id="fri"
									class="hidden peer"
									name="day"
									bind:group={dayselection}
									value={5}
								/>
								<label
									for="fri"
									class="rounded-full w-8 h-8 justify-center items-center flex font-bold bg-zinc-900 text-zinc-50 cursor-pointer flex-grow p-2 text-center peer-checked:bg-lime-500 peer-checked:font-bold peer-checked:text-zinc-900"
									>Pá</label
								>
							</div>

							<div class="flex flex-col">
								<input
									type="checkbox"
									id="sat"
									class="hidden peer"
									name="day"
									bind:group={dayselection}
									value={6}
								/>
								<label
									for="sat"
									class="rounded-full w-8 h-8 justify-center items-center flex font-bold bg-zinc-900 text-zinc-50 cursor-pointer flex-grow p-2 text-center peer-checked:bg-lime-500 peer-checked:font-bold peer-checked:text-zinc-900"
									>So</label
								>
							</div>

							<div class="flex flex-col">
								<input
									type="checkbox"
									id="sun"
									class="hidden peer"
									name="day"
									bind:group={dayselection}
									value={0}
								/>
								<label
									for="sun"
									class="rounded-full w-8 h-8 justify-center items-center flex font-bold bg-zinc-900 text-zinc-50 cursor-pointer flex-grow p-2 text-center peer-checked:bg-lime-500 peer-checked:font-bold peer-checked:text-zinc-900"
									>Ne</label
								>
							</div>
						</div>
					</fieldset>
				</div>
				{#if freqradio === 2}
					<div>
						<fieldset class="w-full">
							<legend class="text-sm text-zinc-400 mb-2">Jak opakovat</legend>
							<div class="flex justify-center">
								<div class="flex">
									<input
										type="radio"
										class="hidden peer"
										id="ptbydate"
										name="pattern"
										value={0}
										checked
									/>
									<label
										for="ptbydate"
										class="px-4 py-1 rounded-2xl peer-checked:bg-lime-500 peer-checked:text-zinc-900 text-zinc-50 cursor-pointer"
										><span class="font-bold">{getDayNum()}</span> každej měsíc
									</label>
									<input type="hidden" name="dates" value={getDayNum()} />
								</div>
								<div class="flex">
									<input type="radio" class="hidden peer" id="ptbyweek" name="pattern" value={1} />
									<label
										for="ptbyweek"
										class="px-4 py-1 rounded-2xl peer-checked:bg-lime-500 peer-checked:text-zinc-900 text-zinc-50 cursor-pointer"
										><span class="font-bold">{getWeekOfMonth(new Date())}</span> tejden každej měsíc
									</label>
									<input type="hidden" name="weeknum" value={getWeekOfMonth(new Date())} />
								</div>
							</div>
						</fieldset>
					</div>
				{/if}
				<div class="flex flex-col space-y-2">
					<label for="description" class="text-sm text-zinc-400">Popis</label>
					<textarea
						id="description"
						name="description"
						rows={3}
						placeholder="nějakej popis, o co tam jako jde"
						class="w-full text-zinc-800 text-sm rounded-xl"
						required
					/>
				</div>

				<div class="flex items-center justify-between">
					<p class="text-sm text-zinc-500">
						<a href="/about" class="underline">Jak to funguje?</a>
					</p>

					<button
						class="inline-flex text-zinc-900 bg-lime-500 border-0 py-2 px-6 focus:outline-none hover:bg-lime-600 rounded-full text-lg"
							><span class="text-xl mr-2 font-bold">* </span>
						Založit
					</button>
				</div>
			</form>
		</div>

		<div class="relative h-64 w-full sm:h-96 lg:h-full lg:w-1/2 md:p-12">
		</div>
	</section>
{/if}
