<script lang="ts">
	import { getReports } from '@plantarium/client-api';
	import { Icon } from '@plantarium/ui';

	import type { Report } from '@plantarium/backend';

	import { slide } from 'svelte/transition';

	let loading = true;

	let openReports: (Report & { _expanded?: boolean })[] = [];
	let closedReports: (Report & { _expanded?: boolean })[] = [];

	getReports().then((res) => {
		if (res.ok) {
			const reports = res.data;
			reports.forEach((re) => {
				if (re.open) {
					openReports.push(re);
				} else {
					closedReports.push(re);
				}
			});
		}

		loading = false;
	});
</script>

{#if loading}
	<h3>Loading..</h3>
	<Icon name="branch" animated --width="40px" />
{:else}
	{#if openReports.length}
		<h3>Open Reports:</h3>
		<hr />
		<div class="reports-wrapper">
			{#each openReports as report}
				<div
					role="button"
					tabindex="0"
					class="report"
					class:expanded={report._expanded}
					on:keydown={() => (report._expanded = !report._expanded)}
					on:click={() => (report._expanded = !report._expanded)}
				>
					<div class="report-header">
						<b>{report.type}:</b>
						<span>{report.title}</span>
						{#if report.gh_issue}
							<a
								href="https://github.com/jim-fx/plantarium/issues/{report.gh_issue}"
								target="__blank">Github Issue</a
							>
						{/if}
					</div>
					{#if report._expanded}
						<h3>description:</h3>
						<p transition:slide>{report.description}</p>
					{/if}
				</div>
			{/each}
		</div>
		<br />
		<br />
	{/if}

	{#if closedReports.length}
		<h3>Closed Reports</h3>
		<hr />
		<div class="reports-wrapper">
			{#each closedReports as report}
				<div
					role="button"
					tabindex="0"
					class="report"
					class:expanded={report._expanded}
					on:keydown={() => (report._expanded = !report._expanded)}
					on:click={() => (report._expanded = !report._expanded)}
				>
					<div class="report-header">
						<b>{report.type}:</b>
						<span>{report.title}</span>
						{#if report.gh_issue}
							<a
								href="https://github.com/jim-fx/plantarium/issues/{report.gh_issue}"
								target="__blank">Github Issue</a
							>
						{/if}
					</div>
					{#if report._expanded}
						<h3>description:</h3>
						<p transition:slide>{report.description}</p>
					{/if}
				</div>
			{/each}
		</div>
	{/if}
{/if}

<style>
	.reports-wrapper {
		max-height: 30vh;
		overflow-y: auto;
	}

	a {
		color: var(--text-color);
	}

	.report {
		background-color: var(--midground-color);
		padding: 10px;
		border-radius: 5px;
		margin-bottom: 10px;
	}
</style>
