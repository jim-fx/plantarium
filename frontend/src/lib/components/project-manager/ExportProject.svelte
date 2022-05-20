<script lang="ts">
	import exportModel from '$lib/helpers/exportProject';
	import { cloneObject, download, wait } from '@plantarium/helpers';

	import type { PlantProject } from '@plantarium/types';
	import { Button, createToast } from '@plantarium/ui';
	import { createEventDispatcher } from 'svelte';
	import { settingsManager } from '..';

	const dispatch = createEventDispatcher();

	export let project: PlantProject;

	let textarea: HTMLTextAreaElement;

	$: cleaned = cleanProject(project);

	function cleanProject(p: PlantProject) {
		const clone = cloneObject(p);

		/* delete clone.meta.thumbnail; */
		delete clone.meta.lastSaved;
		delete clone.history;

		return clone;
	}

	async function handleObjDownload() {
		dispatch('close');
		createToast('Export started', { type: 'success' });
		await wait(100);
		exportModel(project, settingsManager.getSettings(), 'obj');
	}

	async function handleCopy() {
		dispatch('close');
		if (!textarea) textarea = document.createElement('textarea');
		textarea.value = JSON.stringify(cleaned);
		document.body.appendChild(textarea);
		textarea.select();
		document.execCommand('copy');
		textarea.blur();
		document.body.removeChild(textarea);
		createToast('Copied to clipboard', { type: 'success' });
	}
</script>

<div id="wrapper">
	<div id="header">
		<Button name="copy" on:click={handleCopy} />
		<Button
			name="download"
			on:click={() => download.json(cleaned, project.meta.name ?? `plant-${project.meta.id}`)}
		/>
		<Button name="download obj" on:click={handleObjDownload} />
	</div>
</div>

<style>
	#header {
		display: flex;
		--margin: 0px 10px 0px 0px;
	}
	#wrapper {
		max-height: 70vh;
		width: 100%;
		display: grid;
		grid-template-rows: min-content 1fr;
	}
</style>
