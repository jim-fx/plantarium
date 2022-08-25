export default function makeDomController(domElement: HTMLElement) {
  const elementValid = isDomElement(domElement);
  if (!elementValid) {
    throw new Error(
      'panzoom requires DOM element to be attached to the DOM tree',
    );
  }

  const owner = domElement.parentElement;
  domElement.scrollTop = 0;

  const api = {
    getBBox: getBBox,
    getOwner: getOwner,
    applyTransform: applyTransform,
  };

  return api;

  function getOwner() {
    return owner;
  }

  function getBBox() {
    // TODO: We should probably cache this?
    return {
      left: 0,
      top: 0,
      width: domElement.clientWidth,
      height: domElement.clientHeight,
    };
  }

  function applyTransform(transform: { scale: number; x: number; y: number }) {
    // TODO: Should we cache this?
    domElement.style.transformOrigin = '0 0 0';
    domElement.style.transform =
      'matrix(' +
      transform.scale +
      ', 0, 0, ' +
      transform.scale +
      ', ' +
      transform.x +
      ', ' +
      transform.y +
      ')';
  }
}

export function isDomElement(element: HTMLElement) {
  return element && element.parentElement && element.style;
}
