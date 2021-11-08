<script lang="ts">
	import { base } from '$app/paths';

	import { humane } from '$lib/helpers';
	const { VITE_GH_ORG, VITE_GH_REPO } = import.meta.env;
	export let report;

	$: secondsAgo = Math.floor((Date.now() - new Date(report.createdAt).getTime()) / 1000);
</script>

<a class="bg-white w-full p-4 block" href={base + '/reports/' + report.id}>
	<div class="flex items-center py-1">
		<b class="text-xl">{report.type}</b>
		<p class="mx-2 whitespace-nowrap">{report.description}</p>
		{#if report.gh_issue}
			<a href="https://github.com/{VITE_GH_ORG}/{VITE_GH_REPO}/issues/{report.gh_issue}"
				>#{report.gh_issue}</a
			>
		{/if}
	</div>

	<div class="flex">
		<i class="text-xs">{humane.secondsToString(secondsAgo)} ago</i>
	</div>
</a>
