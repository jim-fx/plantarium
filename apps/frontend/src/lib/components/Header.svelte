<script lang="ts">
	import { settingsManager } from '.';
	import HelpView from '../elements/Help.svelte';
	import QuickSelect from './quick-select/QuickSelect.svelte';
	import SettingsManagerView from './settings-manager/SettingsManagerView.svelte';
	import ProfileView from '../elements/ProfileView.svelte';
	import HoverWindow from '../elements/HoverWindow.svelte';
	import { Button } from '@plantarium/ui';
	import ApiWrapper from '../elements/ApiWrapper.svelte';
	import { activeView } from '$lib/stores';
</script>

<header>
	<div class="left" style="z-index: 2;">
		<span class:hidden={$activeView !== 'plant'}>
			<HoverWindow icon="folder" name="" let:visible --border-radius="0px 10px 10px 10px">
				<QuickSelect {visible} />
			</HoverWindow>
		</span>
		<span class:hidden={$activeView !== 'plant'} style="z-index:-1">
			<Button
				icon="random"
				on:click={() => settingsManager.set('seed.value', Math.floor(Math.random() * 100000))}
			/>
		</span>
	</div>

	<div class="center">
		<Button
			icon="branch"
			invert={$activeView === 'plant'}
			--min-height={'35px'}
			--height={'35px'}
			on:click={() => ($activeView = 'plant')}>Plant</Button
		>

		<Button
			icon="library"
			invert={$activeView === 'library'}
			--min-height={'35px'}
			--height={'35px'}
			on:click={() => ($activeView = 'library')}>Library</Button
		>
	</div>

	<div class="right">
		<HoverWindow icon="user" right>
			<ApiWrapper>
				<div class="grid">
					<ProfileView />
				</div>
			</ApiWrapper>
		</HoverWindow>
		<HoverWindow icon="question" right><HelpView /></HoverWindow>
		<HoverWindow icon="cog" right --min-width={'250px'}><SettingsManagerView /></HoverWindow>
	</div>
</header>

<style lang="scss">
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

	.center {
		display: flex;
		align-items: center;
	}

	.grid {
		display: flex;
		gap: 10px;
		flex-direction: column;
	}

	.right {
		display: flex;
	}

	.hidden {
		opacity: 0;
		pointer-events: none;
	}
</style>
