<script lang="ts">
	import { settingsManager } from '..';
	import SettingsSection from './SettingsSection.svelte';
	import SettingsTemplate from './SettingsTemplate';

	const store = settingsManager?.store;
</script>

{#each Object.entries($store) as [key, value]}
	<SettingsSection {key} {value} template={SettingsTemplate[key]} />
{/each}
