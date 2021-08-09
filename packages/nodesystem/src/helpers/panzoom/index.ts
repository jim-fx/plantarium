import type NodeSystemView from '../../view/NodeSystemView';
import makeDomController from './domController';
import kinetic from './kinetic';

interface Bounds {
  left: number;
  top: number;
  right: number;
  bottom: number;
}
export interface Transform {
  x: number;
  y: number;
  scale: number;
}

export interface TransformOrigin {
  x: number;
  y: number;
}
export interface PanZoomController {
  getOwner: () => Element;
  applyTransform: (transform: Transform) => void;
}

interface PanZoomOptions {
  filterKey?: () => boolean;
  bounds?: boolean | Bounds;
  maxZoom?: number;
  minZoom?: number;
  boundsPadding?: number;
  zoomDoubleClickSpeed?: number;
  zoomSpeed?: number;
  initialX?: number;
  initialY?: number;
  initialZoom?: number;
  pinchSpeed?: number;
  beforeWheel?: (e: WheelEvent) => void;
  beforeMouseDown?: (e: MouseEvent) => void;
  autocenter?: boolean;
  onTouch?: (e: TouchEvent) => void;
  onTransform?: (t: Transform) => void;
  onDoubleClick?: (e: Event) => void;
  smoothScroll?: boolean;
  controller?: PanZoomController;
  enableTextSelection?: boolean;
  disableKeyboardInteraction?: boolean;
  transformOrigin?: TransformOrigin;
  view?: NodeSystemView;
}

const defaultZoomSpeed = 0.2;

/**
 * Creates a new instance of panzoom, so that an object can be panned and zoomed
 *
 * @param {DOMElement} domElement where panzoom should be attached.
 * @param {Object} options that configure behavior.
 */
export function createPanZoom(
  domElement: HTMLElement,
  options: PanZoomOptions,
) {
  const panController = makeDomController(domElement);

  const owner = panController.getOwner();
  // just to avoid GC pressure, every time we do intermediate transform
  // we return this object. For internal use only. Never give it back to the consumer of this library
  const storedCTMResult = { x: 0, y: 0 };

  let isDirty = false;
  const transform = {
    x: 0,
    y: 0,
    scale: 1,
  };

  // TODO: likely need to unite pinchSpeed with zoomSpeed
  const pinchSpeed =
    typeof options.pinchSpeed === 'number' ? options.pinchSpeed : 1;
  const bounds = options.bounds;
  const maxZoom =
    typeof options.maxZoom === 'number'
      ? options.maxZoom
      : Number.POSITIVE_INFINITY;
  const minZoom = typeof options.minZoom === 'number' ? options.minZoom : 0;

  const boundsPadding =
    typeof options.boundsPadding === 'number' ? options.boundsPadding : 0.05;

  const speed =
    typeof options.zoomSpeed === 'number'
      ? options.zoomSpeed
      : defaultZoomSpeed;
  let transformOrigin = parseTransformOrigin(options.transformOrigin);

  validateBounds(bounds);

  let frameAnimation;
  let touchInProgress = false;

  // We only need to fire panstart when actual move happens
  let panstartFired = false;

  // cache mouse coordinates here
  let mouseX;
  let mouseY;

  let pinchZoomLength;

  const smoothScroll = kinetic(getPoint, scroll, options.smoothScroll);

  let zoomToAnimation;

  let multiTouch;
  let paused = false;

  listenForEvents();

  const api = {
    dispose,
    moveBy,
    moveTo,
    smoothMoveTo,
    centerOn,
    zoomTo: publicZoomTo,
    zoomAbs,

    pause,
    resume,
    isPaused,

    getTransform: getTransformModel,

    setTransform,

    getTransformOrigin,
    setTransformOrigin,
  };

  const initialX =
    typeof options.initialX === 'number' ? options.initialX : transform.x;
  const initialY =
    typeof options.initialY === 'number' ? options.initialY : transform.y;
  const initialZoom =
    typeof options.initialZoom === 'number'
      ? options.initialZoom
      : transform.scale;

  if (
    initialX != transform.x ||
    initialY != transform.y ||
    initialZoom != transform.scale
  ) {
    zoomAbs(initialX, initialY, initialZoom);
  }

  return api;

  function pause() {
    releaseEvents();
    paused = true;
  }

  function resume() {
    if (paused) {
      listenForEvents();
      paused = false;
    }
  }

  function isPaused() {
    return paused;
  }

  function transformToScreen(x, y) {
    storedCTMResult.x = x;
    storedCTMResult.y = y;

    return storedCTMResult;
  }

  function setTransform(x, y, s) {
    transform.x = x;
    transform.y = y;
    transform.scale = s;
    makeDirty();
  }

  function getTransformModel() {
    // TODO: should this be read only?
    return transform;
  }

  function getTransformOrigin() {
    return transformOrigin;
  }

  function setTransformOrigin(newTransformOrigin) {
    transformOrigin = parseTransformOrigin(newTransformOrigin);
  }

  function getPoint() {
    return {
      x: transform.x,
      y: transform.y,
    };
  }

  function moveTo(x, y) {
    transform.x = x;
    transform.y = y;

    keepTransformInsideBounds();

    makeDirty();
  }

  function moveBy(dx, dy) {
    moveTo(transform.x + dx, transform.y + dy);
  }

  function keepTransformInsideBounds() {
    const boundingBox = getBoundingBox();
    if (!boundingBox) return;

    let adjusted = false;
    const clientRect = getClientRect();

    let diff = boundingBox.left - clientRect.right;
    if (diff > 0) {
      transform.x += diff;
      adjusted = true;
    }
    // check the other side:
    diff = boundingBox.right - clientRect.left;
    if (diff < 0) {
      transform.x += diff;
      adjusted = true;
    }

    // y axis:
    diff = boundingBox.top - clientRect.bottom;
    if (diff > 0) {
      // we adjust transform, so that it matches exactly our bounding box:
      // transform.y = boundingBox.top - (boundingBox.height + boundingBox.y) * transform.scale =>
      // transform.y = boundingBox.top - (clientRect.bottom - transform.y) =>
      // transform.y = diff + transform.y =>
      transform.y += diff;
      adjusted = true;
    }

    diff = boundingBox.bottom - clientRect.top;
    if (diff < 0) {
      transform.y += diff;
      adjusted = true;
    }
    return adjusted;
  }

  /**
   * Returns bounding box that should be used to restrict scene movement.
   */
  function getBoundingBox() {
    if (!bounds) return; // client does not want to restrict movement

    if (typeof bounds === 'boolean') {
      // for boolean type we use parent container bounds
      const ownerRect = owner.getBoundingClientRect();
      const sceneWidth = ownerRect.width;
      const sceneHeight = ownerRect.height;

      return {
        left: sceneWidth * boundsPadding,
        top: sceneHeight * boundsPadding,
        right: sceneWidth * (1 - boundsPadding),
        bottom: sceneHeight * (1 - boundsPadding),
      };
    }

    return bounds;
  }

  function getClientRect() {
    const bbox = panController.getBBox();
    const leftTop = client(bbox.left, bbox.top);

    return {
      left: leftTop.x,
      top: leftTop.y,
      right: bbox.width * transform.scale + leftTop.x,
      bottom: bbox.height * transform.scale + leftTop.y,
    };
  }

  function client(x, y) {
    return {
      x: x * transform.scale + transform.x,
      y: y * transform.scale + transform.y,
    };
  }

  function makeDirty() {
    isDirty = true;

    frameAnimation = window.requestAnimationFrame(frame);
  }

  function zoomByRatio(clientX, clientY, ratio) {
    if (isNaN(clientX) || isNaN(clientY) || isNaN(ratio)) {
      throw new Error('zoom requires valid numbers');
    }

    const newScale = transform.scale * ratio;

    if (newScale < minZoom) {
      if (transform.scale === minZoom) return;

      ratio = minZoom / transform.scale;
    }
    if (newScale > maxZoom) {
      if (transform.scale === maxZoom) return;

      ratio = maxZoom / transform.scale;
    }

    const size = transformToScreen(clientX, clientY);

    transform.x = size.x - ratio * (size.x - transform.x);
    transform.y = size.y - ratio * (size.y - transform.y);

    // TODO: https://github.com/anvaka/panzoom/issues/112
    if (bounds && boundsPadding === 1 && minZoom === 1) {
      transform.scale *= ratio;
      keepTransformInsideBounds();
    } else {
      const transformAdjusted = keepTransformInsideBounds();
      if (!transformAdjusted) transform.scale *= ratio;
    }

    makeDirty();
  }

  function zoomAbs(clientX, clientY, zoomLevel) {
    const ratio = zoomLevel / transform.scale;
    zoomByRatio(clientX, clientY, ratio);
  }

  function centerOn(ui) {
    const parent = ui.ownerSVGElement;
    if (!parent)
      throw new Error('ui element is required to be within the scene');

    // TODO: should i use controller's screen CTM?
    const clientRect = ui.getBoundingClientRect();
    const cx = clientRect.left + clientRect.width / 2;
    const cy = clientRect.top + clientRect.height / 2;

    const container = parent.getBoundingClientRect();
    const dx = container.width / 2 - cx;
    const dy = container.height / 2 - cy;

    internalMoveBy(dx, dy, true);
  }

  function smoothMoveTo(x, y) {
    internalMoveBy(x - transform.x, y - transform.y, true);
  }

  function internalMoveBy(dx, dy, smooth = false) {
    if (!smooth) {
      return moveBy(dx, dy);
    }

    // if (moveByAnimation) moveByAnimation.cancel();

    // TODO: remimplement animation?
    // const from = { x: 0, y: 0 };
    // const to = { x: dx, y: dy };
    // let lastX = 0;
    // let lastY = 0;

    // moveByAnimation = animate(from, to, {
    //   step: function (v) {
    //     moveBy(v.x - lastX, v.y - lastY);

    //     lastX = v.x;
    //     lastY = v.y;
    //   },
    // });
  }

  function scroll(x, y) {
    cancelZoomAnimation();
    moveTo(x, y);
  }

  function dispose() {
    releaseEvents();
  }

  function listenForEvents() {
    owner.addEventListener('mousedown', onMouseDown, { passive: true });
    owner.addEventListener('dblclick', onDoubleClick, { passive: false });
    owner.addEventListener('touchstart', onTouch, { passive: true });
    owner.addEventListener('keydown', onKeyDown);

    // Need to listen on the owner container, so that we are not limited
    // by the size of the scrollable domElement
    owner.addEventListener('wheel', onMouseWheel, { passive: true });

    makeDirty();
  }

  function releaseEvents() {
    owner.removeEventListener('wheel', onMouseWheel);
    owner.removeEventListener('mousedown', onMouseDown);
    owner.removeEventListener('keydown', onKeyDown);
    owner.removeEventListener('dblclick', onDoubleClick);
    owner.removeEventListener('touchstart', onTouch);

    if (frameAnimation) {
      window.cancelAnimationFrame(frameAnimation);
      frameAnimation = 0;
    }

    smoothScroll.cancel();

    releaseDocumentMouse();
    releaseTouches();

    triggerPanEnd();
  }

  function frame() {
    if (isDirty) applyTransform();
  }

  function applyTransform() {
    isDirty = false;

    // TODO: Should I allow to cancel this?
    panController.applyTransform(transform);

    frameAnimation = 0;

    if (options.onTransform) {
      options.onTransform(transform);
    }
  }

  function onKeyDown(e) {
    console.log('Ezzzz');

    let x = 0,
      y = 0,
      z = 0;
    if (e.keyCode === 38) {
      y = 1; // up
    } else if (e.keyCode === 40) {
      y = -1; // down
    } else if (e.keyCode === 37) {
      x = 1; // left
    } else if (e.keyCode === 39) {
      x = -1; // right
    } else if (e.keyCode === 189 || e.keyCode === 109) {
      // DASH or SUBTRACT
      z = 1; // `-` -  zoom out
    } else if (e.keyCode === 187 || e.keyCode === 107) {
      // EQUAL SIGN or ADD
      z = -1; // `=` - zoom in (equal sign on US layout is under `+`)
    }

    if (x || y) {
      e.preventDefault();
      e.stopPropagation();

      const clientRect = owner.getBoundingClientRect();
      // movement speed should be the same in both X and Y direction:
      const offset = Math.min(clientRect.width, clientRect.height);
      const moveSpeedRatio = 0.05;
      const dx = offset * moveSpeedRatio * x;
      const dy = offset * moveSpeedRatio * y;

      // TODO: currently we do not animate this. It could be better to have animation
      internalMoveBy(dx, dy);
    }

    if (z) {
      const scaleMultiplier = getScaleMultiplier(z * 100);
      const offset = transformOrigin ? getTransformOriginOffset() : midPoint();
      publicZoomTo(offset.x, offset.y, scaleMultiplier);
    }
  }

  function midPoint() {
    const ownerRect = owner.getBoundingClientRect();
    return {
      x: ownerRect.width / 2,
      y: ownerRect.height / 2,
    };
  }

  function onTouch(e) {
    // let the override the touch behavior
    beforeTouch(e);

    if (e.touches.length === 1) {
      return handleSingleFingerTouch(e);
    } else if (e.touches.length === 2) {
      // handleTouchMove() will care about pinch zoom.
      pinchZoomLength = getPinchZoomLength(e.touches[0], e.touches[1]);
      multiTouch = true;
      startTouchListenerIfNeeded();
    }
  }

  function beforeTouch(e) {
    e.stopPropagation();
    e.preventDefault();
  }

  function beforeDoubleClick(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  function handleSingleFingerTouch(e) {
    const touch = e.touches[0];
    const offset = getOffsetXY(touch);
    const point = transformToScreen(offset.x, offset.y);
    mouseX = point.x;
    mouseY = point.y;

    smoothScroll.cancel();
    startTouchListenerIfNeeded();
  }

  function startTouchListenerIfNeeded() {
    if (touchInProgress) {
      // no need to do anything, as we already listen to events;
      return;
    }

    touchInProgress = true;
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
    document.addEventListener('touchcancel', handleTouchEnd);
  }

  function handleTouchMove(e) {
    if (e.touches.length === 1) {
      e.stopPropagation();
      const touch = e.touches[0];

      const offset = getOffsetXY(touch);
      const point = transformToScreen(offset.x, offset.y);

      const dx = point.x - mouseX;
      const dy = point.y - mouseY;

      if (dx !== 0 && dy !== 0) {
        triggerPanStart();
      }
      mouseX = point.x;
      mouseY = point.y;
      internalMoveBy(dx, dy);
    } else if (e.touches.length === 2) {
      // it's a zoom, let's find direction
      multiTouch = true;
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const currentPinchLength = getPinchZoomLength(t1, t2);

      // since the zoom speed is always based on distance from 1, we need to apply
      // pinch speed only on that distance from 1:
      const scaleMultiplier =
        1 + (currentPinchLength / pinchZoomLength - 1) * pinchSpeed;

      const firstTouchPoint = getOffsetXY(t1);
      const secondTouchPoint = getOffsetXY(t2);
      mouseX = (firstTouchPoint.x + secondTouchPoint.x) / 2;
      mouseY = (firstTouchPoint.y + secondTouchPoint.y) / 2;
      if (transformOrigin) {
        const offset = getTransformOriginOffset();
        mouseX = offset.x;
        mouseY = offset.y;
      }

      publicZoomTo(mouseX, mouseY, scaleMultiplier);

      pinchZoomLength = currentPinchLength;
      e.stopPropagation();
      e.preventDefault();
    }
  }

  function handleTouchEnd(e) {
    if (e.touches.length > 0) {
      const offset = getOffsetXY(e.touches[0]);
      const point = transformToScreen(offset.x, offset.y);
      mouseX = point.x;
      mouseY = point.y;
    }
  }

  function getPinchZoomLength(finger1, finger2) {
    const dx = finger1.clientX - finger2.clientX;
    const dy = finger1.clientY - finger2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function onDoubleClick(e) {
    beforeDoubleClick(e);
  }

  function onMouseDown(e) {
    if (touchInProgress) {
      // modern browsers will fire mousedown for touch events too
      // we do not want this: touch is handled separately.
      e.stopPropagation();
      return false;
    }
    // for IE, left click == 1
    // for Firefox, left click == 0
    const isLeftButton =
      (e.button === 1 && window.event !== null) || e.button === 0;
    if (!isLeftButton) return;

    smoothScroll.cancel();

    const offset = getOffsetXY(e);
    const point = transformToScreen(offset.x, offset.y);
    mouseX = point.x;
    mouseY = point.y;

    // We need to listen on document itself, since mouse can go outside of the
    // window, and we will loose it
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    return false;
  }

  function onMouseMove(e: MouseEvent) {
    // no need to worry about mouse events when touch is happening
    if (touchInProgress) return;

    if (e.ctrlKey) return;

    triggerPanStart();

    const offset = getOffsetXY(e);
    const point = transformToScreen(offset.x, offset.y);
    const dx = point.x - mouseX;
    const dy = point.y - mouseY;

    mouseX = point.x;
    mouseY = point.y;

    internalMoveBy(dx, dy);
  }

  function onMouseUp() {
    triggerPanEnd();
    releaseDocumentMouse();
  }

  function releaseDocumentMouse() {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
    panstartFired = false;
  }

  function releaseTouches() {
    document.removeEventListener('touchmove', handleTouchMove);
    document.removeEventListener('touchend', handleTouchEnd);
    document.removeEventListener('touchcancel', handleTouchEnd);
    panstartFired = false;
    multiTouch = false;
    touchInProgress = false;
  }

  function onMouseWheel(e) {
    smoothScroll.cancel();

    let delta = e.deltaY;
    if (e.deltaMode > 0) delta *= 100;

    const scaleMultiplier = getScaleMultiplier(delta);

    if (scaleMultiplier !== 1) {
      const offset = transformOrigin
        ? getTransformOriginOffset()
        : getOffsetXY(e);
      publicZoomTo(offset.x, offset.y, scaleMultiplier);
    }
  }

  function getOffsetXY(e) {
    // let offsetX, offsetY;
    // I tried using e.offsetX, but that gives wrong results for svg, when user clicks on a path.
    const ownerRect = owner.getBoundingClientRect();
    const offsetX = e.clientX - ownerRect.left;
    const offsetY = e.clientY - ownerRect.top;

    return { x: offsetX, y: offsetY };
  }

  function getTransformOriginOffset() {
    const ownerRect = owner.getBoundingClientRect();
    return {
      x: ownerRect.width * transformOrigin.x,
      y: ownerRect.height * transformOrigin.y,
    };
  }

  function publicZoomTo(clientX, clientY, scaleMultiplier) {
    smoothScroll.cancel();
    cancelZoomAnimation();
    return zoomByRatio(clientX, clientY, scaleMultiplier);
  }

  function cancelZoomAnimation() {
    if (zoomToAnimation) {
      zoomToAnimation.cancel();
      zoomToAnimation = null;
    }
  }

  function getScaleMultiplier(delta) {
    const sign = Math.sign(delta);
    const deltaAdjustedSpeed = Math.min(0.25, Math.abs((speed * delta) / 128));
    return 1 - sign * deltaAdjustedSpeed;
  }

  function triggerPanStart() {
    if (!panstartFired) {
      panstartFired = true;
      smoothScroll.start();
    }
  }

  function triggerPanEnd() {
    if (panstartFired) {
      // we should never run smooth scrolling if it was multiTouch (pinch zoom animation):
      if (!multiTouch) smoothScroll.stop();
    }
  }
}

function parseTransformOrigin(options) {
  if (!options) return;
  if (typeof options === 'object') {
    if (!isNumber(options.x) || !isNumber(options.y))
      failTransformOrigin(options);
    return options;
  }

  failTransformOrigin();
}

function failTransformOrigin(options?: unknown) {
  console.error(options);
  throw new Error(
    [
      'Cannot parse transform origin.',
      'Some good examples:',
      '  "center center" can be achieved with {x: 0.5, y: 0.5}',
      '  "top center" can be achieved with {x: 0.5, y: 0}',
      '  "bottom right" can be achieved with {x: 1, y: 1}',
    ].join('\n'),
  );
}

function validateBounds(bounds) {
  const boundsType = typeof bounds;
  if (boundsType === 'undefined' || boundsType === 'boolean') return; // this is okay
  // otherwise need to be more thorough:
  const validBounds =
    isNumber(bounds.left) &&
    isNumber(bounds.top) &&
    isNumber(bounds.bottom) &&
    isNumber(bounds.right);

  if (!validBounds)
    throw new Error(
      'Bounds object is not valid. It can be: ' +
        'undefined, boolean (true|false) or an object {left, top, right, bottom}',
    );
}

function isNumber(x) {
  return Number.isFinite(x);
}

// IE 11 does not support isNaN:
function isNaN(value) {
  if (Number.isNaN) {
    return Number.isNaN(value);
  }

  return value !== value;
}
