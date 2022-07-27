<script lang="ts">
	import {
		Button,
		InputCheckbox,
		Section,
		StackTrace,
		LogViewer,
		createToast,
		InputText
	} from '@plantarium/ui';
	import { onMount } from 'svelte';
	import { detect, api } from '../helpers';
	import { logger, parseStackTrace, compressLogs } from '@plantarium/helpers';
	import type { CreateReportDto } from '@plantarium/backend';
	import { createEventDispatcher } from 'svelte';
	import Icon from '@plantarium/ui/src/lib/Icon.svelte';
	export let mode: 'feat' | 'bug' = 'bug';
	let info = detect();

	let title: string;
	let description: string;
	let includeBrowserInfo = false;
	let includeLogs = false;
	const logs = logger.getHistory();
	export let error: Error;
	$: stackTrace = error && parseStackTrace(error);
	let includeStacktrace = true;

	type MakeReadable<T extends CreateReportDto> = {
		-readonly [K in keyof T]: T[K];
	};

	const dispatch = createEventDispatcher();

	let submitPromise: ReturnType<typeof api['submitReport']> | undefined;
	function submit() {
		const data = {
			type: mode,
			title,
			description
		} as MakeReadable<CreateReportDto>;

		if (includeStacktrace) {
			data.stacktrace = stackTrace;
		}

		if (includeBrowserInfo) {
			data.browser = detect();
			data.browser.screen = {
				width: window.innerWidth,
				height: window.innerHeight,
				dpi: window.devicePixelRatio
			};
		}

		if (includeLogs) {
			data.logs = compressLogs(logs);
		}

		submitPromise = api.submitReport(data);

		submitPromise.then((res) => {
			if (res.ok) {
				dispatch('close');
				createToast('Yeeeah, report submitted', { type: 'success' });
			} else {
				createToast(res.message, { type: 'error' });
			}
		});
	}

	onMount(async () => {
		if (stackTrace) {
			title = stackTrace.type + ': ' + stackTrace.title;
		}
	});
</script>

{#if submitPromise}
	{#await submitPromise}
		<h3>Submitting Report</h3>
		<Icon name="branch" animated --width="50px" />
	{:catch err}
		<p>Errror</p>
		<code>{JSON.stringify(err, null, 2)}</code>
		<button on:click={() => (submitPromise = undefined)}>go back</button>
	{/await}
{:else}
	<InputText placeholder="Title" bind:value={title} />

	<InputText
		type="area"
		bind:value={description}
		placeholder={mode === 'bug' ? 'Description of what happened.' : 'Please describe the idea.'}
	/>

	{#if mode === 'bug'}
		{#if stackTrace}
			<section>
				<div style="display:flex; align-items: center">
					<InputCheckbox bind:value={includeStacktrace} />
					<p style="margin-left: 5px;">Include StackTrace</p>
				</div>

				<div class="info">
					<Section name="What is that?">
						<StackTrace stacktrace={stackTrace} />
					</Section>
				</div>
			</section>
		{/if}

		<section>
			<div style="display:flex; align-items: center">
				<InputCheckbox bind:value={includeBrowserInfo} />
				<p style="margin-left: 5px;">Include Browser Info</p>
			</div>

			<div class="info">
				<Section name="What is that?">
					<p>
						This information makes it easier for a developer to track down what might have caused
						the bug.
					</p>
					<ul>
						<li>OS <i>({info.os})</i></li>
						<li>Browser <i>({info.name} / {info.version})</i></li>
						<li>
							Screen Resolution <i>({window.innerWidth}x{window.innerHeight})</i>
						</li>
						<li>
							Screen DPI <i>({window.devicePixelRatio})</i>
						</li>
					</ul>
				</Section>
			</div>
		</section>

		<section>
			<div style="display:flex; align-items: center">
				<InputCheckbox bind:value={includeLogs} />
				<p style="margin-left: 5px;">Include Logs</p>
			</div>

			<div class="info">
				<Section name="What is that?">
					<p>
						This information makes it easier for a developer to track down what might have caused
						the bug.
					</p>
					<LogViewer {logs} />
				</Section>
			</div>
		</section>
	{/if}
	<Button name="Submit" on:click={submit} />
{/if}

<style>
	section {
		margin: 1em 0px;
	}

	.info :global(*) {
		font-size: 0.9em !important;
	}

	label {
		font-size: 1em;
		color: var(--text-color);
	}

	textarea,
	input[type='text'] {
		box-sizing: border-box;
		color: var(--text-color);
		font-size: 0.8em;
		background-color: rgba(255, 255, 255, 0.2);
		border-radius: 5px;
		border: solid 2px rgba(255, 255, 255, 0.8);
		width: 100% !important;
		min-width: 100%;
		padding: 10px !important;
	}

	input[type='text'] {
		font-weight: bolder;
	}

	section :global(.multiselect) {
		margin: 0px;
	}

	section :global(.multiselect > svg) {
		display: none !important;
	}
	section :global(.multiselect > svg > path),
	section :global(.multiselect > button > svg > path),
	section :global(.multiselect ul > li > button > svg > path) {
		stroke: none !important;
		fill: var(--foreground-color);
	}

	section :global(.multiselect .options) {
		background: #e26565;
		box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
	}

	section :global(.multiselect .options > .selected) {
		border-color: var(--outline-color);
	}
</style>
