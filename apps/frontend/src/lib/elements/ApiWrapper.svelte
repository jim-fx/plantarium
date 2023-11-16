<script lang="ts" context="module">
	import { apiState } from '../stores';

	let tryAgainTimeout: NodeJS.Timeout | undefined;
	function tryAgain() {
		if (tryAgainTimeout) return;
		tryAgainTimeout = setTimeout(() => {
			tryAgainTimeout = undefined;
			checkOnline();
		}, 10001);
	}

	let lastCheck = 0;
	async function checkOnline() {
		const time = Date.now();

		if (time - lastCheck > 10000) {
			const t = setTimeout(() => {
				apiState.set('loading');
			}, 500);

			try {
				const res = await clientApi.getHealth();

				clearTimeout(t);

				if (res.ok) {
					apiState.set('online');
				} else {
					apiState.set('offline');
					tryAgain();
				}
			} catch (err) {
				clearTimeout(t);
				apiState.set('offline');
				tryAgain();
			}
		}
	}
</script>

<script lang="ts">
	import clientApi from '@plantarium/client-api';
	import { Icon, Message } from '@plantarium/ui';

	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	export let offline = $apiState === 'offline';
	$: offline = $apiState === 'offline';

	onMount(async () => {
		checkOnline();
	});
</script>

{#if $apiState === 'online'}
	<slot />
{:else if $apiState === 'loading'}
	<Icon name="branch" animated />
	<p>Contacting Api...</p>
{:else}
	<Message type="warning" icon="offline" message="Server offline" />
{/if}
