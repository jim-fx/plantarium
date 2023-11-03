<script lang="ts">
	import { validator } from '@plantarium/helpers';
	import type { Project } from '@plantarium/types';

	import { InputTab } from '@plantarium/ui';
	import { createEventDispatcher } from 'svelte';
	import { projectManager } from '..';

	let inputText: string;
	let inputType = 'clipboard';
	$: [parsed, errors] = checkErrors(inputText) as [Project, string[]];

	function checkErrors(s: string) {
		let parsed: Project;
		try {
			parsed = JSON.parse(s);

			const err = validator.isPlantProject(parsed);

			if (err?.length) return [null, err];

			return [parsed, []];
		} catch (err) {
			if (err) {
				return [null, ['Not valid JSON', err?.message]];
			}
		}
	}

	function handleFileChange(e: Event) {
		const target = e.target as HTMLInputElement;
		const text = target.files?.[0];
		if (!text) return;
		let reader = new FileReader();
		reader.readAsText(text);
		reader.onload = (e) => {
			inputText = e.target?.result as string;
		};
	}

	const dispatch = createEventDispatcher();

	async function handleFinishImport(project = parsed) {
		const p = await projectManager.createNew(project);
		projectManager.setActiveProject(p.id);
		dispatch('close');
	}
</script>

<h2>Import</h2>

{#if !inputText}
	<InputTab values={['clipboard', 'file']} bind:value={inputType} />
	<br />
	{#if inputType === 'clipboard'}
		<p>Paste Here:</p>
		<textarea name="" id="" bind:value={inputText} cols="30" rows="10" />
	{:else if inputType === 'file'}
		<label for="file">file</label>
		<input type="file" id="file" on:change={handleFileChange} accept="application/json" />
	{/if}
{:else if errors.length}
	<p>Errors</p>
	{#each errors as err}
		<p>{err}</p>
	{/each}
	<button
		on:click={() => {
			inputText = '';
		}}>okay</button
	>
{:else if parsed}
	<p>Seems all right</p>
	<button on:click={() => handleFinishImport()}>Finish Import</button>
{/if}

<style>
	textarea {
		background-color: var(--midground-color);
		color: var(--text-color);
		border-radius: 10px;
	}
</style>
