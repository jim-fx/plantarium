<script lang="ts">
  import spline from '@yr/monotone-cubic-spline';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  export let value = [
    { x: 0, y: 1, pinned: true },
    { x: 1, y: 0, pinned: true }
  ];
  $: points = value;

  // const tension = 0.4;

  let isHovered = false;
  // let isRendering = false;
  let activePoint = undefined;
  let draggingPoint = undefined;

  let mousePosX = 0;
  let mousePosY = 0;

  let controlPoints = [];

  const updateValue = () => {
    requestAnimationFrame(() => {
      dispatch('change', points);
      points = points.sort((a, b) => (a.x > b.x ? -1 : 1));
    });
  };

  const removePoint = (p) => {
    if (p.pinned) return;
    points.splice(points.indexOf(activePoint), 1);
    updateValue();
  };

  const handleMouseMove = (ev) => {
    if (isHovered) {
      mousePosX = ev.offsetX;
      mousePosY = ev.offsetY;

      if (activePoint) {
        draggingPoint = activePoint;
        activePoint = undefined;
      }

      if (draggingPoint) {
        draggingPoint.x = mousePosX / 100;
        draggingPoint.y = mousePosY / 100;
        updateValue();
      }
    }
  };

  const handleMouseDown = () => {
    if (!activePoint) {
      const point = {
        x: mousePosX / 100,
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

  function renderPath(points) {
    const pts = spline.points(points.map((p) => [p.x * 100, p.y * 100]));
    return spline.svgPath(pts);
  }

  $: path = renderPath(points);
</script>

<div class="component-wrapper">
  <svg
    viewBox="0 0 100 100"
    width="100"
    height="100"
    on:mousedown={handleMouseDown}
    on:mousemove={handleMouseMove}
    on:mouseover={handleMouseOver}
    on:mouseout={handleMouseOut}
    on:mouseup={handleMouseUp}
    on:focus={handleMouseOver}
    on:blur={handleMouseOut}
  >
    <!-- <circle cx={mousePosX} cy={mousePosY} r="1" /> -->

    <path d={path} fill="none" stroke="grey" />
    {#each points as p}
      <circle
        cx={p.x * 100}
        cy={p.y * 100}
        r="2"
        class:pinned={p.pinned}
        on:mousedown={() => {
          activePoint = p;
        }}
      />
    {/each}

    <g id="debug">
      {#each controlPoints as p, i}
        {#if i > 0 && i % 2 === 0}
          <line
            x1={controlPoints[i - 1].x * 100}
            y1={controlPoints[i - 1].y * 100}
            x2={p.x * 100}
            y2={p.y * 100}
          />
        {/if}
        <circle cx={p.x * 100} cy={p.y * 100} r="1" class:pinned={p.pinned} />
      {/each}
    </g>
  </svg>
</div>

<style lang="scss">
  @import './global.scss';

  .component-wrapper {
    width: 100px;
    max-width: 100%;
  }

  svg > path {
    stroke: white;
    stroke-width: 1px;
  }

  svg circle {
    opacity: 0;
    stroke-width: 1px;
  }

  circle:hover {
    fill: white;
    opacity: 1 !important;
  }

  svg:hover circle {
    opacity: 0.5;
  }

  svg:hover circle.pinned {
    opacity: 0.5;
  }

  svg:hover line {
    opacity: 1;
    stroke-width: 0.5px;
  }

  svg line {
    opacity: 0;
  }

  #debug {
    pointer-events: none;
    display: block;
  }

  #debug > * {
    stroke-width: 0.5px;
  }

  svg:hover > #debug > * {
    opacity: 1px;
  }

  svg {
    width: 100%;
    stroke-width: 1px;
    display: block;
  }
</style>
