<script lang="ts">
	import type { Project } from '@plantarium/types';
	import Renderer from '@plantarium/renderer';
	import { onMount } from 'svelte';
	import { createWorker } from '@plantarium/generator';
	import { NormalShader } from '$lib/components/scene/shaders';
	import { Box, Mesh } from 'ogl';
	import { transferToGeometry } from '@plantarium/geometry';
	import { Icon } from '@plantarium/ui';

	export let project: Project;
	let canvas: HTMLCanvasElement;
	let mesh: Mesh;
	let renderer: Renderer;
	let loaded = false;
	let worker: ReturnType<typeof createWorker>;

	let showHint = true;
	let hintTimeout: NodeJS.Timeout;

	async function generatePlant(project: Project) {
		if (!worker) worker = createWorker();

		const result = await worker.executeNodeSystem(project, {
			stemResX: 8,
			stemResY: 4
		});

		return transferToGeometry(renderer.gl, result.geometry);
	}

	onMount(() => {
		const dim = Math.max(window.innerWidth, window.innerHeight);
		canvas.width = dim;
		canvas.height = dim;
		renderer = new Renderer({ canvas, height: dim, width: dim, alpha: true, clearColor: '000000' });
		renderer.handleResize();

		mesh = new Mesh(renderer.gl, {
			geometry: new Box(renderer.gl, { width: 0, height: 0, depth: 0 }),
			program: NormalShader(renderer.gl)
		});

		mesh.setParent(renderer.scene);

		setTimeout(async () => {
			mesh.geometry = await generatePlant(project);
			loaded = true;
		}, 500);
	});
</script>

<div class:loaded class:showHint={loaded && showHint}>
	<img src={project.meta.thumbnail} alt="" />
	<canvas
		bind:this={canvas}
		width="500"
		height="500"
		on:click={() => {
			if (showHint && !hintTimeout) {
				hintTimeout = setTimeout(() => {
					showHint = false;
				}, 500);
			}
		}}
	/>
	<span><Icon animated name="hand_rotate" /></span>
</div>

<style>
	canvas {
		max-width: 50vw;
		max-height: 50vw;
		height: 100%;
		width: 100%;
		z-index: -1;
	}

	img {
		opacity: 1;
		transition: opacity 1s ease;
		pointer-events: none;
	}
	.loaded > img {
		position: absolute;
		opacity: 0;
	}

	span {
		display: block;
		position: absolute;
		width: 50px;
		height: 50px;
		right: 20px;
		bottom: 20px;
		opacity: 0;
		transform: scale(0);
		transition: transform 0.3s ease, opacity 0.3s ease;
	}

	.showHint span {
		opacity: 1;
		transform: scale(1);
	}

	canvas {
		display: none;
	}

	div {
		position: relative;
	}

	.loaded > canvas {
		display: block;
	}
</style>
