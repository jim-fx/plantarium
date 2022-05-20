<script>
	import { Button, createAlert, Section } from '@plantarium/ui';
	import { Changelog } from '.';
	import { goto } from '$app/navigation';
	import Report from './Report.svelte';
	import ReportDashboard from './ReportDashboard.svelte';
	import Tutor from '../components/tutor';
</script>

<div>
	<Button
		name="Report Bug"
		icon="exclamation"
		--bg="#303030"
		--text="white"
		--width="100%"
		on:click={() =>
			createAlert(Report, {
				timeout: 0,
				title: 'Report Bug',
				type: 'error',
				props: { mode: 'bug' }
			})}
	/>

	<Button
		name="Submit Idea"
		icon="bulb"
		--bg="#303030"
		--width="100%"
		--text="white"
		on:click={() =>
			createAlert(Report, {
				timeout: 0,
				title: 'Submit Idea',
				props: { mode: 'feat' }
			})}
	/>
	<Button
		name="Changelog"
		--bg="#303030"
		--width="100%"
		--text="white"
		on:click={() => createAlert(Changelog, { timeout: 0 })}
	/>
	<Button
		name="Bug Reports"
		--bg="#303030"
		--width="100%"
		--text="white"
		on:click={() => createAlert(ReportDashboard, { timeout: 0 })}
	/>

	<Section name="Tutorials">
		<Button
			name="Interface"
			icon="hand"
			--margin="0px 0px 10px 0px"
			--bg="#303030"
			--text="white"
			--width="100%"
			on:click={() => Tutor.start()}
		/>

		<Button
			name="Node Basics"
			icon="hand"
			--bg="#303030"
			--margin="0px 0px 10px 0px"
			--text="white"
			--width="100%"
			on:click={() => goto('nodes/tutorial')}
		/>

		<Button
			name="Node Intermediate"
			icon="hand"
			--bg="#303030"
			--text="white"
			--width="100%"
			on:click={() => Tutor.start('level-plantnodes-0')}
		/>
	</Section>
</div>

<style lang="scss">
	div {
		display: grid;

		gap: 10px;
	}

	div :global(button) {
		/* margin-bottom: 10px !important; */
	}

	div :global(div:last-child button) {
		/* margin-bottom: 0px !important; */
	}
</style>
