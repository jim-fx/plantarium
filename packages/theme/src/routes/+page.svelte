<script lang="ts">
	import ThemeProvider from '../lib/ThemeProvider.svelte';
</script>

<ThemeProvider />

<h1>Welcome to your library project</h1>
<p>Create your package using @sveltejs/package and preview/showcase your work with SvelteKit</p>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<style>
	:global(html) {
		background-color: var(--background-color);
		color: var(--text-color);
	}
</style>
