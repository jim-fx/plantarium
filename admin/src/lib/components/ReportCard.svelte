<script lang="ts">
import { base } from '$app/paths';

	import { humane } from '$lib/helpers';

	export let report;

	$: secondsAgo = Math.floor((Date.now() - new Date(report.createdAt).getTime()) / 1000);
</script>

<a class="bg-white w-min p-4 block" href={base+"/reports/"+report.id}>

	<div class="flex items-center py-1">
	<b class="text-xl">{report.type}</b>
	<p class="mx-2 whitespace-nowrap">{report.description}</p>
	</div>

<div class="flex">
	<i class="text-xs">{humane.secondsToString(secondsAgo)} ago</i>
	</div>	

	
</a>
