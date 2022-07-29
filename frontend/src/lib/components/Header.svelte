<script lang="ts">
	import { projectManager, settingsManager } from '.';
	import HelpView from '../elements/Help.svelte';
	import ProjectManagerView from './project-manager/ProjectManagerView.svelte';
	import SettingsManagerView from './settings-manager/SettingsManagerView.svelte';
	import ProfileView from '../elements/ProfileView.svelte';
	import HoverWindow from '../elements/HoverWindow.svelte';
	import Library from './library/LibraryView.svelte';
	import { Button, createAlert } from '@plantarium/ui';
	import ApiWrapper from '../elements/ApiWrapper.svelte';
	import { activeView } from '$lib/stores';
	const activeProject = projectManager.activeProject;
</script>

<header>
	<div class="left" style="z-index: 2;">
		<span style="z-index: -1;">
			<Button
				icon="branch"
				name="Plant"
				invert={$activeView === 'plant'}
				on:click={() => ($activeView = 'plant')}
			/>
		</span>

		<span style="z-index: -1;">
			<Button
				icon="library"
				name="Library"
				invert={$activeView === 'library'}
				on:click={() => ($activeView = 'library')}
			/>
		</span>
	</div>

	<div class="right">
		{#if $activeView === 'plant'}
			<HoverWindow icon="folder" name="" let:visible right>
				<ProjectManagerView {visible} />
			</HoverWindow>
		{/if}
		<HoverWindow icon="user" right>
			<ApiWrapper>
				<ProfileView />
			</ApiWrapper>
		</HoverWindow>
		<HoverWindow icon="question" right><HelpView /></HoverWindow>
		{#if $activeView === 'plant'}
			<HoverWindow icon="cog" right --min-width={'250px'}><SettingsManagerView /></HoverWindow>
		{/if}
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
