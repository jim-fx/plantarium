<svelte:options accessors />

<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let value = { x: 0, y: 1 };

  if (!value.x) value.x = 0;
  if (value?.y === undefined) value.y = 1;

  const dispatch = createEventDispatcher();

  let wrapper: HTMLDivElement;

  $: value !== undefined && handleChange();
  let oldValue = { x: 0, y: 0 };
  function handleChange() {
    if (value.x === oldValue?.x && value.y === oldValue?.y) return;
    oldValue.x = value.x;
    oldValue.y = value.y;
    dispatch('change', { x: value.x, y: value.y });
  }

  let isMouseDown = false;
  let downX = 0;
  /* let downY = 0; */
  let downV: typeof value;
  let vx = 0;
  /* let vy = 0; */
  let rect: DOMRect;
  let isLeftSide = false;

  function handleMouseDown(ev: MouseEvent) {
    ev.preventDefault();

    isMouseDown = true;

    downV = value;
    downX = ev.clientX;
    /* downY = ev.clientY; */
    rect = wrapper.getBoundingClientRect();

    const nx = (downX - rect.left) / rect.width;

    const midPoint = (downV.x + downV.y) / 2;
    isLeftSide = nx < midPoint;

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = 'ew-resize';
  }

  function handleMouseUp() {
    isMouseDown = false;
    document.body.style.cursor = 'unset';
    window.removeEventListener('mouseup', handleMouseUp);
    window.removeEventListener('mousemove', handleMouseMove);
  }

  function handleMouseMove(ev: MouseEvent) {
    vx = Math.max(Math.min((ev.clientX - rect.left) / rect.width, 1), 0);

    if (isLeftSide) {
      value.x = vx;
      if (vx > value.y) {
        value.y = vx;
      }
    } else {
      value.y = vx;
      if (vx < value.x) {
        value.x = vx;
      }
    }

    value = value;
  }
</script>

<div
  class="component-wrapper"
  class:is-down={isMouseDown}
  on:mousedown={handleMouseDown}
  bind:this={wrapper}
>
  <span
    class="overlay"
    style={`width: ${Math.max(value.y - value.x, 0.05) * 100}%; left:${value.x * 100}%`}
  />
</div>

<style lang="scss">
  @import './global.scss';

  .component-wrapper {
    overflow: hidden;
    min-height: 24px;
    min-width: 50px;
    border-radius: var(--border-radius, 2px);
  }

  .overlay::before,
  .overlay::after {
    position: absolute;
    content: '';
    display: inline-block;
    top: 0px;
    /* background-color: red; */
    width: 5px;
    cursor: ew-resize;
    height: 100%;
  }

  .overlay::after {
    right: 0px;
  }

  .overlay {
    position: absolute;
    top: 0px;
    height: 100%;
    max-width: 100%;
    background-color: var(--text-color);
    opacity: 0.3;
    /* pointer-events: none; */
  }
</style>
