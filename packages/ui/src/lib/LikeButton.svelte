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
    if (active) {
      likeAmount++;
    } else {
      likeAmount--;
    }
    dispatch('click', active);
  }
</script>

<div class:active class:disabled>
  <Button
    icon="thumb"
    {disabled}
    invert={active}
    on:click={handleClick}
    --foreground-color="transparent"
    name={likeAmount + ''}
  />
</div>

<style>
  div {
    width: min-content;
    border-radius: 7px;
    cursor: pointer;
    border: solid thin var(--text-color);
  }

  .disabled {
    opacity: 0.8;
    pointer-events: none;
  }

  .active {
    background-color: rgba(255, 255, 255, 0.2);
  }
</style>
