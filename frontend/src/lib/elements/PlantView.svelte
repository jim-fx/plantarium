<script lang="ts" context="module">
	let worker;
</script>

<script lang="ts">
	import type { PlantProject } from '@plantarium/types';
	import Renderer from '@plantarium/renderer';
	import { onMount } from 'svelte';
	import { createWorker } from '@plantarium/generator';
	import { NormalShader } from '$lib/components/scene/shaders';
	import { Box, Mesh } from 'ogl-typescript';
	import { transferToGeometry } from '@plantarium/geometry';

	export let project: PlantProject;
	let canvas: HTMLCanvasElement;
	let mesh: Mesh;
	let renderer: Renderer;
	let loaded = false;

	async function generatePlant(project: PlantProject) {
		if (!worker) worker = createWorker();

		const result = await worker.executeNodeSystem(project, {
			stemResX: 8,
			stemResY: 4
		});

		return transferToGeometry(renderer.gl, result.geometry);
	}

	onMount(async () => {
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

		mesh.geometry = await generatePlant(project);

		loaded = true;
	});
</script>

<div class:loaded>
	<img src={project.meta.thumbnail} alt="" />
	<canvas bind:this={canvas} width="500" height="500" />
</div>

<style>
	canvas {
		max-width: 50vw;
		max-height: 50vw;
		height: 100%;
		width: 100%;
		z-index: -1;
	}

	.loaded > img {
		display: none;
	}

	canvas {
		display: none;
	}

	.loaded > canvas {
		display: block;
	}
</style>
