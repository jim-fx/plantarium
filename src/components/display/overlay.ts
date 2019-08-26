const wrapper = <HTMLElement>document.getElementById("overlay-wrapper");

const msCanvas = document.createElement("canvas");
const msWidth = 200;
const msMin = 20;
const msMax = 70;
msCanvas.width = msWidth;
msCanvas.height = 50;
const msArray: number[] = [];
const msCtx = <CanvasRenderingContext2D>msCanvas.getContext("2d");
msCanvas.style.bottom = "0";
msCanvas.style.left = "0";
wrapper.append(msCanvas);

export default {
  ms: (ms: number) => {
    msCtx.clearRect(0, 0, msWidth, 50);

    msArray.push(ms);
    if (msArray.length > msWidth / 2) msArray.shift();

    const max = Math.max(...msArray);
    msArray.forEach((ms: number, i: number) => {
      const v = Math.min(Math.max((ms - msMin) / msMax, 0), 1);
      msCtx.fillStyle = `rgba(${v * 255}, ${(1 - v) * 255}, 0, 0.2)`;
      const height = 50 * (ms / max);
      msCtx.fillRect(msWidth - i * 2, 50 - height, 2, height);
    });
    msCtx.fillStyle = "black";
    msCtx.fillText(ms + "ms", 10, 40);
  }
};
