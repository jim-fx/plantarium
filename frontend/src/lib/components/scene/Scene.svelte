<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/env';
	import type { PlantProject } from '@plantarium/types';

	import type { Writable } from 'svelte/store';
	import Scene from '.';
	import { projectManager, settingsManager  } from '..';
	import * as perf from '../../helpers/performance';
	import { cloneObject } from '@plantarium/helpers';
	import { Icon } from '@plantarium/ui';
	import type { PlantariumSettings } from '$lib/types';

	let canvas: HTMLCanvasElement;

	let scene: Scene;
	let pd: PlantProject;

	$: isLoading = scene && scene.isLoading;

	let unsub: () => void;
	$: if (projectManager) {
		unsub && unsub();
		unsub = projectManager.on('save', (plant) => {
			const _pd = cloneObject(plant);
			_pd.meta.thumbnail = '';
			pd = _pd;
		});
	}
	let settings: Writable<PlantariumSettings>;
	$: if (settingsManager) {
		settings = settingsManager.store;
	}

	let generateCanvas: HTMLCanvasElement;
	let renderCanvas: HTMLCanvasElement;

	onMount(() => {
		scene = new Scene(projectManager, canvas);

		perf.createCanvas('render', renderCanvas);
		perf.createCanvas('generate', generateCanvas);
	});
</script>

<div class="scene-wrapper">
	{#if $settings?.debug?.pd && pd}
		<pre>
    <code>
      {JSON.stringify(pd, null, 2)}
    </code>
  </pre>
	{/if}

	<div class="performance-wrapper">
		<canvas
			bind:this={generateCanvas}
			style={`display: ${$settings?.debug?.generatePerf ? 'visible' : 'none'}`}
		/>

		<canvas
			bind:this={renderCanvas}
			style={`display: ${$settings?.debug?.renderPerf ? 'visible' : 'none'}`}
		/>
	</div>

	<canvas bind:this={canvas} />
	{#if $isLoading}
		<div class="is-loading">
			<Icon name="branch" animated />
		</div>
	{/if}

	{#if $settings?.debug?.showLogs}
		<div class="log-wrapper">
			<h2>Logs:</h2>
		</div>
	{/if}
</div>

<style lang="scss">
	@use '~@plantarium/theme/src/themes.module.scss';

	.scene-wrapper::before {
		content: '';
		position: absolute;
		width: 100%;
		height: 100%;
		z-index: 1;
		pointer-events: none;
		background: radial-gradient(circle, rgba(2, 0, 36, 0) 50%, rgb(0, 0, 0, 0.4) 100%);
	}

	.performance-wrapper {
		position: absolute;
		z-index: 1;
		bottom: 0px;
	}

	.scene-wrapper > canvas {
		width: 100% !important;
		height: 100% !important;
		filter: blur(0px);
		transition: filter 0.3s ease;

		&:global(.resizing) {
			filter: blur(5px);
		}
	}

	.is-loading {
		position: absolute;
		bottom: 10px;
		left: 10px;
		z-index: 99;
		width: 20px;
	}

	code {
		max-width: 80%;
		text-overflow: ellipsis;
	}

	pre {
		position: absolute;
		font-size: 0.8em;
		overflow-x: auto;
		max-width: 40%;
		max-height: calc(100% - 30px);
		overflow-y: auto;
		max-width: 250px;
		right: 0;
		z-index: 2;
		padding: 10px 20px 10px 0px;
		box-sizing: border-box;
		padding: 5px;
		opacity: 0.8;
		background-color: var(--foreground-color);
	}

	:global(code[class*='language-'], pre[class*='language-'], .token.operator) {
		background: none !important;
		text-shadow: 0 1px #0000001f;
	}

	:global(.token.string) {
		color: var(--accent);
	}
	.scene-wrapper {
		position: relative;
		max-height: calc(100vh - 50px);
	}
</style>
