<script lang="ts">
	import { projectManager } from '$lib/components';

	import examples from '../project-manager/examples';

	import {
		InputTab,
		Button,
		Icon,
		LikeButton,
		ButtonGroup,
		createAlert,
		createToast
	} from '@plantarium/ui';
	import { createEventDispatcher } from 'svelte';
	import ProjectCard from './ProjectCard.svelte';
	import PlantView from './PlantView.svelte';
	import type { PlantProject } from '@plantarium/types';
	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';
	import InputText from '@plantarium/ui/src/lib/InputText.svelte';
	import ImportProject from '../project-manager/ImportProject.svelte';
	import ExportProject from '../project-manager/ExportProject.svelte';

	const dispatch = createEventDispatcher();

	const localPlantStore = projectManager.store;

	let isRemote = writable(false);
	setContext('isRemote', isRemote);

	let searchText: string;

	let isLoading = false;
	let activePlantPromise: Promise<PlantProject> | undefined;

	setContext('showPlant', showPlant);
	async function showPlant(id?: string) {
		if (!id) {
			activePlantPromise = undefined;
			return;
		}
		if (activePlantPromise) return;

		activePlantPromise = loadPlant(id);
		let t = setTimeout(() => (isLoading = true), 500);
		activePlantPromise.then(() => {
			isLoading = false;
			clearTimeout(t);
		});
	}

	setContext('openPlant', openPlant);
	async function openPlant(id: string) {
		if ($isRemote) {
			let t = setTimeout(() => (isLoading = true), 500);
			loadPlant(id).then((project) => {
				isLoading = false;
				clearTimeout(t);
				dispatch('close');
				projectManager.createNew(project);
			});
		} else {
			dispatch('close');
			projectManager.setActiveProject(id);
		}
	}

	async function loadPlant(id: string) {
		if ($isRemote) {
			const p = examples.find((e) => e.meta.id === id);

			if (p) return p;

			alert('Eyyy');

			// TODO: implement load
		}
		return projectManager.getProject(id);
	}

	setContext('deletePlant', deletePlant);
	async function deletePlant(id: string) {
		let plant = await loadPlant(id);

		const res = await createAlert(
			`Are you sure you want to delete ${plant.meta.name ?? plant.meta.id}?`,
			{
				values: ['Yes', 'No']
			}
		);

		if (res === 'Yes') {
			await projectManager.deleteProject(plant.meta.id);
			activePlantPromise = undefined;
			createToast(`Project ${plant.meta.name ?? plant.meta.id} deleted!`, { type: 'success' });
		}
	}
</script>

<div class="wrapper" class:activePlant={!isLoading && activePlantPromise}>
	<aside>
		<InputTab
			values={['local', 'remote']}
			value="local"
			--width="100%"
			on:change={({ detail }) => {
				$isRemote = detail === 'remote';
				if (activePlantPromise) {
					activePlantPromise = undefined;
				}
			}}
		/>

		<br />
		<input type="text" bind:value={searchText} placeholder="Search.." />

		<br />
		<br />

		<div class="actions">
			<Button
				icon="import"
				name="import"
				--foreground-color="var(--background-color)"
				on:click={() => createAlert(ImportProject, { timeout: 0 })}
			/>
		</div>
	</aside>

	<main>
		{#if isLoading}
			<Icon name="branch" animated />
		{:else if activePlantPromise}
			<PlantView plant={activePlantPromise} />
		{:else if $isRemote}
			<div class="list">
				{#each examples as plant}
					<ProjectCard isRemote={$isRemote} {plant} />
				{/each}
			</div>
		{:else}
			<div class="list">
				{#each $localPlantStore as plant}
					<ProjectCard isRemote={$isRemote} {plant} />
				{/each}
			</div>
		{/if}
	</main>

	<aside>
		{#if activePlantPromise}
			<Button icon="arrow" name="" on:click={() => showPlant()} />
			{#await activePlantPromise}
				<p />
			{:then plant}
				<h1>{plant.meta.name}</h1>

				{#if plant?.meta?.latinName}
					{#if plant?.meta?.gbifID}
						<a href="https://www.gbif.org/species/{plant.meta.gbifID}" target="__blank"
							>{plant.meta.latinName}</a
						>
					{:else}
						<a
							href="https://www.gbif.org/search?q={encodeURIComponent(plant.meta.latinName)}"
							target="__blank">{plant.meta.latinName}</a
						>
					{/if}
				{/if}

				{#if $isRemote}
					{#if plant?.meta?.authorID}
						<br />
						<br />
						<p>by <i>{plant.meta.authorID}</i></p>
					{/if}

					<br />
					<LikeButton />
				{/if}

				{#if plant?.meta?.description}
					<br />
					<br />
					<p>{plant.meta.description}</p>
				{/if}
				<br />

				<div class="actions">
					<ButtonGroup vertical={!$isRemote}>
						{#if $isRemote}
							<Button
								name="open"
								icon="link"
								--foreground-color="var(--background-color)"
								on:click={() => {}}
							/>
							<Button
								name="load"
								icon="import"
								--foreground-color="var(--background-color)"
								on:click={() => openPlant(plant.meta.id)}
							/>
						{:else}
							<Button
								name="publish"
								icon="export"
								--foreground-color="var(--background-color)"
								on:click={() => createToast('Not yet implemented')}
							/>
							<Button
								name="export"
								icon="export"
								--foreground-color="var(--background-color)"
								on:click={() =>
									createAlert(ExportProject, { props: { project: plant }, timeout: 0 })}
							/>

							<Button
								name="open"
								icon="link"
								--foreground-color="var(--background-color)"
								on:click={() => openPlant(plant.meta.id)}
							/>
							<Button
								name="delete"
								icon="cross"
								--foreground-color="var(--error)"
								on:click={() => deletePlant(plant.meta.id)}
							/>
						{/if}
					</ButtonGroup>
				</div>
			{/await}
		{/if}
	</aside>
</div>

<style>
	.wrapper {
		min-width: 80vw;
		min-height: 80vh;
		display: grid;
		overflow: hidden;
		transition: grid-template-columns 0.3s ease;
		background-color: var(--midground-color);
		grid-template-columns: 200px 1fr 0px;
	}
	.activePlant {
		grid-template-columns: min-content 1fr 300px;
	}

	.list {
		display: flex;
		flex-wrap: wrap;
	}

	aside {
		overflow: hidden;
		overflow-y: auto;
		box-sizing: content-box;
		padding: 15px;
		opacity: 1;
		background-color: var(--foreground-color);
		transition: opacity 0.3s ease, padding 0.3s ease, max-width 0.3s ease, opacity 0.3s ease;
	}

	aside:first-child {
		max-width: 200px;
		overflow: hidden;
	}

	aside:first-child:hover {
		opacity: 1 !important;
		max-width: 200px !important;
	}

	.activePlant > aside:first-child {
		opacity: 0.5;
		max-width: 20px;
	}

	.activePlant main {
		display: grid;
		place-items: center;
	}

	aside:last-child {
		opacity: 0;
		padding: 0px;
	}
	.activePlant > aside:last-child {
		opacity: 1;
		padding: 10px;
	}

	.actions {
	}

	main {
		padding: 20px;
	}
</style>
