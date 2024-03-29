<svelte:options accessors />

<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  import type { Vec2 } from '@plantarium/types';
  const dispatch = createEventDispatcher();

  export let value = [
    { x: 1, y: 0, pinned: true },
    { x: 0.5, y: 0.5 },
    { x: 1, y: 1, pinned: true }
  ];

  $: points = value;

  // const tension = 0.4;

  let isHovered = false;
  // let isRendering = false;
  let activePoint: Vec2 | undefined = undefined;
  let draggingPoint: Vec2 | undefined = undefined;

  let mousePosX = 0;
  let mousePosY = 0;

  const updateValue = () => {
    requestAnimationFrame(() => {
      dispatch('change', points);
      points = points
        .sort((a, b) => (a.y < b.y ? -1 : 1))
        .map((p, i) => {
          p.pinned = i === 0 || i === points.length - 1;
          return p;
        });
    });
  };

  const removePoint = (p: Vec2) => {
    if (p.pinned) return;
    if (!activePoint) return;
    points.splice(points.indexOf(activePoint), 1);
    updateValue();
  };

  const handleMouseMove = (ev: MouseEvent) => {
    if (isHovered) {
      mousePosX = ev.offsetX;
      mousePosY = ev.offsetY;

      if (activePoint) {
        draggingPoint = activePoint;
        activePoint = undefined;
      }

      if (draggingPoint) {
        draggingPoint.x = mousePosX / 50;
        draggingPoint.y = mousePosY / 100;
        updateValue();
      }
    }
  };

  const handleMouseDown = () => {
    if (!activePoint) {
      const point = {
        x: mousePosX / 50,
        y: mousePosY / 100,
        pinned: false
      };

      activePoint = point;

      points.push(activePoint);
      updateValue();
    }
  };

  const handleMouseUp = () => {
    if (activePoint) {
      removePoint(activePoint);
      activePoint = undefined;
    }

    draggingPoint = undefined;
  };

  const handleMouseOver = () => {
    isHovered = true;
  };

  const handleMouseOut = () => {
    isHovered = false;
  };

  const lineCommand = (point: Vec2) => `L ${point.x * 100} ${point.y * 200 - 50}`;

  function renderPath(points: Vec2[]) {
    // build the d attributes by looping over the points

    let _points = [...points];

    if (points[0].x < 0.95) {
      _points = [{ x: 1, y: 1 }, ..._points];
    }

    if (points[points.length - 1].x < 0.95) {
      _points = [..._points, { x: 1, y: 0 }];
    }

    return _points.reduce(
      (acc, point, i) =>
        i === 0
          ? // if first point
            `M ${point.x * 100},${point.y * 200 - 50}`
          : // else
            `${acc} ${lineCommand(point)}`,
      ''
    );
  }

  $: path = renderPath(points);
</script>

<div class="component-wrapper">
  <svg
    viewBox="0 0 100 100"
    width="50"
    height="100"
    aria-label="input shape"
    role="button"
    tabindex="0"
    on:mousedown={handleMouseDown}
    on:mousemove={handleMouseMove}
    on:mouseover={handleMouseOver}
    on:mouseout={handleMouseOut}
    on:mouseup={handleMouseUp}
    on:focus={handleMouseOver}
    on:blur={handleMouseOut}
  >
    <path d={path} fill="none" class="left-path" />

    {#each points as p}
      <circle
        role="button"
        tabindex="0"
        cx={p.x * 100}
        cy={p.y * 200 - 50}
        r="4"
        class:pinned={p.pinned}
        on:mousedown={() => {
          activePoint = p;
        }}
      />
    {/each}
  </svg>
  <svg id="right" viewBox="0 0 100 100" width="50" height="100">
    <defs>
      <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color:#65E2A0;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#469C6E;stop-opacity:1" />
      </linearGradient>
    </defs>
    <path d={path} fill="url(#grad1)" stroke="grey" />
  </svg>
</div>

<style lang="scss">
  @import './global.scss';

  svg {
    width: 50%;
  }

  .left-path {
    /* stroke: var(--text-color); */
    stroke: none;
    fill: rgba(101, 226, 160, 0.5);
  }

  svg > circle {
    fill: var(--text-color);
    stroke: none;
  }

  svg > circle:hover {
    fill: var(--accent, var(--green-light));
    cursor: pointer;
  }

  #right {
    transform: scaleX(-1);
    & > path {
      stroke: none;
    }
  }

  .component-wrapper {
    display: flex;
    width: 100px;
    max-width: 100%;
  }
</style>
