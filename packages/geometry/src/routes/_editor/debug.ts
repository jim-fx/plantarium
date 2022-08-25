import { Camera, Mesh, Vec3 } from 'ogl-typescript';
import store from './store.js';

let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;
let w = 200;
let h = 100;

function init(c: HTMLCanvasElement) {
	canvas = c;
	w = window.innerWidth / 2;
	h = window.innerHeight;

	canvas.width = w;
	canvas.height = h;

	ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
	if (ctx) {
		ctx.fillStyle = 'red';
		ctx.fillRect(0, 0, 50, 50);
	}
}

let camera: Camera,
	model: Mesh,
	visible = store.get('indecesVisible', false);

function setCamera(cam: Camera) {
	camera = cam;
}

function setVisible(vis: boolean) {
	visible = vis;
	if (canvas) {
		canvas.style.display = vis ? 'block' : 'none';
	}
	store.set('indecesVisible', vis);
}

function setModel(m: Mesh) {
	model = m;
}

function render() {
	if (!camera) return;

	ctx.clearRect(0, 0, w, h);

	if (model && visible) {
		const points = model?.geometry?.attributes?.position?.data;

		if (!points) return;

		const pointsL = points.length / 3;

		for (let i = 0; i < pointsL; i++) {
			const v = new Vec3(points[i * 3], points[i * 3 + 1], points[i * 3 + 2]);
			camera.project(v);
			ctx.font = '30px Arial';
			ctx.fillText(i.toString(), (w + w * v[0]) / 2, (h - h * v[1]) / 2);
		}
	}
}

export default {
	init,
	render,
	setModel,
	setVisible,
	setCamera
};
