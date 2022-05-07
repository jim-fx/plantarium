<script lang="ts">
	export let project: PlantProject;

	let textarea: HTMLTextAreaElement;

	$: cleaned = cleanProject(project);

	function cleanProject(p: PlantProject) {
		const clone = JSON.parse(JSON.stringify(p)) as typeof p;

		delete clone.meta.thumbnail;
		delete clone.meta.lastSaved;
		delete clone.history;

		return clone;
	}

	function handleCopy() {
		textarea.value = JSON.stringify(cleaned);
		textarea.select();
		document.execCommand('copy');
		textarea.blur();
	}
</script>

<div id="wrapper">
	<div id="header">
		<button name="copy" on:click={handleCopy}>copy</button>
		<a
			href={'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(cleaned))}
			download={`${project.meta.name ?? `plant-${project.meta.id}`}.json`}>download</a
		>
	</div>
	<div id="content">
		<textarea bind:this={textarea}>{JSON.stringify(project, null, 2)}</textarea>
	</div>
</div>

<style>
	#wrapper {
		max-height: 70vh;
		width: 100%;
		display: grid;
		grid-template-rows: min-content 1fr;
	}

	textarea {
		max-height: 100%;
		overflow: scroll;
	}
</style>
