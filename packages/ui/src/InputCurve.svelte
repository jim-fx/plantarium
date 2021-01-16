<script lang="typescript">
  import { onMount, createEventDispatcher } from 'svelte';
  import { Vec2 } from 'ogl';
  import { curve, throttle } from '@plantarium/helpers';

  const dispatch = createEventDispatcher();

  export let points = [
    { x: 0, y: 1, pinned: true },
    { x: 1, y: 0, pinned: true },
  ];

  let canvas: HTMLCanvasElement;
  let el: HTMLDivElement;
  let ctx;

  const hoverDistance = 0.1;
  const tension = 0.4;

  let isHovered = false;
  let isRendering = false;
  let activePoint = undefined;

  const mousePos = new Vec2(0, 0);
  const mouseDownPos = new Vec2(0, 0);
  const pointDownPos = new Vec2(0, 0);

  let width = 200;
  let height = 200;

  let cWidth = width;
  let cHeight = height;

  const updateValue = throttle(() => {
    const event = new CustomEvent('change', {
      detail: JSON.parse(JSON.stringify(points)),
      bubbles: true,
      cancelable: true,
      composed: true, // makes the event jump shadow DOM boundary
    });

    el.dispatchEvent(event);
  }, 50);

  const handleMouseMove = (ev) => {
    if (isHovered) {
      mousePos.x = ev.offsetX / width;
      mousePos.y = ev.offsetY / height;

      if (activePoint) {
        activePoint.x = mousePos.x;
        activePoint.y = mousePos.y;

        updateValue();
      }
    }
  };

  const handleMouseDown = (ev) => {
    if (activePoint) {
      points.splice(points.indexOf(activePoint), 1);
    } else {
      const _points = points
        .map((p, i) => {
          return {
            i,
            d: Math.abs(p.x - mousePos.x) + Math.abs(p.y - mousePos.y),
          };
        })
        .sort((a, b) => {
          return a.d < b.d ? -1 : 1;
        });

      if (_points[0].d < hoverDistance && !points[_points[0].i].pinned) {
        activePoint = points[_points[0].i];
        pointDownPos.x = activePoint.x;
        pointDownPos.y = activePoint.y;
        mouseDownPos.x = ev.offsetX / cWidth;
        mouseDownPos.y = (cHeight - ev.offsetY) / cHeight;
      } else {
        const point = {
          x: mousePos.x,
          y: mousePos.y,
          pinned: false,
        };
        activePoint = point;
        pointDownPos.x = activePoint.x;
        pointDownPos.y = activePoint.y;
        mouseDownPos.x = ev.offsetX / cWidth;
        mouseDownPos.y = (cHeight - ev.offsetY) / cHeight;
        points.push(point);
      }
    }

    updateValue();
  };

  //TODO: Fix possible multiple starts of the render loop

  function render() {
    ctx.clearRect(0, 0, cWidth, cHeight);

    ctx.lineWidth = 1;
    ctx.strokeStyle = 'white';
    ctx.fillStyle = 'white';

    const absPoints = points
      .sort((a, b) => (a.x > b.x ? 1 : -1))
      .map(({ x, y, pinned = false }) => {
        return { x: x * cWidth, y: y * cHeight, pinned };
      });

    curve.drawCurve(ctx, absPoints);

    if (isHovered) {
      requestAnimationFrame(render);
      drawControlPoints(absPoints);
    }
  }

  const drawControlPoints = (pts) =>
    pts.forEach((p, i) => {
      ctx.beginPath();

      const mouseDistance =
        Math.abs(points[i].x - mousePos.x) + Math.abs(points[i].y - mousePos.y);

      if (!p.pinned) {
        if (mouseDistance < hoverDistance) {
          ctx.arc(p.x, p.y, 5, 0, 2 * Math.PI);
          ctx.fillStyle = 'white';
          ctx.fill();
        } else {
          ctx.arc(p.x, p.y, 4, 0, 2 * Math.PI);
          ctx.fillStyle = '#4b4b4b';
          ctx.fill();

          ctx.arc(p.x, p.y, 4, 0, 2 * Math.PI);
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      }
    });

  onMount(() => {
    ctx = canvas.getContext('2d');

    const { devicePixelRatio } = window;
    if (devicePixelRatio) {
      cWidth = width * devicePixelRatio;
      cHeight = height * devicePixelRatio;
    }

    setTimeout(() => {
      render();

      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
    }, 50);
  });
</script>

<style lang="scss">
  @import './global.scss';
  div {
    width: 100%;
    background-color: #4b4b4b;
    border-radius: 2px;
    overflow: hidden;
    max-width: 200px;
  }

  canvas {
    width: 100%;
  }
</style>

<svelte:options tag="plant-curve" />

<svelte:window
  on:mouseup={() => {
    setTimeout(() => {
      activePoint = undefined;
    }, 100);
  }} />

<div class="component-wrapper">
  <div
    bind:this={el}
    on:mouseover={() => {
      isHovered = true;
      render();
    }}
    on:mouseleave={() => {
      isHovered = false;
    }}
    on:mousemove={handleMouseMove}
    on:mousedown={handleMouseDown}>
    <canvas bind:this={canvas} width={cWidth} height={cHeight} />
  </div>
</div>
