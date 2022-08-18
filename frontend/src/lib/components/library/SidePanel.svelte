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

	$: isRemote = $state === 'remote';

	export let project: Project;
</script>

<Button
	icon="arrow"
	name=""
	on:click={() => setActiveProject(null)}
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
		active={project?.likes?.includes($userStore['_id'])}
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
			<Button name="open" icon="link" on:click={() => openProject(project.id)} />
			<Button name="download" icon="import" on:click={() => downloadProject(project.id)} />
		{:else}
			<Button
				name="publish"
				--opacity={$isLoggedIn ? 1 : 0.2}
				icon="export"
				on:click={() => publishProject(project.id)}
			/>
			<Button
				name="export"
				icon="export"
				on:click={() => createAlert(ExportProject, { props: { project }, timeout: 0 })}
			/>

			<Button name="open" icon="link" on:click={() => openProject(project.id)} />
			<Button
				name="delete"
				icon="cross"
				--foreground-color="var(--error)"
				on:click={() => deleteProject(project.id)}
			/>
		{/if}
	</ButtonGroup>
</div>
