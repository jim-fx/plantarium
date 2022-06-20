<script lang="ts">
  import { store } from './ToastStore';
  import { slide } from 'svelte/transition';
  import { backInOut } from 'svelte/easing';
  import Toast from './Toast.svelte';
  import { onMount } from 'svelte';

  let isCustomElement = false;
  let el: HTMLElement;

  onMount(function () {
    isCustomElement = !el.parentElement;
  });
</script>

<div id="toast-wrapper" bind:this={el}>
  {#each $store as toast (toast.id)}
    <div transition:slide={{ easing: backInOut }}>
      {#if isCustomElement}
        <plant-toast {toast} />
      {:else}
        <Toast {toast} />
      {/if}
    </div>
  {/each}
</div>

<style lang="scss">
  #toast-wrapper {
    position: fixed;
    bottom: 0;
    z-index: 999;
  }
</style>
