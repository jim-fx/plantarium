<script lang="ts">
	import { humane } from '@plantarium/helpers';
	import type { Project } from '@plantarium/types';
	import { createAlert, createToast } from '@plantarium/ui';
	import { projectManager } from '..';
	import ExportProject from '../project-manager/ExportProject.svelte';

	export let project: Project;

	let active = false;
	function fakeActive() {
		active = true;
		setTimeout(() => {
			active = false;
		}, 100);
		return true;
	}

	projectManager.on('loading', () => {
		active = false;
	});

	async function handleDelete() {
		const res = await createAlert(
			`Are you sure you want to delete ${project.meta.name ?? project.id}?`,
			{
				values: ['Yes', 'No']
			}
		);

		if (res === 'Yes') {
			await projectManager.deleteProject(project.id);
			createToast(`Project ${project.meta.name ?? project.id} deleted!`, { type: 'success' });
		}
	}
</script>

<div
	role="button"
	tabindex="0"
	class="project-wrapper"
	class:active={project.id === projectManager.activeProjectId || active}
	on:resize={alert}
	on:keydown={() => {
		fakeActive();
		projectManager.setActiveProject(project.id);
	}}
	on:click={() => {
		fakeActive();
		projectManager.setActiveProject(project.id);
	}}
>
	<div class="project-image">
		{#if project?.meta?.thumbnail}
			<img src={project?.meta.thumbnail} alt="thumbnail of project {project.meta.name}" />
		{/if}
		<!--  -->
	</div>
	<div class="project-content">
		<div class="project-content-header">
			<input
				contenteditable
				value={project?.meta.name}
				on:blur={function () {
					const value = this.value.split('\n').join('').trim();
					projectManager.updateProjectMeta(project.id, { name: value });
				}}
				on:keydown={function (ev) {
					if (ev.key === 'Enter') {
						const value = this.value.split('\n').join('').trim();
						ev.target.blur();
						ev.preventDefault();
						projectManager.updateProjectMeta(project?.id, { name: value });
					}
				}}
			/>

			<p>{humane.time(new Date().getTime() - project.updatedAt.getTime())} ago</p>
		</div>
		<div class="project-content-main" />
		<div class="project-content-footer">
			<button class="delete" on:click|stopPropagation={() => handleDelete()}>delete</button>
			<button
				class="export"
				on:click|stopPropagation={() =>
					createAlert(ExportProject, { props: { project }, timeout: 0 })}>export</button
			>
		</div>
	</div>
</div>

<style lang="scss">
	.project-wrapper {
		position: relative;
		min-height: 100px;
		padding: 4px;
		border-radius: 10px;
		display: grid;
		margin-bottom: 10px;
		grid-template-columns: 100px 1fr;
		color: #303030;

		> .project-image {
			/* background-image: url('../assets/rocky_dirt1-albedo.jpg');*/
			background-color: var(--accent);
			border-radius: 10px;
			background-size: cover;
			width: 100px;
			height: 100%;
			display: inline-block;
			> img {
				width: 100px;
				filter: drop-shadow(0px 0px 15px black);
			}
		}

		> .project-content {
			display: grid;
			grid-template-rows: auto 1fr auto;
			padding-left: 5px;

			> .project-content-header {
				display: flex;
				align-items: baseline;
				flex-wrap: wrap;
				justify-content: space-between;

				> input {
					color: var(--text-color);
					border: none;
					font-weight: bolder;
				}

				> p {
					font-size: 0.8em;
				}
			}

			> .project-content-footer {
				display: flex;
				align-items: baseline;
				flex-wrap: wrap;

				> button {
					font-size: 0.8em;
					border: none;
					border-radius: 6px;
					margin: 0;
					margin-right: 5px;

					&.delete {
						background-color: var(--error);
					}
				}
			}
		}

		&.active {
			background-color: lightblue;
		}
	}
</style>
