<script>
	import { getDay, getWeekOfMonth, format, addDays, getDate } from 'date-fns';
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';
	import { userInfo } from '$lib/localStore.js';
	import { draw } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	const customProperties = new WeakMap();
	/** @type {import('./$types').ActionData} */
	export let form;
	//console.log($userInfo.userdetails);
	const userName = $userInfo ? JSON.parse($userInfo.userdetails).nickname : '';
	let submitting = false;
	let freqradio = 1;
	let recurradio = 0;
	let today = getDay(new Date());
	let dayselection = [today];
	async function handleClick() {
		await navigator.clipboard.writeText(`https://${$page.url.host}/events/${form.url}`);
	}
	$: getDayNum = () => {
		return dayselection.map((d) => {
			const diff = addDays(new Date(), d - today);
			//console.log(format(new Date(diff),"do"));
			//return [format(diff, 'do'), format(diff, 'M')];
			return diff;
		});
	};
</script>

{#if form?.success}
	<section class="py-6 lg:pt-24 text-zinc-50 backdrop-blur min-h-screen  w-full">
		<div
			class="container mx-auto flex flex-col items-center md:items-start justify-center p-4 space-y-8 md:p-10 md:px-24 xl:px-48"
		>
			<h1 class="typogra text-4xl text-center">Yay!</h1>
			<div class="text-xl font-medium text-center md:text-left flex">
				New event is created and prepared for you and your frens. Best thing to do now is to copy
				the address and share it - we do have a search, but believe it or not, some people forget
				even the event name.
			</div>
			<div class="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:space-x-8">
				<button
					class="px-8 py-3 text-lg font-semibold  bg-lime-500 text-zinc-900 rounded-full"
					on:click={handleClick}>Copy to clipboard</button
				>
				<a
					href={`https://${$page.url.host}/events/${form.url}`}
					class="font-bold px-8 py-3 text-lg border  bg-zinc-100 text-zinc-900 border-zinc-300 rounded-full"
					>Go to the event page</a
				>
			</div>
		</div>
	</section>
{:else}
	<section class="flex flex-wrap lg:h-screen justify-center">
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
		<div
			class="w-full px-4 py-12 sm:px-6 sm:py-16 md:mx-8 lg:w-1/2 lg:px-8 backdrop-blur bg-black/20 rounded-3xl"
		>
			<div class="mx-auto max-w-lg text-center md:text-left">
				<h1 class="text-2xl sm:text-5xl typogra">New event</h1>

				<p class="mt-4 text-zinc-300">
					You need to fill in some basic details about your event. Experience tells that people can
					get confused when they land on the "AAAask djkjkds" event and they usually don't know what
					to expect.
				</p>
			</div>

			<form
				method="POST"
				class="mx-auto mt-12 max-w-lg text-center md:text-left space-y-6 text-zinc-900 {submitting &&
					`opacity-10`}"
				use:enhance={({ form, data, action, cancel }) => {
					submitting = true;
					return async ({ result, update }) => {
						if (result.type === 'success') {
							//$userNameStore = data.get('username');
							form.reset();
						}
						update();
					};
				}}
			>
				<div class="flex flex-col space-y-2">
					<label for="username" class="text-sm text-zinc-200 flex justify-between items-end"
						>Your name
						<a
							href="/validate"
							class="font-bold inline-flex text-zinc-900 bg-lime-500 border-0 py-1 px-4 focus:outline-none hover:bg-lime-600 rounded-full"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 20 20"
								fill="currentColor"
								class="mx-2 w-4 h-4"
							>
								<path
									fill-rule="evenodd"
									d="M10 2.5c-1.31 0-2.526.386-3.546 1.051a.75.75 0 01-.82-1.256A8 8 0 0118 9a22.47 22.47 0 01-1.228 7.351.75.75 0 11-1.417-.49A20.97 20.97 0 0016.5 9 6.5 6.5 0 0010 2.5zM4.333 4.416a.75.75 0 01.218 1.038A6.466 6.466 0 003.5 9a7.966 7.966 0 01-1.293 4.362.75.75 0 01-1.257-.819A6.466 6.466 0 002 9c0-1.61.476-3.11 1.295-4.365a.75.75 0 011.038-.219zM10 6.12a3 3 0 00-3.001 3.041 11.455 11.455 0 01-2.697 7.24.75.75 0 01-1.148-.965A9.957 9.957 0 005.5 9c0-.028.002-.055.004-.082a4.5 4.5 0 018.996.084V9.15l-.005.297a.75.75 0 11-1.5-.034c.003-.11.004-.219.005-.328a3 3 0 00-3-2.965zm0 2.13a.75.75 0 01.75.75c0 3.51-1.187 6.745-3.181 9.323a.75.75 0 11-1.186-.918A13.687 13.687 0 009.25 9a.75.75 0 01.75-.75zm3.529 3.698a.75.75 0 01.584.885 18.883 18.883 0 01-2.257 5.84.75.75 0 11-1.29-.764 17.386 17.386 0 002.078-5.377.75.75 0 01.885-.584z"
									clip-rule="evenodd"
								/>
							</svg>
							Claim</a
						>
					</label>

					<div>
						<input
							type="text"
							name="username"
							value={userName}
							class="w-full border-zinc-200 p-4 pr-12 text-sm shadow-sm rounded-2xl"
							placeholder="that's how your frens see you"
							required
						/>
					</div>
				</div>

				<div class="flex flex-col space-y-2">
					<label for="eventname" class="text-sm text-zinc-200">Event name</label>
					<div>
						<input
							type="text"
							name="eventname"
							class="w-full border-zinc-200 p-4 pr-12 text-sm shadow-sm rounded-2xl"
							placeholder="something recognizable would be great"
							autocomplete="off"
							required
						/>
					</div>
				</div>
				<div class="inline-flex items-center justify-center p-2 rounded-md cursor-pointer w-full">
					<div>
						<input
							type="radio"
							id="repeatChoice0"
							name="recurring"
							bind:group={recurradio}
							value={0}
							class="hidden peer"
							checked
							required
						/>
						<label
							for="repeatChoice0"
							class="px-4 py-2 rounded-l-full peer-checked:bg-lime-500 bg-zinc-800 peer-checked:text-zinc-900 text-zinc-50 cursor-pointer"
							>One-off</label
						>
					</div>
					<div>
						<input
							type="radio"
							id="repeatChoice1"
							name="recurring"
							bind:group={recurradio}
							value={1}
							class="hidden peer"
							required
						/>
						<label
							for="repeatChoice1"
							class="px-4 py-2 rounded-r-full peer-checked:bg-lime-500 bg-zinc-800 peer-checked:text-zinc-900 text-zinc-50 cursor-pointer"
							>Recurring</label
						>
					</div>
				</div>
				<div class="flex items-center justify-center">
					{#if recurradio === 0}
						<input
							type="datetime-local"
							name="oneoffdt"
							class=" border-zinc-200 p-4 text-sm shadow-sm rounded-2xl accent-lime-500"
							placeholder="select date and time of the event"
							pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}"
							required
						/>
					{/if}
				</div>

				<div>
					{#if recurradio === 1}
						<fieldset class="flex flex-col space-y-2">
							<legend class="text-sm text-zinc-200">Every</legend>
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
										>Day</label
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
										>Week</label
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
										class="px-4 rounded-r-full py-2 bg-zinc-800 peer-checked:bg-lime-500 peer-checked:text-zinc-900 text-zinc-50 cursor-pointer"
										>Month</label
									>
								</div>
							</div>
						</fieldset>
					{/if}
				</div>

				<div>
					{#if recurradio === 1}
						<fieldset class="w-full">
							<legend class="text-sm text-zinc-200 mb-2">Days</legend>
							<div class="gap-4 flex justify-between" required>
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
										>Sun</label
									>
								</div>
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
										>Mo</label
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
										>Tue</label
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
										>We</label
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
										>Thu</label
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
										>Fri</label
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
										>Sat</label
									>
								</div>
							</div>
						</fieldset>
					{/if}
				</div>
				{#if freqradio === 2}
					<div>
						<fieldset class="w-full">
							<legend class="text-sm text-zinc-200 mb-2">On day or week number?</legend>
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
										><span class="font-bold">{format(new Date(getDayNum()), 'do')}</span> day
									</label>
									<input type="hidden" name="dates" value={format(new Date(getDayNum()), 'd')} />
								</div>
								<div class="flex">
									<input type="radio" class="hidden peer" id="ptbyweek" name="pattern" value={1} />
									<label
										for="ptbyweek"
										class="px-4 py-1 rounded-2xl peer-checked:bg-lime-500 peer-checked:text-zinc-900 text-zinc-50 cursor-pointer"
										>week <span class="font-bold">{getWeekOfMonth(new Date())}</span>
									</label>
									<input type="hidden" name="weeknum" value={getWeekOfMonth(new Date())} />
								</div>
							</div>
						</fieldset>
					</div>
				{/if}
				<div class="flex flex-col space-y-2">
					<label for="description" class="text-sm text-zinc-200">Description</label>
					<textarea
						id="description"
						name="description"
						rows={3}
						placeholder="more detailed description of the event"
						class="w-full text-zinc-800 text-sm rounded-xl"
						required
					/>
				</div>

				<div class="flex items-center justify-between">
					<p class="text-sm text-zinc-500">
						<a href="/about" class="underline">How does it work?</a>
					</p>

					<button
						class="font-bold inline-flex text-zinc-900 bg-lime-500 border-0 py-2 px-6 focus:outline-none hover:bg-lime-600 rounded-full text-lg"
					>
						Create
					</button>
				</div>
			</form>
		</div>

		<div class="relative h-64 w-full sm:h-96 lg:h-full lg:w-1/2 md:p-12" />
	</section>
{/if}
