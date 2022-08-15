<script lang="ts">
	import CodeMirror from './_elements/CodeMirror.svelte';
	import * as geometry from '$lib';
	import * as examples from './_editor/examples';
	import debug from './_editor/debug';
	import * as scene from './_editor/scene';
	import store from './_editor/store';
	import * as ogl from 'ogl-typescript';
	import { onMount } from 'svelte';

	let value = store.get('code');
	let generatorTime = 0;
	let verticeAmount = 0;
	$: handleValueChange(value);

	// Settings
	let showVertices = store.createWritable('show-vertices', false);
	$: scene.setParticleVisible($showVertices);
	let showIndeces = store.createWritable('show-indeces', false);
	$: scene.setIndecesVisible($showIndeces);
	let showWireframe = store.createWritable('show-wireframe', false);
	$: scene.setWireframeVisible($showWireframe);

	let debugCanvas: HTMLCanvasElement;
	let renderCanvas: HTMLCanvasElement;

	let error: Error | null;

	function handleValueChange(v: string) {
		store.set('code', v);
		let generatorTime = 0;
		try {
			const a = performance.now();
			eval(`(g,scene,ogl) => {${v}\n}`)(geometry, scene, ogl);
			generatorTime = performance.now() - a;
			error = null;
		} catch (err) {
			console.log(err);
			error = err as Error;
		} finally {
			scene.commit();
		}

		generatorTime = Math.floor(generatorTime * 10) / 10;
		verticeAmount = scene.getVertices();
	}

	onMount(() => {
		scene.init(renderCanvas);
		debug.init(debugCanvas);
	});
</script>

<div class="wrapper">
	<div id="view">
		<div id="debug-wrapper">
			<label for="show-indeces">Indeces</label>
			<input type="checkbox" id="show-indeces" bind:checked={$showIndeces} />
			<label for="show-wireframe">Wireframe</label>
			<input type="checkbox" id="show-wireframe" bind:checked={$showWireframe} />
			<label for="show-points">Show Vertices</label>
			<input type="checkbox" id="show-points" bind:checked={$showVertices} />
			<button on:click={() => scene.download()}>download</button>
			<p>Time: {generatorTime} | Vertices: {verticeAmount}</p>
		</div>
		<canvas id="debug-canvas" bind:this={debugCanvas} />
		<canvas id="render-canvas" bind:this={renderCanvas} />
	</div>
	<div id="code-wrapper">
		<div>
			{#each Object.keys(examples) as key}
				<button
					on:click={() => {
						value = examples[key];
					}}>{key}</button
				>
			{/each}
		</div>
		<CodeMirror bind:value />
		{#if error}
			<div class="error">
				<h4>{error.name}</h4>
				<p>{error.message}</p>
			</div>
		{/if}
	</div>
</div>

<style>
	.wrapper {
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-template-rows: 1fr;
		height: 100vh;
		width: 100vw;
	}

	#view {
		position: relative;
	}

	#view > canvas {
		width: 100%;
		height: 100%;
	}

	#debug-wrapper {
		position: absolute;
		bottom: 0px;
		left: 0px;
		width: 100%;
		font-size: 0.8em;
		display: flex;
	}

	#debug-wrapper > * {
		margin: 0;
	}

	#code-wrapper {
		display: grid;
		grid-template-rows: 30px 1fr;
	}

	#debug-canvas {
		position: absolute;
		width: 100%;
		height: 100%;
		pointer-events: none;
	}
	.error {
		background: #fb000069;
	}

	.error > h4,
	.error > p {
		padding: 10px;
		margin: 0;
	}

	.error > h4 {
		padding-bottom: 0px;
	}
	.error > p {
		padding-top: 2px;
	}
</style>
