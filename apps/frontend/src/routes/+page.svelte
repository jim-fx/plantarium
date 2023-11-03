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

	import LibraryView from '$lib/components/library/LibraryView.svelte';

	let nodeSystemWrapper: HTMLElement;

	onMount(async () => {
		await settingsManager.loadFromLocal();
		nodeSystemWrapper.append(nodeSystem.view.wrapper);
		nodeSystem.view.handleResize();
	});
</script>

<ThemeProvider />
<AlertWrapper />
<ToastWrapper />
<TutorWrapper />

<Header />

<main>
	{#if $activeView === 'library'}
		<LibraryView />
	{/if}

	<div class:visible={$activeView === 'plant'}>
		<Scene />
		<div id="nodesystem-view" bind:this={nodeSystemWrapper} />
	</div>
</main>

<style>
	:global(.overlay-visible) main {
		pointer-events: none;
		user-select: none;
	}

	main,
	main > div {
		height: 100%;
		max-height: calc(100vh - 50px);
	}

	main > div {
		opacity: 0;
		pointer-events: none;
		width: 100vw;
		height: 100vh;

		display: grid;
		grid-template-columns: minmax(50vw, 25%) 1fr;
		visibility: hidden;
	}

  @media (max-width: 800px) {
    main > div {
    grid-template-rows: minmax(70vw, 25%) 1fr;
      grid-template-columns: 1fr;
    }
  }



	main > div.visible {
		opacity: 1;
		visibility: visible;
		pointer-events: all;
	}
</style>
