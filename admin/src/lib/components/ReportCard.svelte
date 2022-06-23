<script lang="ts">
  import { base } from '$app/paths';

  import { humane } from '$lib/helpers';
  import type { Report } from '@plantarium/backend';
  const { VITE_GH_ORG, VITE_GH_REPO } = import.meta.env;
  export let report: Report;

  $: secondsAgo = Math.floor(
    (Date.now() - new Date(report.createdAt).getTime()) / 1000,
  );
</script>

<a
  style={'background-color: var(--foreground-color)'}
  class="w-full p-4 block"
  class:closed={!report.open}
  href={base + '/reports/' + report._id}
>
  <div class="flex items-center py-1">
    <b class="text-xl">{report.type}</b>
    <p class="mx-2 whitespace-nowrap">{report.description}</p>
    {#if report.gh_issue}
      <a
        href="https://github.com/{VITE_GH_ORG}/{VITE_GH_REPO}/issues/{report.gh_issue}"
        >#{report.gh_issue}</a
      >
    {/if}
  </div>

  <div class="flex">
    <i class="text-xs">{humane.secondsToString(secondsAgo)} ago</i>
    {#if report.author}
      <b class="text-xs">
        &nbsp; by {report.author}
      </b>
    {/if}
  </div>
</a>

<style>
  a.closed {
    opacity: 0.5;
  }
</style>
