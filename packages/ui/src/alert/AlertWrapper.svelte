<svelte:options tag="plant-alert-wrapper" />

<script lang="ts">
  import { fade, scale } from 'svelte/transition';
  import { MessageType, store } from './AlertStore';

  $: alert = $store[0];
</script>

{#if alert}
  <div class="alert-container" transition:fade>
    <div
      class="alert-wrapper"
      transition:scale
      class:error={alert.type === MessageType.ERROR}
      class:info={alert.type === MessageType.INFO}
      class:warning={alert.type === MessageType.WARNING}
    >
      <h3>{alert.title}</h3>

      <p>{alert.content}</p>

      {#if alert.values}
        {#each alert.values as value}
          <button on:click={() => alert.resolve(value)}>{value}</button>
        {/each}
      {:else}<button on:click={alert.resolve} />{/if}
    </div>
  </div>
{/if}

<style lang="scss">
  .alert-container {
    position: fixed;
    z-index: 99999;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.493);
    display: grid;
    place-items: center;
    backdrop-filter: blur(5px) contrast(0.5);
  }

  .alert-wrapper {
    width: 200px;
    height: 100px;
    backdrop-filter: blur(10px) contrast(0.5) brightness(1.5);
  }

  .alert-wrapper.error {
    background: #e26565;
  }
</style>
