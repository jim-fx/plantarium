<svelte:options accessors />

<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let value = 0.5;
  export let step = 0.01;
  export let min = 0;
  export let max = 1;

  function strip(input: number) {
    return +parseFloat(input + '').toPrecision(2);
  }

  const dispatch = createEventDispatcher();

  let inputEl: HTMLInputElement;

  $: if ((value || 0).toString().length > 5) {
    const newValue = strip(value || 0);

    if (newValue !== value) {
      value = newValue;
    }
  }
  $: value !== undefined && handleChange();
  let oldValue: number;
  function handleChange() {
    if (value === oldValue) return;
    oldValue = value;
    dispatch('change', parseFloat(value + ''));
  }

  $: width = Number.isFinite(value)
    ? Math.max((value?.toString().length ?? 1) * 8, 50) + 'px'
    : '20px';

  let isMouseDown = false;
  let downX = 0;
  let downY = 0;
  let downV = 0;
  let vx = 0;
  let vy = 0;
  let rect: DOMRect;

  function handleMouseDown(ev: MouseEvent) {
    ev.preventDefault();

    isMouseDown = true;

    downV = value;
    downX = ev.clientX;
    downY = ev.clientY;
    rect = inputEl.getBoundingClientRect();

    window.removeEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = 'ew-resize';
  }

  function handleMouseUp() {
    isMouseDown = false;

    if (downV === value) {
      inputEl.focus();
    }

    if (value < min) {
      min = value;
    }

    if (value > max) {
      max = value;
    }

    document.body.style.cursor = 'unset';
    window.removeEventListener('mouseup', handleMouseUp);
    window.removeEventListener('mousemove', handleMouseMove);
  }

  function handleMouseMove(ev: MouseEvent) {
    vx = (ev.clientX - rect.left) / rect.width;
    vy = ev.clientY - downY;

    if (ev.ctrlKey) {
      let v = min + (max - min) * vx;
      value = v;
    } else {
      value = Math.max(Math.min(min + (max - min) * vx, max), min);
    }
  }
</script>

<div class="component-wrapper" class:is-down={isMouseDown}>
  <span class="overlay" style={`width: ${((value - min) / (max - min)) * 100}%`} />
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
</div>

<style lang="scss">
  @import './global.scss';

  .component-wrapper {
    overflow: hidden;
    border-radius: var(--border-radius, 2px);
  }

  input[type='number']::-webkit-inner-spin-button,
  input[type='number']::-webkit-outer-spin-button {
    -webkit-appearance: none;
  }

  input[type='number'] {
    box-sizing: border-box;
    -webkit-appearance: textfield;
    -moz-appearance: textfield;
    appearance: textfield;
    cursor: pointer;
    color: var(--text-color);
    background-color: transparent;
    padding: 2px;
    width: 100%;
    font-size: 1em;
    text-align: center;
    border: none;
    border-style: none;
    min-width: 100%;
  }

  .is-down > input {
    cursor: ew-resize !important;
  }

  .overlay {
    position: absolute;
    top: 0px;
    left: 0px;
    height: 100%;
    max-width: 100%;
    background-color: var(--text-color);
    opacity: 0.3;
    pointer-events: none;
  }
</style>
