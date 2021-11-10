<script lang="ts" context="module">
  import { api } from '$lib';

  export async function load({ page }) {
    console.log('Looad', page.params);
    const report = await api.getReport(page.params.reportId);
    const reportLabels = await api.getAvailableLabels();
    return {
      props: {
        report,
        reportLabels,
      },
    };
  }
</script>

<script lang="ts">
  import { page } from '$app/stores';
  import { Detail, Select } from '$lib/components';
  import { onMount } from 'svelte';
  const { reportId } = $page.params;
  import { createAlert, StackTrace } from '@plantarium/ui';
  import { user } from '$lib/api';
  import { userStore } from '@plantarium/client-api';

  const {
    VITE_API_URL = 'http://localhost:3000',
    VITE_GH_ORG,
    VITE_GH_REPO,
  } = import.meta.env;
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
    if (res === 'yes') {
      deletePromise = api.deleteReport(reportId);
    }
  }

  onMount(async () => {
    api.getPermission();
    setTimeout(() => {
      initialized = true;
    }, 500);
  });
</script>

{#if !report}
  Loading ... {reportId}
{:else}
  <header class="flex justify-between border-bottom items-center">
    <h2 class="text-4xl">
      <b>{report.type}</b>
    </h2>

    <div>
      <a href={`${VITE_API_URL}/api/report/${reportId}`}>api</a>

      {#if publishPromise}
        <span>...</span>
      {/if}
      {#if report.gh_issue}
        <a
          href="https://api.github.com/repos/{VITE_GH_ORG}/{VITE_GH_REPO}/issues/{report.gh_issue}"
          >gh-api</a
        >
        <a
          href="https://github.com/{VITE_GH_ORG}/{VITE_GH_REPO}/issues/{report.gh_issue}"
          >gh-issue</a
        >

        {#if $userStore?.permissions?.includes('report.update')}
          <button
            class="publish"
            disabled={publishPromise}
            on:click={togglePublish}>unpublish</button
          >
        {/if}
      {:else if $userStore?.permissions?.includes('report.update')}
        <button
          class="publish"
          disabled={publishPromise}
          on:click={togglePublish}>publish</button
        >
      {/if}
    </div>
  </header>

  <hr class="my-2" />

  <h1 class="text-4xl">{report.title ? report.title : ''}</h1>

  <br />

  <p>{report.description}</p>

  <br />

  <h3>Tags:</h3>
  <Select bind:selected={labels} values={reportLabels} />

  <br />
  {#if report.browser}
    <h3>Browser:</h3>
    <pre><code>{JSON.stringify(report.browser, null, 2)}</code></pre>
    <br />
  {/if}

  {#if report.stacktrace}
    <div class="stack">
      <h3>StackTrace:</h3>
      <StackTrace stacktrace={report.stacktrace} />
    </div>
  {/if}

  <hr class="my-2" />

  <footer class="flex items-center justify-between mb-10">
    <Detail object={report} />

    {#if $userStore?.permissions?.includes("report.delete")}
    <button
      class="bg-red-600 rounded-md text-white px-2 py-1 self-start"
      on:click={deleteReport}>delete</button
    >
    {/if}
  </footer>
{/if}

<style>
  h3 {
    @apply text-md font-bold;
  }

  :global(.multiselect) {
    margin: 0px;
  }

  .stack > :global(.wrapper) {
    background: white;
    box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.1);
  }

  .publish {
    @apply bg-black rounded-md text-white p-2 py-1;
  }
</style>
