<script lang="ts">
	import { projectManager } from '$lib/components';

	import { InputTab, Button, Icon, InputText, createAlert, InputCheckbox } from '@plantarium/ui';
	import ProjectCard from './ProjectCard.svelte';
	import PlantView from './PlantView.svelte';
	import ImportProject from '../project-manager/ImportProject.svelte';
	import { onMount } from 'svelte';
	import ApiWrapper from '$lib/elements/ApiWrapper.svelte';
	import * as projectStore from './project-store';
	import { state, isLoading, activeProject, newIDS, transitionImage } from './stores';
	import SidePanel from './SidePanel.svelte';
	import { scale } from 'svelte/transition';
	import FlyImage from './FlyImage.svelte';

	const remoteProjectStore = projectStore.store;
	const localProjectStore = projectManager.store;

	let offline = false;

	$: isRemote = $state === 'remote';

	const filter = {
		official: true,
		user: false,
		approved: false,
		search: ''
	};
	$: if (filter) {
		$activeProject = null;
		projectStore.setFilter(filter);
	}

	$: if ($state === 'remote') {
		projectStore.setFilter(filter);
	}

	let transitionImages = [];
	let aside: HTMLElement;

	transitionImage.subscribe((img) => {
		if (img) {
			transitionImages = [...transitionImages, img];
			setTimeout(() => {
				transitionImages = transitionImages.filter((i) => i !== img);
			}, 1200);
		}
	});

	onMount(() => {
		projectStore.setFilter(filter);
	});
</script>

{#each transitionImages as img}
	<FlyImage target={aside} {img} />
{/each}

<div class="wrapper" class:activePlant={!$isLoading && $activeProject}>
	<aside bind:this={aside}>
		{#if $newIDS.length}
			<span class="hint" transition:scale>{$newIDS.length}</span>
		{/if}

		<InputTab
			values={['local', 'remote']}
			value={$state}
			--width="100%"
			on:change={({ detail }) => {
				$state = detail;
				$activeProject = null;
			}}
		/>

		<InputText placeholder="Search" --width="100%" bind:value={filter.search} />

		<br />

		{#if isRemote && !offline}
			<div class="filter-types">
				<InputCheckbox label="Official" bind:value={filter.official} />
				<InputCheckbox label="Approved" bind:value={filter.approved} />
				<InputCheckbox label="User" bind:value={filter.user} />
			</div>
		{/if}

		<div class="actions">
			{#if !isRemote}
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
		{#if $isLoading && !$activeProject}
			<Icon name="branch" animated />
		{:else if $activeProject}
			<PlantView project={$activeProject} />
		{:else if isRemote}
			<ApiWrapper bind:offline>
				<div class="list">
					{#each $remoteProjectStore as project (project.id)}
						<ProjectCard {project} />
					{/each}
				</div>
			</ApiWrapper>
		{:else}
			<div class="list">
				{#each $localProjectStore as project (project.id)}
					{#if !filter?.search?.length || projectStore.applySearchTerm(project, filter?.search)}
						<ProjectCard {project} />
					{/if}
				{/each}
			</div>
		{/if}
	</main>

	<aside>
		{#if $isLoading}
			<p>Loading...</p>
		{:else if $activeProject}
			<SidePanel project={$activeProject} />
		{/if}
	</aside>
</div>

<style>
	.wrapper {
		width: 100vw;
		height: 100%;
		display: grid;
		overflow: hidden;
		transition: grid-template-columns 0.3s ease;
		background-color: var(--background-color);
		grid-template-columns: 200px 1fr 0px;
	}
	.activePlant {
		grid-template-columns: 200px 1fr 300px;
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
		position: relative;
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

	/* .activePlant > aside:first-child { */
	/* 	opacity: 0.5; */
	/* 	max-width: 20px; */
	/* } */

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

	.hint {
		background: var(--text-color);
		color: var(--background-color);
		border-radius: 100%;
		width: 15px;
		height: 15px;
		display: block;
		text-align: center;
		line-height: 1.4em;
		font-weight: bold;
		font-size: 0.7em;
		position: absolute;
		top: 10px;
		left: 10px;
		z-index: 99;
	}
</style>
