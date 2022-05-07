<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { projectManager } from '..';

	let inputText: string;
	$: [parsed, errors] = checkErrors(inputText) as [PlantProject, string[]];

	function checkErrors(s: string) {
		console.log({ s });
		let parsed;
		try {
			parsed = JSON.parse(s);
		} catch (err) {
			if (err) {
				return [null, ['Not valid JSON', err.message]];
			}
		}

		//TODO: Check if valid json

		return [parsed, []];
	}

	function handleFileChange(e: Event) {
		const text = e.target.files[0];
		let reader = new FileReader();
		reader.readAsText(text);
		reader.onload = (e) => {
			inputText = e.target.result as string;
		};
	}

	const dispatch = createEventDispatcher();

	function handleFinishImport() {
		console.log(parsed);

		projectManager.createNew(parsed);

		dispatch('close');
	}
</script>

<h2>Import</h2>

{#if !inputText}
	<label for="file">file</label>
	<input type="file" id="file" on:change={handleFileChange} accept="application/json" />

	<p>Copy Here:</p>
	<textarea name="" id="" bind:value={inputText} cols="30" rows="10" />
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
	<button on:click={handleFinishImport}>Finish Import</button>
{/if}
