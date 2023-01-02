<script>
	import '../app.css';
	import Navigation from '../components/Navigation.svelte';
	import PageTransition from '../components/Transition.svelte';
	import { page } from '$app/stores';
	/** @type {import('./$types').LayoutData} */
	export let data;
</script>

<Navigation {data} pathname={$page.url.pathname} />
<PageTransition pathname={$page.url.pathname}>
	<slot />
</PageTransition>
