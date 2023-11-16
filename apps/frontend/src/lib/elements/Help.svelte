<script>
	import { Button, createAlert, Icon, Section } from '@plantarium/ui';
	import { Changelog } from '.';
	import { goto } from '$app/navigation';
	import Report from './Report.svelte';
	import ReportDashboard from './ReportDashboard.svelte';
	import Tutor from '../components/tutor';
	import { apiState } from '../stores';
</script>

<div>
	{#if $apiState !== 'online'}
		<span style="display: flex; align-items: center; gap: 5px">
			<Icon name="offline" --width="1.2em" />
			api is offline
		</span>
	{/if}
	<Button
		icon={$apiState === 'online' ? 'bug' : 'offline'}
		disabled={$apiState !== 'online'}
		--bg="#303030"
		--text="white"
		--width="100%"
		on:click={() =>
			createAlert(Report, {
				timeout: 0,
				title: 'Report Bug',
				type: 'error',
				props: { mode: 'bug' }
			})}>Report Bug</Button
	>

	<Button
		icon={$apiState === 'online' ? 'bulb' : 'offline'}
		disabled={$apiState !== 'online'}
		--bg="#303030"
		--width="100%"
		--text="white"
		on:click={() =>
			createAlert(Report, { timeout: 0, title: 'Submit Idea', props: { mode: 'feat' } })}
		>Submit Idea</Button
	>
	<Button
		--bg="#303030"
		--width="100%"
		--text="white"
		on:click={() => createAlert(Changelog, { timeout: 0 })}>Changelog</Button
	>
	{#if $apiState === 'online'}
		<Button
			icon="bug"
			--bg="#303030"
			--width="100%"
			--text="white"
			on:click={() => createAlert(ReportDashboard, { timeout: 0 })}>Bug Reports</Button
		>
	{/if}

	<Button
		icon="github"
		--bg="#303030"
		--width="100%"
		--text="white"
		on:click={() => goto('https://github.com/jim-fx/plantarium')}>Github</Button
	>

	<Section name="Tutorials" dark>
		<Button
			icon="hand"
			--margin="0px 0px 10px 0px"
			--bg="#303030"
			--text="white"
			--width="100%"
			on:click={() => Tutor.start()}>Interface</Button
		>

		<Button
			icon="link"
			--bg="#303030"
			--margin="0px 0px 10px 0px"
			--text="white"
			--width="100%"
			on:click={() => goto('https://youtu.be/BO5a_Av9cwo')}>Video Tutorial</Button
		>

		<Button
			icon="node"
			--bg="#303030"
			--margin="0px 0px 10px 0px"
			--text="white"
			--width="100%"
			on:click={() => goto('nodes/tutorial')}>Node Basics</Button
		>

		<Button
			icon="node"
			--bg="#303030"
			--text="white"
			--width="100%"
			on:click={() => Tutor.start('level-plantnodes-0')}>Node Intermediate</Button
		>
	</Section>
</div>

<style lang="scss">
	div {
		display: grid;
		gap: 10px;
	}
</style>
