<script>
	import 'virtual:windi.css';
	import { browser } from '$app/env';
	import NavBar from '$lib/NavBar.svelte';
	import { user } from '$lib';
	if (browser) import('virtual:windi-devtools');
</script>

{$user?.username}

<svelte:body class="bg-gray-50" />

<div class="container mx-auto">
	<NavBar />
	<slot />
</div>
