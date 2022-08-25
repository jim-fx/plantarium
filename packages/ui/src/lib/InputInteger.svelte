<svelte:options accessors />

<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  // Styling
  export let min = -Infinity;
  export let max = Infinity;
  export let step = 1;
  export let value = 0;

  if (!value) {
    value = 0;
  }

  let inputEl: HTMLInputElement;
  $: value !== undefined && update();

  let prev = -1;
  function update() {
    if (prev === value) return;
    prev = value;
    dispatch('change', parseFloat(value + ''));
  }

  $: width = Number.isFinite(value)
    ? Math.max((value?.toString().length ?? 1) * 8, 30) + 'px'
    : '20px';

  function handleChange(change: number) {
    value = Math.max(min, Math.min(+value + change, max));
  }

  let downX = 0;
  let downV = 0;
  let rect: DOMRect;

  function handleMouseDown(ev: MouseEvent) {
    ev.preventDefault();

    downV = value;
    downX = ev.clientX;
    rect = inputEl.getBoundingClientRect();

    window.removeEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = 'ew-resize';
  }

  function handleMouseUp() {
    if (downV === value) {
      inputEl.focus();
    } else {
      inputEl.blur();
    }

    document.body.style.cursor = 'unset';
    window.removeEventListener('mouseup', handleMouseUp);
    window.removeEventListener('mousemove', handleMouseMove);
  }

  function handleMouseMove(ev: MouseEvent) {
    if (!ev.ctrlKey) {
      const vx = (ev.clientX - rect.left) / rect.width;
      value = Math.max(Math.min(Math.floor(min + (max - min) * vx), max), min);
    } else {
      const vx = ev.clientX - downX;
      value = downV + Math.floor(vx / 10);
    }
  }
</script>

<div class="component-wrapper">
  {#if typeof min !== 'undefined' && typeof max !== 'undefined'}
    <span class="overlay" style={`width: ${Math.min((value - min) / (max - min), 1) * 100}%`} />
  {/if}
  <button on:click={() => handleChange(-step)}>-</button>
  <input
    bind:value
    bind:this={inputEl}
    {step}
    {max}
    {min}
    on:mousedown={handleMouseDown}
    on:mouseup={handleMouseUp}
    type="number"
    style={`width:${width};`}
  />

  <button on:click={() => handleChange(+step)}>+</button>
</div>

<style lang="scss">
  @import './global.scss';

  .component-wrapper {
    overflow: hidden;
    border-radius: var(--border-radius, 2px);
  }

  input[type='number'] {
    -webkit-appearance: textfield;
    -moz-appearance: textfield;
    appearance: textfield;
    cursor: pointer;
  }

  input[type='number']::-webkit-inner-spin-button,
  input[type='number']::-webkit-outer-spin-button {
    -webkit-appearance: none;
  }

  .overlay {
    position: absolute;
    top: 0px;
    left: 0px;
    height: 100%;
    background-color: var(--text-color);
    opacity: 0.3;
    pointer-events: none;
  }

  div {
    position: relative;
    width: 100%;
    display: flex;
    justify-content: space-between;
    border-radius: 2px;
  }

  div button {
    background-color: transparent;
    border: none;
    cursor: pointer;
    line-height: 0px;
    margin: 0;
    color: var(--text-color);
  }

  div input[type='number'] {
    color: var(--text-color);
    background-color: transparent;
    padding: 2px;
    width: 72%;
    font-size: 1em;
    text-align: center;
    border: none;
    border-style: none;
  }
</style>
