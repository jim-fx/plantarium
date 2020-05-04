import { Box } from 'ogl';

// export { default as plant } from './createPlantGeometry';
export { default as grid } from './geometry/grid';
export { default as ground } from './geometry/ground';

const cube = (
  gl: WebGL2RenderingContext,
  props: { width: number; depth: number; height: number },
) => {
  return new Box(gl, props);
};

export { cube };

function plant(d: any, a: any) {}

export { plant };
