<script lang="ts" context="module">
	import * as projectStore from './project-store';

	const { setFilter, store: remotePlantStore } = projectStore;

	export async function load() {
		await setFilter({ official: true });
	}
</script>

<script lang="ts">
	import { projectManager } from '$lib/components';
	import api, { isLoggedIn, userStore } from '@plantarium/client-api';

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
	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';
	import ImportProject from '../project-manager/ImportProject.svelte';
	import ExportProject from '../project-manager/ExportProject.svelte';
	import InputCheckbox from '@plantarium/ui/src/lib/InputCheckbox.svelte';
	import { onMount } from 'svelte';
	import ApiWrapper from '$lib/elements/ApiWrapper.svelte';
	import type { Project } from '@plantarium/backend';

	const dispatch = createEventDispatcher();

	const localProjectStore = projectManager.store;

	let offline = false;

	const filter = {
		official: true,
		user: false,
		approved: false
	};
	$: setFilter(filter);

	let isRemote = writable(false);
	setContext('isRemote', isRemote);

	let searchText: string;

	let isLoading = false;
	let activeProjectPromise: Promise<Project> | undefined;

	async function handlePublish(id: string) {
		if (!$isLoggedIn) {
			createToast('Must be logged in to publish', { type: 'warning' });
			return;
		}

		const answer = await createAlert('If you publish it, everyone can download it.', {
			title: 'Sure?',
			values: ['Yes', 'No']
		});
		if (answer !== 'Yes') {
			return;
		}

		const p = (await loadPlant(id)) as Project;

		const r = await api.publishProject(p);

		p.data.meta.public = true;

		if (r.ok) {
			createToast('Published Project', { type: 'success' });
		} else {
			createToast(r.message, { type: 'error', title: 'Could not publish' });
		}
	}

	setContext('showPlant', showPlant);
	async function showPlant(id?: string) {
		if (!id) {
			activeProjectPromise = undefined;
			return;
		}
		if (activeProjectPromise) return;

		activeProjectPromise = loadPlant(id);
		let t = setTimeout(() => (isLoading = true), 500);
		activeProjectPromise.then((p) => {
			console.log(p);
			isLoading = false;
			clearTimeout(t);
		});
	}

	const getKey = (p: any) => {
		return p?.id || p?._id || p?.data?.meta?.id;
	};

	setContext('openPlant', openPlant);
	async function openPlant(id: string) {
		if ($isRemote) {
			let t = setTimeout(() => (isLoading = true), 500);
			loadPlant(id).then((project) => {
				isLoading = false;
				clearTimeout(t);
				dispatch('close');
				if (project) {
					projectManager.createNew(project.data);
				}
			});
		} else {
			dispatch('close');
			projectManager.setActiveProject(id);
		}
	}

	async function loadPlant(id: string) {
		if ($isRemote) {
			return await projectStore.loadPlant(id);
		}

		return {
			data: await projectManager.getProject(id)
		};
	}

	setContext('deletePlant', deletePlant);
	async function deletePlant(id: string) {
		let project = await loadPlant(id);

		if (!project) return;

		const res = await createAlert(
			`Are you sure you want to delete ${project.data.meta.name ?? project.data.meta.id}?`,
			{
				values: ['Yes', 'No']
			}
		);

		if (res === 'Yes') {
			await projectManager.deleteProject(project.data.meta.id);
			activeProjectPromise = undefined;
			createToast(`Project ${project.data.meta.name ?? project.data.meta.id} deleted!`, {
				type: 'success'
			});
		}
	}

	async function handleLike(projectId: string, like: boolean) {
		const res = await api[like ? 'likeProject' : 'unlikeProject'](projectId);
		if (!res.ok) {
			console.log({ res });
		}
	}

	onMount(() => {
		setFilter(filter);
	});
</script>

<div class="wrapper" class:activePlant={!isLoading && activeProjectPromise}>
	<aside>
		<InputTab
			values={['local', 'remote']}
			value="local"
			--width="100%"
			on:change={({ detail }) => {
				$isRemote = detail === 'remote';
				if (activeProjectPromise) {
					activeProjectPromise = undefined;
				}
			}}
		/>

		<br />
		<input type="text" bind:value={searchText} placeholder="Search.." />

		<br />

		{#if $isRemote && !offline}
			<div class="filter-types">
				<InputCheckbox label="Official" bind:value={filter.official} />
				<InputCheckbox label="Approved" bind:value={filter.approved} />
				<InputCheckbox label="User" bind:value={filter.user} />
			</div>
		{/if}

		<div class="actions">
			{#if !$isRemote}
				<Button
					icon="import"
					name="import"
					--foreground-color="var(--background-color)"
					on:click={() => createAlert(ImportProject, { timeout: 0 })}
				/>
			{/if}
		</div>
	</aside>

	<main>
		{#if isLoading}
			<Icon name="branch" animated />
		{:else if activeProjectPromise}
			<PlantView project={activeProjectPromise} />
		{:else if $isRemote}
			<ApiWrapper bind:offline>
				<div class="list">
					{#each $remotePlantStore as project (getKey(project))}
						<ProjectCard isRemote={$isRemote} {project} />
					{/each}
				</div>
			</ApiWrapper>
		{:else}
			<div class="list">
				{#each $localProjectStore as plant}
					<ProjectCard isRemote={$isRemote} {plant} />
				{/each}
			</div>
		{/if}
	</main>

	<aside>
		{#if activeProjectPromise}
			<Button icon="arrow" name="" on:click={() => showPlant()} />
			{#await activeProjectPromise}
				<Icon name="branch" animated />
			{:then project}
				<h1>{project.data.meta.name}</h1>

				{#if project.data?.meta?.latinName}
					{#if project.data?.meta?.gbifID}
						<a href="https://www.gbif.org/species/{project.data.meta.gbifID}" target="__blank"
							>{project.data.meta.latinName}</a
						>
					{:else}
						<a
							href="https://www.gbif.org/search?q={encodeURIComponent(project.data.meta.latinName)}"
							target="__blank">{project.data.meta.latinName}</a
						>
					{/if}
				{/if}

				{#if $isRemote}
					{#if project.data?.meta?.authorID}
						<br />
						<br />
						<p>by <i>{project.data.meta.authorID}</i></p>
					{/if}

					<br />
					<LikeButton
						on:click={(ev) => handleLike(project._id, ev.detail)}
						likeAmount={project?.likes?.length - (project.likes.includes($userStore?.id) ? 1 : 0)}
						active={project?.likes?.includes($userStore.id)}
					/>
				{/if}

				{#if project.data?.meta?.description}
					<br />
					<br />
					<p>{project.data.meta.description}</p>
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
								name="download"
								icon="import"
								--foreground-color="var(--background-color)"
								on:click={() => openPlant(plant.meta.id)}
							/>
						{:else}
							<Button
								name="publish"
								--opacity={$isLoggedIn ? 1 : 0.2}
								--foreground-color="var(--background-color)"
								icon="export"
								on:click={() => handlePublish(plant.meta.id)}
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
		background-color: var(--background-color);
		grid-template-columns: 200px 1fr 0px;
	}
	.activePlant {
		grid-template-columns: min-content 1fr 300px;
	}

	.filter-types {
		display: grid;
		row-gap: 15px;
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
		background-color: var(--midground-color);
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

	main {
		padding: 20px;
	}
</style>
