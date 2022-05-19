<script lang="ts">
	import { InputTab, Button } from '@plantarium/ui';
	import { createEventDispatcher } from 'svelte';
	import { projectManager } from '..';

	import examples from './examples';

	console.log({ examples });

	let inputText: string;
	let inputType = 'examples';
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

	function handleFinishImport(project = parsed) {
		projectManager.createNew(project);
		dispatch('close');
	}
</script>

<h2>Import</h2>

{#if !inputText}
	<InputTab values={['clipboard', 'file', 'examples']} bind:value={inputType} />
	<br />
	{#if inputType === 'clipboard'}
		<p>Paste Here:</p>
		<textarea name="" id="" bind:value={inputText} cols="30" rows="10" />
	{:else if inputType === 'file'}
		<label for="file">file</label>
		<input type="file" id="file" on:change={handleFileChange} accept="application/json" />
	{:else if inputType === 'examples'}
		<div class="example-wrapper">
			{#each examples as example}
				<div class="example">
					{#if example?.meta?.thumbnail}
						<img src={example.meta.thumbnail} alt="" />
					{/if}
					<div>
						<h3>{example?.meta.name}</h3>
						<Button name="import" icon="checkmark" on:click={() => handleFinishImport(example)} />
					</div>
				</div>
			{/each}
		</div>
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
	<button on:click={handleFinishImport}>Finish Import</button>
{/if}

<style>
	.example-wrapper > .example {
		display: flex;
		padding: 10px;
		box-sizing: border-box;
		border: solid thin var(--outline-color);
		border-radius: 5px;
		margin-bottom: 10px;
	}

	.example > img {
		margin-right: 10px;
	}

	textarea {
		background-color: var(--midground-color);
		color: var(--text-color);
		border-radius: 10px;
	}
</style>
