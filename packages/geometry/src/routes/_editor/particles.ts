import { Geometry, Mesh } from 'ogl-typescript';
import { particle } from './shaders';

export default (gl) => {
	const data = Float32Array.from([0, 1, 0, 0, 0.5, 0]);
	const geometry = new Geometry(gl, {
		position: { size: 3, data }
	});
	// Make sure mode is gl.POINTS
	const particles = new Mesh(gl, {
		mode: gl.POINTS,
		geometry,
		program: particle(gl)
	});

	particles.setPositions = (data) => {
		// particles.geometry.addAttribute("position", { size: 3, data: pos });
		// particles.geometry.attributes.position.needsUpdate = true;
		particles.geometry = new Geometry(gl, {
			position: { size: 3, data }
		});
	};

	return particles;
};
