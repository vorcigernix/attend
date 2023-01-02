<script>
	import { blur, fade } from 'svelte/transition';
	export let pathname = '';
</script>

{#key pathname}
	<div in:fade>
		<slot />
	</div>
{/key}
