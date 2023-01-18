<script>
	import { page } from '$app/stores';
	import { draw } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import Search from './Search.svelte';
	import { userInfo } from '$lib/localStore.js';
	export let data;
	export let pathname = '';
	//console.log($userInfo);
</script>

<header class="p-4 text-zinc-50">
	<div class="container flex justify-between h-16 mx-auto">
		<ul class="items-center justify-start hidden space-x-3 lg:flex ">
			{#if $userInfo && $userInfo.valid}
				<span>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="currentColor"
						class="w-6 h-6"
						alt={$userInfo.userdetails.uid}
					>
						<title>{$userInfo.userdetails.nickname}</title>
						<path
							fill-rule="evenodd"
							d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08zm3.094 8.016a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
							clip-rule="evenodd"
						/>
					</svg>
				</span>
			{/if}
			<li class="flex">
				<a
					href="/"
					class="text-lg flex items-center px-4 -mb-1 border-b-2 border-transparent font-bold"
					class:active={$page.url.pathname === '/'}>Home</a
				>
			</li>
			<li class="flex">
				<a
					class:active={$page.url.pathname === '/about'}
					href="/about"
					class="text-lg flex items-center px-4 -mb-1 border-b-2 border-transparent font-bold"
					>About</a
				>
			</li>
		</ul>
		<a href="/" aria-label="Domu" class="flex items-center p-2">
			<svg
				viewBox="0 0 200 200"
				class=" w-10 md:w-16 text-zinc-900"
				xmlns="http://www.w3.org/2000/svg"
			>
				{#key pathname}
					<path
						in:draw={{ duration: 5000, delay: 500, easing: quintOut }}
						d="M 167.919 98.112 A 65.282 65.282 0 0 1 102.637 163.394 A 65.282 65.282 0 0 1 37.355 98.112 A 65.282 65.282 0 0 1 102.637 32.83 A 65.282 65.282 0 0 1 167.919 98.112 Z"
						style="stroke: #84cc16; fill: none; stroke-width: 2px;"
					/>
					<path
						in:draw={{ duration: 5000, delay: 500, easing: quintOut }}
						d="M 70.361 51.331 A 14.642 14.642 0 0 1 55.719 65.973 A 14.642 14.642 0 0 1 41.077 51.331 A 14.642 14.642 0 0 1 55.719 36.689 A 14.642 14.642 0 0 1 70.361 51.331 Z"
						style="stroke: #84cc16; stroke-width: 2px;"
						fill="currentColor"
					/>
					<path
						in:draw={{ duration: 5000, delay: 500, easing: quintOut }}
						d="M 51.731 98.003 A 14.642 14.642 0 0 1 37.089 112.645 A 14.642 14.642 0 0 1 22.447 98.003 A 14.642 14.642 0 0 1 37.089 83.361 A 14.642 14.642 0 0 1 51.731 98.003 Z"
						style="stroke: #84cc16; stroke-width: 2px;"
						fill="currentColor"
					/>
					<path
						in:draw={{ duration: 5000, delay: 500, easing: quintOut }}
						d="M 70.377 144.673 A 14.642 14.642 0 0 1 55.735 159.315 A 14.642 14.642 0 0 1 41.093 144.673 A 14.642 14.642 0 0 1 55.735 130.031 A 14.642 14.642 0 0 1 70.377 144.673 Z"
						style="stroke: #84cc16; stroke-width: 2px;"
						fill="currentColor"
					/>
					<path
						in:draw={{ duration: 5000, delay: 500, easing: quintOut }}
						d="M 116.945 162.584 A 14.642 14.642 0 0 1 102.303 177.226 A 14.642 14.642 0 0 1 87.661 162.584 A 14.642 14.642 0 0 1 102.303 147.942 A 14.642 14.642 0 0 1 116.945 162.584 Z"
						style="stroke: #84cc16; stroke-width: 15px; fill:#84cc16"
						fill="currentColor"
					/>
					<path
						in:draw={{ duration: 5000, delay: 500, easing: quintOut }}
						d="M 164.128 144.696 A 14.642 14.642 0 0 1 149.486 159.338 A 14.642 14.642 0 0 1 134.844 144.696 A 14.642 14.642 0 0 1 149.486 130.054 A 14.642 14.642 0 0 1 164.128 144.696 Z"
						style="stroke: #84cc16; stroke-width: 15px; fill:#84cc16"
						fill="currentColor"
					/>
					<path
						in:draw={{ duration: 5000, delay: 500, easing: quintOut }}
						d="M 182.477 98.084 A 14.642 14.642 0 0 1 167.835 112.726 A 14.642 14.642 0 0 1 153.193 98.084 A 14.642 14.642 0 0 1 167.835 83.442 A 14.642 14.642 0 0 1 182.477 98.084 Z"
						style="stroke: #84cc16; stroke-width: 15px; fill:#84cc16"
						fill="currentColor"
					/>
					<path
						in:draw={{ duration: 5000, delay: 500, easing: quintOut }}
						d="M 163.71 51.059 A 14.642 14.642 0 0 1 149.068 65.701 A 14.642 14.642 0 0 1 134.426 51.059 A 14.642 14.642 0 0 1 149.068 36.417 A 14.642 14.642 0 0 1 163.71 51.059 Z"
						style="stroke: #84cc16; stroke-width: 15px; fill:#84cc16"
						fill="currentColor"
					/>
					<path
						in:draw={{ duration: 5000, delay: 500, easing: quintOut }}
						d="M 117.176 33.324 A 14.642 14.642 0 0 1 102.534 47.966 A 14.642 14.642 0 0 1 87.892 33.324 A 14.642 14.642 0 0 1 102.534 18.682 A 14.642 14.642 0 0 1 117.176 33.324 Z"
						style="stroke: #84cc16; stroke-width: 2px;"
						fill="currentColor"
					/>
				{/key}
			</svg>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="currentColor"
				viewBox="0 0 32 32"
				class="w-8 h-8 text-lime-500 hidden"
			>
				<path
					d="M27.912 7.289l-10.324-5.961c-0.455-0.268-1.002-0.425-1.588-0.425s-1.133 0.158-1.604 0.433l0.015-0.008-10.324 5.961c-0.955 0.561-1.586 1.582-1.588 2.75v11.922c0.002 1.168 0.635 2.189 1.574 2.742l0.016 0.008 10.322 5.961c0.455 0.267 1.004 0.425 1.59 0.425 0.584 0 1.131-0.158 1.602-0.433l-0.014 0.008 10.322-5.961c0.955-0.561 1.586-1.582 1.588-2.75v-11.922c-0.002-1.168-0.633-2.189-1.573-2.742zM27.383 21.961c0 0.389-0.211 0.73-0.526 0.914l-0.004 0.002-10.324 5.961c-0.152 0.088-0.334 0.142-0.53 0.142s-0.377-0.053-0.535-0.145l0.005 0.002-10.324-5.961c-0.319-0.186-0.529-0.527-0.529-0.916v-11.922c0-0.389 0.211-0.73 0.526-0.914l0.004-0.002 10.324-5.961c0.152-0.090 0.334-0.143 0.53-0.143s0.377 0.053 0.535 0.144l-0.006-0.002 10.324 5.961c0.319 0.185 0.529 0.527 0.529 0.916z"
				/>
				<path
					d="M22.094 19.451h-0.758c-0.188 0-0.363 0.049-0.515 0.135l0.006-0.004-4.574 2.512-5.282-3.049v-6.082l5.282-3.051 4.576 2.504c0.146 0.082 0.323 0.131 0.508 0.131h0.758c0.293 0 0.529-0.239 0.529-0.531v-0.716c0-0.2-0.11-0.373-0.271-0.463l-0.004-0.002-5.078-2.777c-0.293-0.164-0.645-0.26-1.015-0.26-0.39 0-0.756 0.106-1.070 0.289l0.010-0.006-5.281 3.049c-0.636 0.375-1.056 1.055-1.059 1.834v6.082c0 0.779 0.422 1.461 1.049 1.828l0.009 0.006 5.281 3.049c0.305 0.178 0.67 0.284 1.061 0.284 0.373 0 0.723-0.098 1.027-0.265l-0.012 0.006 5.080-2.787c0.166-0.091 0.276-0.265 0.276-0.465v-0.716c0-0.293-0.238-0.529-0.529-0.529z"
				/>
			</svg>
		</a>
		<div class="flex items-center md:space-x-4">
			<Search {data} />
		</div>
		<a href="/about" class="p-4 lg:hidden">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="w-6 h-6 text-zinc-50"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				stroke-width="2"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
				/>
			</svg>
		</a>
	</div>
</header>

<style>
	.active {
		@apply text-lime-500 border-lime-500;
	}
</style>
