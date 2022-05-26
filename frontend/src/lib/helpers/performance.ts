import { get, writable } from "svelte/store";
import type { Writable } from "svelte/store"
import type { PlantariumSettings } from "$lib/types";

const renderPerf = writable<number[]>([])
const generatePerf = writable<number[]>([])

const timers: Record<string, number> = {}
const enabled: Record<string, boolean> = {
  render: false,
  generate: false,
}

export const times: { [key: string]: Writable<number[]> } = {
  render: renderPerf,
  generate: generatePerf,
}

export function start(key: string) {
  timers[key] = performance.now();
}

export function setSettings(s: PlantariumSettings) {
  enabled.render = !!s?.debug?.renderPerf;
  enabled.generate = !!s?.debug?.generatePerf;
}

export function add(key: string, time: number) {
  const store = key in times ? times[key] : writable<number[]>([]);
  store.update(s => {
    s.push(time);
    if (s.length > 200) s.shift();
    return s;
  })
  if (key in canvasUpdates) {
    canvasUpdates[key]();
  }
}

export function stop(key: string) {
  if (!enabled[key]) return;
  const time = performance.now() - (timers[key] ?? 0);
  add(key, time);
}


const canvases = {};
const canvasUpdates = {};

export function createCanvas(key: string, canvas?: HTMLCanvasElement) {

  canvas = canvas || canvases[key] || document.createElement("canvas");
  canvases[key] = canvas;

  const width = 200;
  const height = 100;

  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");

  canvasUpdates[key] = () => {

    const values = [...get(times[key])];
    const max = Math.max(...values);
    let sum = 0;

    const barWidth = width / 200;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)"
    ctx.fillRect(0, 0, width, height)

    for (let i = 0; i < values.length; i++) {
      sum += values[i];
      const v = values[i] * (height / max);
      ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
      ctx.fillRect(i * barWidth, height - v, barWidth, v);
    }

    ctx.fillStyle = "black";
    ctx.textAlign = "left";
    ctx.fillText(key + "", 10, 10)
    ctx.textAlign = "right";
    ctx.fillText(`avg: ${Math.floor(sum / values.length * 10) / 10}ms max: ${Math.floor(max * 10) / 10}ms`, 180, 10)

  };


}

