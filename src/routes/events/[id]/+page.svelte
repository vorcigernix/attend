<script>
	/** @type {import('./$types').PageData} */
	/** @type {import('./$types').ActionData} */
	import { userNameStore } from '$lib/localStore.js';
	import { format, getDay } from 'date-fns';
	import { enhance } from '$app/forms';
	import { fade } from 'svelte/transition';

	export let form;
	export let data;

	let submitting = false;

	const frequency = ['Denně', 'Týdně', 'Měsíčně', 'Ročně'];
	const addOrReplace = (arr, newObj) => [
		...arr.filter((o) => o.username !== newObj.username),
		{ ...newObj }
	];
	console.log('data', data);
	//this is horrible, but the new entry does not have attendance array
	let currentAttendance = data.attendance
		? data.attendance.filter((att) => {
				return att.dates && att.dates.includes(data.nextevents[0]);
		  })
		: [];

	console.log('attend', currentAttendance);

	const myAttendance = data.attendance.filter((att) => {
		return att.username === form?.username || att.username === $userNameStore;
	});

	//console.log('myatt', myAttendance);

	let pendingAttendance;

	function checkMyAttendance(day) {
		if (!Object.values(myAttendance)[0]) return false;
		//console.log(myAttendance);
		if (pendingAttendance) {
			//console.log('pend');
			return pendingAttendance.includes(day);
		} else {
			//console.log('fromdata');
			return Object.values(myAttendance)[0]['dates'].includes(day);
		}
	}

	$: attendingCount = currentAttendance && currentAttendance.length;
</script>

<section>
	<div
		class="container flex flex-col justify-center p-4 mx-auto md:p-8 pt-24 lg:pt-32 items-center"
	>
		<h1 class="text-4xl leading-none sm:text-5xl">
			{data.eventname}
			<span class="text-lime-500">{data.author}</span>
		</h1>
		<span class="mt-8 text-lg">{data.description} </span>
		<div class="text-xl mt-2 font-bold mb-12">
			{frequency[data.freq]}, další je
			<span class=" text-lime-500"
				>{new Date(data.nextevents[0]).toLocaleDateString('cs-CZ', {
					weekday: 'long',
					year: 'numeric',
					month: 'long',
					day: 'numeric'
				})}</span
			>
		</div>
		<div class="flex p-4 space-x-4 rounded-lg md:space-x-6  text-zinc-100">
			<div class="flex justify-center p-2 align-middle rounded-full sm:p-4 bg-lime-500">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="h-9 w-9 text-zinc-800"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
					/>
				</svg>
			</div>
			<div class="flex flex-col justify-center align-middle">
				<p class="text-3xl font-semibold leading-none">{attendingCount}</p>
				<p>příště jdou</p>
			</div>
		</div>

		<ul class="w-full items-center flex flex-wrap gap-4 mt-4 justify-center">
			{#each currentAttendance as { username }}
				<li class="list-none flex font-bold mb-4">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="w-6 h-6 mr-2 text-lime-500"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					{username}
				</li>
			{/each}
		</ul>
		{#if !submitting}
			<div>
				<form
					method="POST"
					in:fade
					class="mt-8 mb-0 max-w-md text-zinc-900"
					use:enhance={({ form, data, action, cancel }) => {
						//console.log('oldAtt', currentAttendance);
						submitting = true;
						currentAttendance = addOrReplace(currentAttendance, {
							username: data.get('username'),
							dates: data.getAll('nextEventsChoice')
						});
						pendingAttendance = data.getAll('nextEventsChoice');
						return async ({ result, update }) => {
							if (result.type === 'success') {
								$userNameStore = data.get('username');
								//form.reset();
							}

							submitting = false;
							//console.log('newAtt', currentAttendance);
							//update();
						};
					}}
				>
					<input type="hidden" name="postdata" value={JSON.stringify(data)} />
					<label for="username" class="text-sm text-zinc-400">Tvoje jméno</label>
					<div class="flex my-4">
						<input
							type="text"
							name="username"
							value={form?.username ?? $userNameStore}
							class="w-full border-zinc-200 p-4 pr-12 text-sm shadow-sm text-zinc-900 rounded-full"
							placeholder="takhle tě uvidí ostatní"
							required
						/>
					</div>
					<label for="username" class="text-sm text-zinc-400">Jdu</label>
					<fieldset>
						<div class="flex my-4 justify-center gap-4 md:gap-6">
							{#each data.nextevents as event}
								<div>
									<input
										type="checkbox"
										id={format(new Date(event), 'dM')}
										name="nextEventsChoice"
										value={new Date(event).toJSON()}
										checked={checkMyAttendance(new Date(event).toJSON())}
										class="hidden peer"
									/>
									<label
										for={format(new Date(event), 'dM')}
										class="px-4 py-2 rounded-full peer-checked:bg-lime-500 bg-zinc-800 peer-checked:text-zinc-900 text-zinc-50 cursor-pointer"
										>{format(new Date(event), 'd.M.')}</label
									>
								</div>
							{/each}
						</div>
					</fieldset>
					<div>
						<button
							name="attending"
							class=" mt-8 inline-block rounded-full items-center  bg-lime-500 px-5 py-3 font-bold text-zinc-900 hover:bg-lime-600"
						>
							Potvrdit
						</button>
					</div>
				</form>
			</div>
		{/if}
	</div>
</section>
