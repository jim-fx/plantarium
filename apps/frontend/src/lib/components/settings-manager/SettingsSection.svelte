<script lang="ts">
	import { cloneObject } from '@plantarium/helpers';

	import { Section, stateToComponent, type ValueTemplate } from '@plantarium/ui';
	import { slide } from 'svelte/transition';
	import { settingsManager } from '..';
	import sectionOpen from './sectionOpen';

	import type { MainSettings } from './SettingsTemplate';

	const settingsStore = settingsManager.store;
	export let value: unknown;
	export let key: string;
	export let path = '';
	path = path + (path.length ? '.' : '') + key;
	export let template: MainSettings;
	// We need to cheat here because sveltes {if else}
	// does not work with typescript types
	let _template: ValueTemplate = template as unknown as ValueTemplate;

	const isOpen = sectionOpen();

	function cleanTemplate<T extends object>(_template: T) {
		const c = cloneObject(_template);
		'label' in c && delete c['label'];
		'type' in c && delete c['type'];
		'onlyDev' in c && delete c['onlyDev'];
		return c;
	}
</script>

{#if $settingsStore.isDev || !template.onlyDev}
	<div class="wrapper" transition:slide>
		{#if template.options}
			<Section name={key} open={isOpen.get()} dark on:toggle={({ detail }) => isOpen.set(detail)}>
				{#each Object.entries(value) as [_key, _value]}
					{#if _key in template.options}
						<svelte:self {path} value={_value} key={_key} template={template.options[_key]} />
					{:else}
						<p>error</p>
					{/if}
				{/each}
			</Section>
		{:else}
			<p>{template.label || key}</p>

			<svelte:component
				this={stateToComponent(_template)}
				{...cleanTemplate(_template)}
				{value}
				on:change={(ev) => settingsManager.set(path, ev.detail)}
			/>
		{/if}
	</div>
{/if}

<style>
	.wrapper {
		margin-left: 10px;
		width: calc(100% - 10px);
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;

		padding-bottom: 10px;
		padding-top: 10px;

		border-bottom: solid thin #30303055;
		color: #303030;
	}
</style>
