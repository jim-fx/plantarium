<script lang="ts">
  import Icon from './Icon.svelte';

  export let icon: string;
  export let name: string;
  export let cls: string;
  export let active = false;
</script>

<style lang="scss">
  button {
    position: relative;
    height: 40px;
    border-radius: 5px;
    border: none;
    background-color: transparent;
    outline: none;
    transition: none;
    cursor: pointer;
  }

  button.has-icon > :global(.icon-wrapper) {
    position: absolute;
    top: 9px;
    height: calc(100% - 18px);
  }

  button.has-icon > p {
    padding-left: 30px;
  }

  p {
    color: white;
    font-weight: bolder;
    padding: 0px 5px;
  }

  .content {
    position: absolute;
    bottom: 0px;
    left: 0px;
    overflow: visible;
  }
</style>

<button
  on:click={() => (active = !active)}
  class={cls}
  class:active
  class:has-icon={!!icon}>
  {#if icon}
    <Icon name={icon} {active} />
  {/if}
  <p>{name}</p>

  <div class="content">
    <slot />
  </div>
</button>
