<script lang="ts">
	import { ThemeProvider } from '@plantarium/theme';
	import { AlertWrapper, ToastWrapper } from '@plantarium/ui';
	import { onMount } from 'svelte';
	import { nodeSystem } from '$lib/components';
	import Scene from '$lib/components/scene/Scene.svelte';
	import TutorWrapper from '$lib/components/tutor/Tutor.svelte';
	import Header from '$lib/components/Header.svelte';
	import { activeView } from '$lib/stores';

	import { settingsManager } from '$lib/components';

	import './global.scss';
	import LibraryView from '$lib/components/library/LibraryView.svelte';

	let nodeSystemWrapper: HTMLElement;
	$: if (nodeSystemWrapper) {
		nodeSystemWrapper.append(nodeSystem.view.wrapper);
		nodeSystem.view.handleResize();
	}

	onMount(async () => {
		let path = localStorage.getItem('path');
		if (path) {
			localStorage.removeItem('path');
		}

		await settingsManager.loadFromLocal();
		nodeSystemWrapper.append(nodeSystem.view.wrapper);
	});
</script>

<ThemeProvider />
<AlertWrapper />
<ToastWrapper />
<TutorWrapper />

<Header />

<main>
	{#if $activeView === 'plant'}
		<Scene />
		<div id="nodesystem-view" bind:this={nodeSystemWrapper} />
	{:else if $activeView === 'library'}
		<LibraryView />
	{/if}
</main>

<style lang="scss">
	@use '~@plantarium/theme/src/themes.module.scss';

	:global(.overlay-visible) main {
		pointer-events: none;
		user-select: none;
	}

	main {
		height: 100%;
		max-height: calc(100vh - 50px);
		display: grid;
		grid-template-columns: minmax(50vw, 25%) 1fr;
	}
</style>
