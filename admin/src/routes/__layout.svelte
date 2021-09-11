<script>
	import 'virtual:windi.css';
	import { browser } from '$app/env';
	import NavBar from '$lib/NavBar.svelte';
	import { user } from '$lib';
	if (browser) import('virtual:windi-devtools');
	if (browser) document.body.classList.add('bg-gray-100');
</script>

{$user?.username}

<svelte:body class="bg-gray-50" />

<div class="container mx-auto">
	<NavBar />
	<slot />
</div>
