<script lang="ts">
  import { get } from '@plantarium/client-api';
  import { Button } from '@plantarium/ui';
  import { createEventDispatcher } from 'svelte';
  import ApiError from './ApiError.svelte';

  const dispatch = createEventDispatcher();

  export let promise: ReturnType<typeof get> = undefined;
  export let path: string = undefined;

  const _prom = promise || get(path);

  _prom
    .then(() => {
      dispatch('success');
    })
    .catch(() => {
      dispatch('error');
    });
</script>

{#await _prom}
  <p>Loading</p>
{:then response}
  {#if response.ok}
    <slot data={response.data} />
  {:else}
    <slot name="error" error={response}>
      <ApiError error={response} />
      <Button icon="arrow" on:click={() => { promise = undefined; }} >okay</Button>
    </slot>
  {/if}
{/await}
