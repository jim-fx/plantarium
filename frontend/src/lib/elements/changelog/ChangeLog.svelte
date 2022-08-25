<script>
	import Commit from './Commit.svelte';
	import { commits, fetchCommits } from './store';

	fetchCommits();

	let day = $commits.length && new Date($commits[0].date).getDay();

	const checkDate = (commit) => {
		const d = new Date(commit.date);
		if (d.getDay() != day) {
			day = d.getDay();
			return true;
		}
		return false;
	};

	const prettyDate = (date) => {
		return new Date(date).toLocaleDateString();
	};
</script>

<h1>Changelog</h1>

<div>
	{#each $commits as commit}
		{#if checkDate(commit)}
			<h3>
				{prettyDate(commit.date)}
			</h3>
		{/if}
		<Commit {commit} />
	{/each}
</div>

<style>
	h3 {
		margin-top: 20px;
	}
	div {
		max-width: 640px;
		margin: 0 auto;
		height: 70vh;
		overflow-y: auto;
	}
</style>
