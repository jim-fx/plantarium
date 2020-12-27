<script>
  import { onMount } from 'svelte';
  import { Vec2 } from 'ogl';
  import { curve } from '@plantarium/helpers';

  export let points = [
    { x: 0.5, y: 1, locked: true },
    { x: 0.2, y: 0.6 },
    { x: 0.2, y: 0.3 },
    { x: 0.5, y: 0, locked: true },
  ];

  let canvas, ctx;

  const hoverDistance = 0.1;
  const tension = 0.4;

  let isHovered = false;
  let isRendering = false;
  let activePoint = undefined;
  let gradient;

  const mousePos = new Vec2(0, 0);
  const mouseDownPos = new Vec2(0, 0);
  const pointDownPos = new Vec2(0, 0);

  const width = 200;
  const height = 200;

  let cWidth = width;
  let cHeight = height;

  const handleMouseMove = (ev) => {
    if (isHovered) {
      mousePos.x = ev.offsetX / width;
      mousePos.y = ev.offsetY / height;

      if (activePoint) {
        if (activePoint.locked) {
          activePoint.x = Math.min(0.5, mousePos.x);
        } else {
          activePoint.x = Math.min(0.5, mousePos.x);
          activePoint.y = mousePos.y;
        }
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

      if (_points[0].d < hoverDistance) {
        activePoint = points[_points[0].i];
        pointDownPos.x = activePoint.x;
        pointDownPos.y = activePoint.y;
        mouseDownPos.x = ev.offsetX / cWidth;
        mouseDownPos.y = (cHeight - ev.offsetY) / cHeight;
      } else {
        const point = {
          x: mousePos.x,
          y: mousePos.y,
          locked: false,
        };
        activePoint = point;
        pointDownPos.x = activePoint.x;
        pointDownPos.y = activePoint.y;
        mouseDownPos.x = ev.offsetX / cWidth;
        mouseDownPos.y = (cHeight - ev.offsetY) / cHeight;
        points.push(point);
      }
    }
  };

  function render() {
    ctx.clearRect(0, 0, cWidth, cHeight);

    ctx.lineWidth = 1;
    ctx.strokeStyle = 'white';
    ctx.fillStyle = 'white';

    points = points.sort(({ y: ay, x: ax }, { y: by, x: bx }) => {
      if (ay === by) {
        if (ay < 0.5) {
          return ax > bx ? 1 : -1;
        } else {
          return ax > bx ? -1 : 1;
        }
      }

      return ay > by ? 1 : -1;
    });

    if (points[0].x !== 0.5) {
      delete points[0].locked;
      points = [
        {
          x: 0.5,
          y: 0,
          locked: true,
        },
        ...points,
      ];
    }

    if (points[points.length - 1].x !== 0.5) {
      delete points[points.length - 1].locked;
      points = [
        ...points,
        {
          x: 0.5,
          y: 1,
          locked: true,
        },
      ];
    }

    points = points.sort(({ y: ay, x: ax }, { y: by, x: bx }) => {
      if (ay === by) {
        if (ay < 0.5) {
          return ax > bx ? -1 : 1;
        } else {
          return ax > bx ? 1 : -1;
        }
      }

      return ay > by ? 1 : -1;
    });

    const absPoints = points.map(({ x, y, locked = false }) => {
      return { x: x * cWidth, y: y * cHeight, locked };
    });

    drawLines(absPoints);
    drawShape(absPoints);

    if (isHovered) {
      requestAnimationFrame(render);
      drawControlPoints(absPoints);
    }
  }

  function drawControlPoints(pts) {
    pts.forEach((p, i) => {
      ctx.beginPath();

      const mouseDistance =
        Math.abs(points[i].x - mousePos.x) + Math.abs(points[i].y - mousePos.y);

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
    });
  }

  function drawLines(pts) {
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    pts.forEach((p, i) => {
      // Skip first point
      if (i === 0) return;
      ctx.lineTo(pts[i].x, pts[i].y);
    });

    ctx.closePath();
    ctx.stroke();
  }

  function drawShape(pts) {
    ctx.beginPath();
    ctx.moveTo(cWidth - pts[0].x, pts[0].y);
    pts.forEach((p, i) => {
      // Skip first point
      if (i === 0) return;
      ctx.lineTo(cWidth - pts[i].x, pts[i].y);
    });

    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();
  }

  onMount(() => {
    ctx = canvas.getContext('2d');

    const { devicePixelRatio } = window;
    if (devicePixelRatio) {
      cWidth = width * devicePixelRatio;
      cHeight = height * devicePixelRatio;
    }

    gradient = ctx.createLinearGradient(0, 0, 0, cHeight);
    gradient.addColorStop(0, '#65e2a0');
    gradient.addColorStop(1, '#337150');

    setTimeout(render, 50);
  });
</script>

<style>
  #main {
    width: 200px;
    height: 200px;
    overflow: hidden;
  }

  #main > canvas {
    width: 100%;
  }
</style>

<svelte:options tag="plant-shape" />

<svelte:window
  on:mouseup={() => {
    setTimeout(() => {
      activePoint = undefined;
    }, 100);
  }} />

<plant-component padding="0px">
  <div
    id="main"
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
</plant-component>
