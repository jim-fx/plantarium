<svelte:options tag="plant-curve" accessors />

<script lang="ts">
  import { Vec2 } from 'ogl';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  export let fullWidth = false;

  export let value = [
    { x: 0, y: 1, pinned: true },
    { x: 1, y: 0, pinned: true },
  ];
  $: points = value;

  // const tension = 0.4;

  let isHovered = false;
  // let isRendering = false;
  let activePoint = undefined;
  let draggingPoint = undefined;
  let hoverDistance = 0.02;

  let mousePosX = 0;
  let mousePosY = 0;

  let controlPoints = [];

  const updateValue = () => {
    requestAnimationFrame(() => {
      dispatch('change', points);
      points = points.sort((a, b) => (a.x > b.x ? -1 : 1));
    });
  };

  const handleMouseMove = (ev) => {
    if (isHovered) {
      mousePosX = ev.offsetX;
      mousePosY = ev.offsetY;

      console.log(draggingPoint);

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

  const handleMouseDown = (ev) => {
    if (!activePoint) {
      const point = {
        x: mousePosX / 100,
        y: mousePosY / 100,
        pinned: false,
      };

      activePoint = point;

      points.push(activePoint);
      updateValue();
    }
  };

  const handleMouseUp = () => {
    if (activePoint) {
      points.splice(points.indexOf(activePoint), 1);
      updateValue();
    }

    draggingPoint = undefined;
  };

  const handleMouseOver = () => {
    isHovered = true;
  };

  const handleMouseOut = () => {
    isHovered = false;
  };

  const line = (pointA, pointB) => {
    const lengthX = pointB.x - pointA.x;
    const lengthY = pointB.y - pointA.y;
    return {
      length: Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)),
      angle: Math.atan2(lengthY, lengthX),
    };
  };

  const controlPoint = (current, previous, next, reverse = false) => {
    // When 'current' is the first or last point of the array
    // 'previous' or 'next' don't exist.
    // Replace with 'current'
    const p = previous || current;
    const n = next || current;
    // The smoothing ratio
    const smoothing = 0.2;
    // Properties of the opposed-line
    const o = line(p, n);
    // If is end-control-point, add PI to the angle to go backward
    const angle = o.angle + (reverse ? Math.PI : 0);
    const length = o.length * smoothing;
    // The control point position is relative to the current point
    const x = current.x + Math.cos(angle) * length;
    const y = current.y + Math.sin(angle) * length;
    return [x, y];
  };

  const bezierCommand = (point, i, a) => {
    // start control point
    const [cpsX, cpsY] = controlPoint(a[i - 1], a[i - 2], point);
    // end control point
    const [cpeX, cpeY] = controlPoint(point, a[i - 1], a[i + 1], true);
    controlPoints.push({ x: cpsX, y: cpsY }, { x: cpeX, y: cpeY });
    return `C ${cpsX * 100},${cpsY * 100} ${cpeX * 100},${cpeY * 100} ${
      point.x * 100
    },${point.y * 100}`;
  };

  const linearPath = (p) => `L ${p.x * 100} ${p.y * 100}`;

  const renderPath = (pts, command) => {
    controlPoints = [];

    // console.log(pts);

    // build the d attributes by looping over the points
    const d = pts.reduce(
      (acc, point, i, a) =>
        i === 0
          ? // if first point
            `M ${point.x * 100},${point.y * 100}`
          : // else
            `${acc} ${command(point, i, a)}`,
      '',
    );
    controlPoints = controlPoints;
    return d;
  };

  $: path = renderPath(points, bezierCommand);
</script>

<div class="component-wrapper" class:fullWidth>
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
