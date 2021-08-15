<svelte:options tag="plant-toast" />

<script lang="ts">
  import { onMount } from 'svelte';
  import { cubicOut, cubicInOut, linear } from 'svelte/easing';
  import Icon from '../Icon.svelte';
  export let toast;

  console.log(toast);

  let animateProgress = false;

  onMount(() => {
    animateProgress = true;
  });
</script>

{#if toast}
  <div class="toast toast-{toast.type}">
    <span>
      {#if toast.type === 'success'}
        <Icon name="checkmark" dark />
      {:else if toast.type === 'error'}
        <Icon name="cross" />
      {/if}
    </span>
    <p>{toast.content}</p>
    <div
      class:animateProgress
      style={`transition: width ${toast.timeout}ms linear;`}
      class="toast-progress"
    />
  </div>
{/if}

<style lang="scss">
  .toast {
    position: relative;

    width: fit-content;
    padding: 10px;
    padding-right: 30px;
    margin: 10px;
    border-radius: 5px;

    overflow: hidden;

    box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.7);

    max-height: 70px;
    box-sizing: border-box;
    transition: max-height 0.3s ease, opacity 0.3s ease, margin-top 0.3s ease,
      margin-bottom 0.3s ease;

    &.toast-out {
      max-height: 0;
      opacity: 0;
      margin-top: 0;
      margin-bottom: 0;
    }

    span {
      height: 2.4em;
      width: 2.4em;
      border-radius: 50%;
      border: solid 2px;
      display: inline-block;
      vertical-align: middle;

      svg {
        height: 100%;
      }
    }

    p {
      width: fit-content;
      vertical-align: middle;
      display: inline-block;
      padding: 10px;
      padding-left: 20px;
    }

    .toast-progress {
      position: absolute;
      height: 2px;
      width: 100%;
      left: 0;
      bottom: 0;
      opacity: 1 !important;
    }

    .animateProgress {
      width: 0%;
    }
  }

  .toast-info {
    span {
      display: none;
    }

    background-color: #303030;

    color: white;
    .toast-progress {
      background-color: white;
    }
  }

  .toast-success {
    background-color: #65e2a0;
    color: black;
    border-color: gray;
    span {
      svg {
        stroke: gray;
      }
    }
    .toast-progress {
      background-color: gray;
    }
  }

  .toast-sync {
    box-shadow: none !important;
    padding: 0;
    span {
      display: none;
    }
    background-color: transparent;
    color: gray;
    .toast-progress {
      height: 1px;
      background-color: gray;
    }
    p {
      padding: 5px 0px;
    }
  }

  .toast-error {
    background-color: red;
    color: white;
    span {
      border-color: white;
    }
    .toast-progress {
      background-color: white;
    }
  }
</style>
