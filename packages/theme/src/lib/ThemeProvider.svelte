<script lang="ts">
	import { onMount } from 'svelte';
	import themeCss from './themes.css?inline';

	onMount(() => {
		document.documentElement.classList.add('theme-dark');
	});
</script>

<svelte:head>
	{@html `<style>${themeCss}</style>`}
</svelte:head>
