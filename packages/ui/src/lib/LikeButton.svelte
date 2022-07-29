<script lang="ts">
  import Button from './Button.svelte';
  import { tick, createEventDispatcher } from 'svelte';

  export let likeAmount = 0;

  export let active = false;

  export let disabled = false;

  const dispatch = createEventDispatcher();
  async function handleClick() {
    await tick();
    active = !active;
    dispatch('click', active);
  }
</script>

<div class:active class:disabled>
  <Button
    icon="thumb"
    invert={active}
    {disabled}
    {active}
    on:click={handleClick}
    --foreground-color="transparent"
    name={likeAmount + (active ? 1 : 0) + ''}
  />
</div>

<style>
  div {
    padding: 2px;
    width: min-content;
    border-radius: 10px;
    cursor: pointer;
    border: solid 1.5px var(--text-color);
  }

  .disabled {
    opacity: 0.8;
    pointer-events: none;
  }

  .active {
    background-color: rgba(255, 255, 255, 0.2);
  }
</style>
