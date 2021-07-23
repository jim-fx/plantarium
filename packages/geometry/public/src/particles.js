import { Geometry, Mesh } from 'https://cdn.skypack.dev/ogl';
import { particle } from './shaders.js';

export default (gl) => {
  const geometry = new Geometry(gl, {
    position: { size: 3, data: new Float32Array(3) },
  });
  // Make sure mode is gl.POINTS
  const particles = new Mesh(gl, {
    mode: gl.POINTS,
    geometry,
    program: particle(gl),
  });

  particles.setPositions = (pos) => {
    particles.geometry = new Geometry(gl, {
      position: { size: 3, data: pos },
    });
  };

  return particles;
};
