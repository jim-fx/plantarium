<script lang="ts">
	import { projectManager } from './components';
	import HelpView from './elements/Help.svelte';
	import ProjectManagerView from './components/project-manager/ProjectManagerView.svelte';
	import SettingsManagerView from './components/settings-manager/SettingsManagerView.svelte';
	import HoverWindow from './elements/HoverWindow.svelte';
	const activeProject = projectManager.activeProject;
</script>

<header>
	<div class="left">
		<HoverWindow icon="folder" name="Projects" component={ProjectManagerView} />
	</div>

	<h3>{$activeProject?.meta.name ?? ''}</h3>

	<div class="right">
		<HoverWindow icon="question" component={HelpView} right />
		<HoverWindow icon="cog" component={SettingsManagerView} right --min-width={'250px'} />
	</div>
</header>

<style lang="scss">
	@use '~@plantarium/theme/src/themes.module.scss';

	h3 {
		color: var(--accent);
	}

	header {
		display: flex;
		z-index: 2;
		align-items: center;
		justify-content: space-between;
		background-color: var(--foreground-color);
	}

	.right {
		display: flex;
	}
</style>
