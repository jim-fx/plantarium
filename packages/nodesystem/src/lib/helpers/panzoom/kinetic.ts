/**
 * Allows smooth kinetic scrolling of the surface
 */
export default function kinetic(
  getPoint: () => { x: number; y: number },
  scroll: (x: number, y: number) => void,
  settings: Record<string, unknown>,
) {
  if (typeof settings !== 'object') {
    // setting could come as boolean, we should ignore it, and use an object.
    settings = {};
  }

  const minVelocity =
    typeof settings.minVelocity === 'number' ? settings.minVelocity : 5;
  const amplitude =
    typeof settings.amplitude === 'number' ? settings.amplitude : 0.25;
  const cancelAnimationFrame =
    typeof settings.cancelAnimationFrame === 'function'
      ? settings.cancelAnimationFrame
      : getCancelAnimationFrame();
  const requestAnimationFrame =
    typeof settings.requestAnimationFrame === 'function'
      ? settings.requestAnimationFrame
      : getRequestAnimationFrame();

  let lastPoint: { x: number; y: number };
  let timestamp: number;
  const timeConstant = 342;

  let ticker: unknown;
  let vx: number, targetX: number, ax: number;
  let vy: number, targetY: number, ay: number;

  let raf: unknown;

  return {
    start: start,
    stop: stop,
    cancel: dispose,
  };

  function dispose() {
    cancelAnimationFrame(ticker);
    cancelAnimationFrame(raf);
  }

  function start() {
    lastPoint = getPoint();

    ax = ay = vx = vy = 0;
    timestamp = Date.now();

    cancelAnimationFrame(ticker);
    cancelAnimationFrame(raf);

    // we start polling the point position to accumulate velocity
    // Once we stop(), we will use accumulated velocity to keep scrolling
    // an object.
    ticker = requestAnimationFrame(track);
  }

  function track() {
    const now = Date.now();
    const elapsed = now - timestamp;
    timestamp = now;

    const currentPoint = getPoint();

    const dx = currentPoint.x - lastPoint.x;
    const dy = currentPoint.y - lastPoint.y;

    lastPoint = currentPoint;

    const dt = 1000 / (1 + elapsed);

    // moving average
    vx = 0.8 * dx * dt + 0.2 * vx;
    vy = 0.8 * dy * dt + 0.2 * vy;

    ticker = requestAnimationFrame(track);
  }

  function stop() {
    cancelAnimationFrame(ticker);
    cancelAnimationFrame(raf);

    const currentPoint = getPoint();

    targetX = currentPoint.x;
    targetY = currentPoint.y;
    timestamp = Date.now();

    if (vx < -minVelocity || vx > minVelocity) {
      ax = amplitude * vx;
      targetX += ax;
    }

    if (vy < -minVelocity || vy > minVelocity) {
      ay = amplitude * vy;
      targetY += ay;
    }

    raf = requestAnimationFrame(autoScroll);
  }

  function autoScroll() {
    const elapsed = Date.now() - timestamp;

    let moving = false;
    let dx = 0;
    let dy = 0;

    if (ax) {
      dx = -ax * Math.exp(-elapsed / timeConstant);

      if (dx > 0.5 || dx < -0.5) moving = true;
      else dx = ax = 0;
    }

    if (ay) {
      dy = -ay * Math.exp(-elapsed / timeConstant);

      if (dy > 0.5 || dy < -0.5) moving = true;
      else dy = ay = 0;
    }

    if (moving) {
      scroll(targetX + dx, targetY + dy);
      raf = requestAnimationFrame(autoScroll);
    }
  }
}

function getCancelAnimationFrame() {
  if (typeof cancelAnimationFrame === 'function') return cancelAnimationFrame;
  return clearTimeout;
}

function getRequestAnimationFrame() {
  if (typeof requestAnimationFrame === 'function') return requestAnimationFrame;

  return function (handler: () => void) {
    return setTimeout(handler, 16);
  };
}
