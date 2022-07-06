<script lang="ts">
	import { projectManager, settingsManager } from './components';
	import HelpView from './elements/Help.svelte';
	import ProjectManagerView from './components/project-manager/ProjectManagerView.svelte';
	import SettingsManagerView from './components/settings-manager/SettingsManagerView.svelte';
	import ProfileView from './elements/ProfileView.svelte';
	import HoverWindow from './elements/HoverWindow.svelte';
	import Library from './components/library/LibraryView.svelte';
	import { Button, createAlert } from '@plantarium/ui';
	import ApiWrapper from './elements/ApiWrapper.svelte';
	const activeProject = projectManager.activeProject;
</script>

<header>
	<div class="left" style="z-index: 2;">
		<HoverWindow icon="folder" name="" let:visible>
			<ProjectManagerView {visible} />
		</HoverWindow>
		<span style="z-index: -1;">
			<Button
				icon="library"
				name="Library"
				on:click={() => createAlert(Library, { timeout: 0, styleVars: { padding: '0px' } })}
			/>
		</span>
		<span style="z-index: -1;">
			<Button
				icon="random"
				on:click={() => settingsManager.set('seed.value', Math.floor(Math.random() * 100000))}
			/>
		</span>
	</div>

	<h3>{$activeProject?.meta.name ?? ''}</h3>

	<div class="right">
		<HoverWindow icon="user" right>
			<ApiWrapper>
				<ProfileView />
			</ApiWrapper>
		</HoverWindow>
		<HoverWindow icon="question" right><HelpView /></HoverWindow>
		<HoverWindow icon="cog" right --min-width={'250px'}><SettingsManagerView /></HoverWindow>
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
