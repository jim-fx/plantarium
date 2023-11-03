<script lang="ts">
	import type { Project } from '@plantarium/types';
	import api, { isLoggedIn, userStore } from '@plantarium/client-api';

	import ExportProject from '../project-manager/ExportProject.svelte';
	import { Button, createAlert, InputEditable, ButtonGroup, LikeButton } from '@plantarium/ui';

	import { state } from './stores';
	import {
		deleteProject,
		downloadProject,
		handleLike,
		openProject,
		publishProject,
		setActiveProject,
		setProjectName
	} from './common';
	import { onMount } from 'svelte';

	$: isRemote = $state === 'remote';

	$: isOwnProject = $isLoggedIn && project?.public && $userStore?.['_id'] === project.author;

	export let project: Project;

	onMount(() => {
		console.log({ project, user: $userStore });
	});
</script>

<Button
	icon="arrow"
	on:click={() => setActiveProject(undefined)}
	--foreground-color="transparent"
/>
{#if isRemote}
	<h1>{project.meta.name}</h1>
{:else}
	<InputEditable
		value={project.meta.name}
		on:submit={({ detail }) => {
			project.meta.name = detail;
			setProjectName(project.id, detail);
		}}
	/>
{/if}

{#if project.meta?.scientificName}
	{#if project.meta?.gbifID}
		<a href="https://www.gbif.org/species/{project.meta.gbifID}" target="__blank"
			>{project.meta.scientificName}</a
		>
	{:else}
		<a
			href="https://www.gbif.org/search?q={encodeURIComponent(project.meta.scientificName)}"
			target="__blank">{project.meta.scientificName}</a
		>
	{/if}
	<br />
{/if}

{#if isRemote}
	{#if project?.author}
		<br />
		{#await api.getUserName(project.author)}
			<p>by <i>{project.author}</i></p>
		{:then name}
			<p>by <i>{name}</i></p>
		{/await}
	{/if}

	<br />
	<LikeButton
		on:click={(ev) => handleLike(project.id, ev.detail)}
		disabled={!$isLoggedIn}
		likeAmount={project?.likes?.length}
		active={$userStore?._id ? project.likes.includes($userStore?._id) : false}
	/>
{/if}

{#if project?.meta?.description}
	<br />
	<p>{project.meta.description}</p>
{/if}
<br />

<div class="actions">
	<ButtonGroup direction={isRemote ? 'horizontal' : 'vertical'}>
		{#if isRemote}
			<Button icon="link" on:click={() => openProject(project.id)}>open</Button>
			<Button icon="import" on:click={() => downloadProject(project.id)}>download</Button>

			{#if isOwnProject}
				<p>This is yoours</p>
			{/if}
		{:else}
			{#if isOwnProject}
				<Button
					--opacity={$isLoggedIn ? 1 : 0.2}
					icon="checkmark"
					on:click={() => publishProject(project.id)}>published</Button
				>
			{:else}
				<Button
					--opacity={$isLoggedIn ? 1 : 0.2}
					icon="export"
					on:click={() => publishProject(project.id)}>publish</Button
				>
			{/if}
			<Button
				icon="export"
				on:click={() => createAlert(ExportProject, { props: { project }, timeout: 0 })}
				>export</Button
			>

			<Button icon="link" on:click={() => openProject(project.id)}>open</Button>
			<Button
				icon="cross"
				--foreground-color="var(--error)"
				on:click={() => deleteProject(project.id)}>delete</Button
			>
		{/if}
	</ButtonGroup>
</div>
