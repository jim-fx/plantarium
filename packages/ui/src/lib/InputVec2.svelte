<svelte:options accessors />

<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import InputFloat from './InputFloat.svelte';
  import InputInteger from './InputInteger.svelte';
  const dispatch = createEventDispatcher();

  export let value = { x: 0, y: 0 };

  export let inputType = 'integer';

  $: value !== undefined && dispatch('change', value);
</script>

<div class="component-wrapper">
  {#if inputType === 'integer'}
    <InputInteger bind:value={value.x} --border-radius="5px 5px 0px 0px" />
    <InputInteger bind:value={value.y} --border-radius="0px 0px 5px 5px" />
  {:else}
    <InputFloat bind:value={value.x} --border-radius="5px 5px 0px 0px" />
    <InputFloat bind:value={value.y} --border-radius="0px 0px 5px 5px" />
  {/if}
</div>

<style lang="scss">
  @import './global.scss';

  .component-wrapper {
    overflow: hidden;
    display: unset;
  }
</style>
