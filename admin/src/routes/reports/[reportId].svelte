<script lang="ts" context="module">
	import { api } from '$lib';

	export async function load({ page }) {
		console.log('Looad', page.params);
		const report = await api.getReport(page.params.reportId);
		const reportLabels = await api.getAvailableLabels();
		return {
			props: {
				report,
				reportLabels
			}
		};
	}
</script>

<script lang="ts">
	import { page } from '$app/stores';
	import { Detail, Select } from '$lib/components';
	import { onMount } from 'svelte';
	const { reportId } = $page.params;
	import { createAlert } from '@plantarium/ui';

	const { VITE_API_URL = 'http://localhost:3000', VITE_GH_ORG, VITE_GH_REPO } = import.meta.env;
	export let report;
	export let reportLabels;
	let initialized = false;

	let publishPromise;
	async function togglePublish() {
		if (publishPromise) return;
		if (!report.gh_issue) {
			publishPromise = api.publishReport(reportId);
		} else {
			publishPromise = api.unpublishReport(reportId);
		}
		report.gh_issue = await publishPromise;
		report = report;
		publishPromise.then(() => (publishPromise = null));
	}

	let labels = report.labels;
	$: report.labels = labels;
	$: report.labels && labels && updateLabels();
	let labelPromise;
	async function updateLabels() {
		if (!initialized) return;
		labelPromise = api.setReportLabels(reportId, labels);
	}

  let deletePromise;
	async function deleteReport() {
		const res = await createAlert('Delete Report?', { values: ['yes', 'no'] });
		if(res === "yes"){
      deletePromise = api.deleteReport(reportId);
    }
	}

	onMount(async () => {
		setTimeout(() => {
			initialized = true;
		}, 500);
	});
</script>

{#if !report}
	Loading ... {reportId}
{:else}
	<header class="flex justify-between border-bottom items-center">
		<h1 class="text-4xl"><b>{report.type}</b> {report.title ? report.title : ''}</h1>

		<div>
			<a href={`${VITE_API_URL}/api/report/${reportId}`}>api</a>

			{#if publishPromise}
				<span>...</span>
			{/if}
			{#if report.gh_issue}
				<a href="https://api.github.com/repos/{VITE_GH_ORG}/{VITE_GH_REPO}/issues/{report.gh_issue}"
					>gh-api</a
				>
				<a href="https://github.com/{VITE_GH_ORG}/{VITE_GH_REPO}/issues/{report.gh_issue}">issue</a>
				<button class="publish" disabled={publishPromise} on:click={togglePublish}>unpublish</button
				>
			{:else}
				<button class="publish" disabled={publishPromise} on:click={togglePublish}>publish</button>
			{/if}
		</div>
	</header>

	<hr class="my-2" />

	<Select bind:selected={labels} values={reportLabels} />

	<p class="my-6">{report.description}</p>

	<hr class="my-2" />

	<footer class="flex items-center justify-between">
		<Detail object={report} />
		<button class="bg-red-600 rounded-md text-white px-2 py-1 self-start" on:click={deleteReport}>delete</button>
	</footer>
{/if}

<style>
	.publish {
		@apply bg-black rounded-md text-white p-2 py-1;
	}
</style>
