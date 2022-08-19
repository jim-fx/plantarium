<script lang="ts">
	import { Button } from '@plantarium/ui';
	import type { Project } from '@plantarium/types';
	import { deleteProject, downloadProject, openProject, setActiveProject } from './common';
	import { newIDS, state, transitionImage } from './stores';

	export let project: Project | undefined = undefined;

	$: isRemote = $state === 'remote';
	$: newProject = !isRemote && $newIDS.includes(project.id);

	let img: HTMLImageElement;
</script>

<div class="wrapper" class:newProject>
	<div class="bottom">
		<h3>{project.meta.name}</h3>
		<div class="actions">
			<Button
				on:click={() =>
					isRemote
						? downloadProject(project.id).then(() => ($transitionImage = img))
						: openProject(project.id)}
				icon={isRemote ? 'import' : 'link'}
				name={isRemote ? '' : 'open'}
				--foreground-color="var(--midground-color)"
			/>

			{#if !isRemote}
				<Button
					on:click={() => deleteProject(project.id)}
					name="delete"
					--foreground-color="var(--error)"
				/>
			{/if}
		</div>
	</div>
	{#if project.meta.thumbnail}
		<img
			src={project.meta.thumbnail}
			bind:this={img}
			alt=""
			on:click={() => setActiveProject(project.id)}
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
		transition: box-shadow 0.3s ease, outline 0.3s ease;
		outline: solid thin transparent;
		cursor: pointer;
	}

	.newProject::before {
		content: 'new';
		background: var(--text-color);
		color: var(--background-color);
		height: 20px;
		padding: 5px;
		border-radius: 5px;
		position: absolute;
		top: 10px;
		left: 10px;
		opacity: 0.8;
	}

	.wrapper:hover {
		box-shadow: 0px 0px 30px rgba(0, 0, 0, 0.2);
		outline: solid thin var(--outline-color);
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
