<script lang="ts">
	import { projectManager, settingsManager } from './components';
	import HelpView from './elements/Help.svelte';
	import ProjectManagerView from './components/project-manager/ProjectManagerView.svelte';
	import SettingsManagerView from './components/settings-manager/SettingsManagerView.svelte';
	import ProfileView from './elements/ProfileView.svelte';
	import HoverWindow from './elements/HoverWindow.svelte';
	import { Button } from '@plantarium/ui';
	const activeProject = projectManager.activeProject;
</script>

<header>
	<div class="left">
		<HoverWindow icon="folder" name="Projects" component={ProjectManagerView} />
		<Button
			icon="random"
			on:click={() => settingsManager.set('seed.value', Math.floor(Math.random() * 100000))}
		/>
	</div>

	<h3>{$activeProject?.meta.name ?? ''}</h3>

	<div class="right">
		<HoverWindow icon="user" component={ProfileView} right />
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

	.left {
		display: flex;
	}

	.left > ::global(div:first-child) {
		z-index: 2;
	}

	.right {
		display: flex;
	}
</style>
