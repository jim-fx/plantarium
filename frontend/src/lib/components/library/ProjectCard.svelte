<script lang="ts">
	import type { PlantProject } from '@plantarium/types';
	import { Button } from '@plantarium/ui';
	import { getContext } from 'svelte';
	import type { Project } from '@plantarium/backend';

	export let project: Project | undefined = undefined;
	export let plant: PlantProject = (project as Project)?.data;

	export let isRemote = false;

	const showPlant = getContext('showPlant') as (id: string) => void;
	const openPlant = getContext('openPlant') as (id: string) => void;
	const deletePlant = getContext('deletePlant') as (id: string) => void;
</script>

<div class="wrapper">
	<div class="bottom">
		<h3>{plant.meta.name}</h3>
		<div class="actions">
			<Button
				on:click={() => openPlant(project.id || plant.meta.id)}
				icon={isRemote ? 'import' : 'link'}
				name={isRemote ? '' : 'open'}
				--foreground-color="var(--midground-color)"
			/>

			{#if !isRemote}
				<Button
					on:click={() => deletePlant(plant.meta.id)}
					name="delete"
					--foreground-color="var(--error)"
				/>
			{/if}
		</div>
	</div>
	{#if plant?.meta.thumbnail}
		<img
			src={plant.meta.thumbnail}
			alt=""
			on:click={() => showPlant(project.id || plant.meta.id)}
		/>
	{/if}
</div>

<style>
	.wrapper {
		position: relative;
		overflow: visible;
		width: 200px;
		height: 200px;
		border-radius: 10px;
		margin: 0px 20px 20px 0px;
		box-shadow: 0px 0px 0px transparent;
		transition: box-shadow 0.3s ease;
		cursor: pointer;
	}

	.wrapper:hover {
		box-shadow: 0px 0px 30px rgba(0, 0, 0, 0.2);
	}

	.wrapper:hover img {
		transform: scale(1.2);
		filter: drop-shadow(0px 0px 20px rgba(0, 0, 0, 0.6));
	}

	.bottom {
		position: absolute;
		z-index: 2;
		bottom: 0px;
		width: 100%;
		overflow: hidden;
	}

	h3 {
		padding: 3px;
		text-shadow: 0px 0px 0px transparent;
		font-weight: medium;
		text-align: center;
		white-space: nowrap;
		transition: text-shadow 0.3 ease, box-shadow 0.3s ease;
	}

	.wrapper:hover h3 {
		text-shadow: 0px 0px 5px var(--background-color);
	}

	img {
		position: absolute;
		z-index: 0;
		width: 100%;
		height: 100%;
		transform: scale(1);
		transition: transform 0.8s ease, filter 0.8s ease;
		filter: drop-shadow(0px 0px 10px transparent);
	}

	.actions {
		max-height: 0px;
		overflow: hidden;
		border-radius: 0px 0px 10px 10px;
		transition: max-height 0.7s ease;
		display: flex;
	}

	.wrapper:hover .actions {
		max-height: 50px;
	}
</style>
