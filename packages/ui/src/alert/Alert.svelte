<script lang="ts">
  import { fade, scale } from 'svelte/transition';
  import { MessageType, store } from './AlertStore';
</script>

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

<svelte:options tag={null} />

{#if $store}
  <div class="alert-container" transition:fade>
    <div
      class="alert-wrapper"
      transition:scale
      class:error={$store.type === MessageType.ERROR}
      class:info={$store.type === MessageType.INFO}
      class:warning={$store.type === MessageType.WARNING}>
      <h3>{$store.title}</h3>

      <p>{$store.content}</p>

      {#if $store.values}
        {#each $store.values as value}
          <button on:click={() => $store.resolve(value)}>{value}</button>
        {/each}
      {:else}<button on:click={$store.resolve} />{/if}
    </div>
  </div>
{/if}
