<script lang="ts">
  import { store } from './ToastStore';
  import { slide } from 'svelte/transition';
  import { backInOut } from 'svelte/easing';
  import Message from '../Message.svelte';
  import Icon from '../Icon.svelte';
</script>

<div id="toast-wrapper">
  {#each $store as toast (toast.id)}
    <div transition:slide={{ easing: backInOut }} style="position: relative; width:fit-content;">
      <div
        role="button"
        tabindex="0"
        class="toast-close"
        on:keydown={() => toast?.reject?.()}
        on:click={() => toast?.reject?.()}
      >
        <Icon
          dark={['warning', 'error', 'success'].includes(toast?.type)}
          name="cross"
          --width="fit-content"
        />
      </div>

      <Message
        type={toast.type}
        timeout={toast.timeout}
        message={toast.content}
        values={toast.values}
        reject={toast.reject}
        resolve={toast.resolve}
        title={toast.title}
      />
    </div>
  {/each}
</div>

<style lang="scss">
  .toast-close {
    position: absolute;
    right: 15px;
    top: 15px;
    z-index: 99;
    width: 20px;
    cursor: pointer;
  }

  #toast-wrapper {
    position: fixed;
    bottom: 0;
    z-index: 999;
  }
</style>
