<script lang="ts">
	import { createAlert } from '@plantarium/ui';

	/* import ResizeObserver from 'svelte-resize-observer'; */
	import { projectManager } from '..';
	import { localState } from '../../helpers';
	import ImportProject from './ImportProject.svelte';
	import Project from './Project.svelte';

	const { store } = projectManager;
	export let visible;

	let searchTerm: string;

	function showProject(search, project: PlantProject) {
		if (!search || search.length < 1) return true;

		const projectName = project.meta.name.toLowerCase();
		search = search.toLowerCase();

		if (projectName.includes(search) || search.includes(projectName)) {
			return true;
		}

		return false;
	}

	const { width, height } = localState.get('projectManagerSize', {
		width: 300,
		height: (globalThis['innerHeight'] ?? 1) / 2
	});
</script>

<div class="project-manager-wrapper" style={`width: ${width}px; height: ${height}px;`}>
	<div class="header">
		<button class="add-new" on:click={() => projectManager.createNew()}>
			<p>new</p>
		</button>
		<button class="import" on:click={() => createAlert(ImportProject, { timeout: 0 })}>
			<p>import</p>
		</button>

		{#if $store.length > 3}
			<input type="text" class="search" placeholder="Search" bind:value={searchTerm} />
		{:else}
			<div />
		{/if}
		<!--<InputSelect values={['Date', 'Test', 'Test2']} />-->
	</div>

	{#if visible}
		<div class="project-list">
			{#each $store as project}
				{#if showProject(searchTerm, project)}
					<Project {project} />
				{/if}
			{/each}
		</div>
	{/if}
</div>

<style lang="scss">
	@use '~@plantarium/theme/src/themes.module.scss';

	.header {
		position: sticky;
		top: 0px;
		left: 0px;
		display: grid;
		grid-template-columns: auto 1fr auto auto;
		column-gap: 5px;
		padding: 7px;
		z-index: 99;
		min-height: 30px;
		padding-bottom: 0px;
		top: 0px;
		left: 0px;
		background: linear-gradient(0deg, #65e29f00 0%, #65e29f 50%);

		> button,
		input {
			height: 100%;
			border-radius: 5px;
			padding: 0px 10px;
			background-color: themes.$dark-green;
			color: white;
			font-size: 1em;
			border: none;
		}

		> :global(#main > *) {
			background-color: themes.$dark-green;
			font-size: 1em;
		}

		> button {
			cursor: pointer;
		}
	}

	.project-list {
		overflow-y: hidden;
		overflow-x: hidden;
		padding: 3px;
		padding-right: 7px;
		padding-top: 7px;
	}
</style>
