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
		icon="bug"
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
		icon="bug"
		--bg="#303030"
		--width="100%"
		--text="white"
		on:click={() => createAlert(ReportDashboard, { timeout: 0 })}
	/>

	<Button
		name="Github"
		icon="github"
		--bg="#303030"
		--width="100%"
		--text="white"
		on:click={() => goto('https://github.com/jim-fx/plantarium')}
	/>

	<Section name="Tutorials" dark>
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
			name="Video Tutorial"
			icon="link"
			--bg="#303030"
			--margin="0px 0px 10px 0px"
			--text="white"
			--width="100%"
			on:click={() => goto('https://youtu.be/BO5a_Av9cwo')}
		/>

		<Button
			name="Node Basics"
			icon="node"
			--bg="#303030"
			--margin="0px 0px 10px 0px"
			--text="white"
			--width="100%"
			on:click={() => goto('nodes/tutorial')}
		/>

		<Button
			name="Node Intermediate"
			icon="node"
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
</style>
