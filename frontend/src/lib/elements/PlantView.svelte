<script lang="ts" context="module">
	let worker;
</script>

<script lang="ts">
	import type { PlantProject } from '@plantarium/types';
	import Renderer from '@plantarium/renderer';
	import { onMount } from 'svelte';
	import { createWorker } from '@plantarium/generator';
	import { NormalShader } from '$lib/components/scene/shaders';
	import { Box, Mesh, type OGLRenderingContext } from 'ogl-typescript';
	import { transferToGeometry } from '@plantarium/geometry';

	export let project: PlantProject;
	let canvas: HTMLCanvasElement;
	let mesh: Mesh;
	let renderer: { gl: OGLRenderingContext; handleResize: () => void };
	let loaded = false;

	async function generatePlant(project) {
		if (!worker) worker = createWorker();

		const result = await worker.executeNodeSystem(project, {
			stemResX: 12,
			stemResY: 12
		});

		return transferToGeometry(renderer.gl, result.geometry);
	}

	onMount(async () => {
		renderer = new Renderer({ canvas, alpha: true, clearColor: '000000' });
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
	<canvas bind:this={canvas} />
</div>

<style>
	canvas {
		max-width: 50vw;
		max-height: 50vw;
		height: 100%;
		width: 100%;
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
