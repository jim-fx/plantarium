<script lang="ts">
  import Button from './Button.svelte';

  export let likeAmount = 0;

  export let active = false;
</script>

<div on:click={() => (active = !active)} class:active>
  <Button
    icon="thumb"
    invert={active}
    {active}
    --foreground-color="transparent"
    name={likeAmount || active ? likeAmount + (active ? 1 : 0) + '' : ''}
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

  .active {
    background-color: rgba(255, 255, 255, 0.2);
  }
</style>
