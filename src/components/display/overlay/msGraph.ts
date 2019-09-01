export default function(name: string, suffix: string, left: number, bottom: number, wrapper: HTMLElement): Function {
  const msCanvas = document.createElement("canvas");
  msCanvas.style.display = "none";
  const msWidth = 200;
  const msMin = 20;
  const msMax = 70;
  msCanvas.width = msWidth;
  msCanvas.height = 50;
  const msArray: number[] = [];
  const msCtx = <CanvasRenderingContext2D>msCanvas.getContext("2d");
  msCanvas.style.bottom = bottom + "px";
  msCanvas.style.left = left + "px";
  wrapper.append(msCanvas);

  let visible = false;

  const exp = function(_ms: number) {
    if (!visible) return;

    const ms = Math.floor(_ms * 100) / 100;

    msCtx.clearRect(0, 0, msWidth, 50);

    msArray.push(ms);
    if (msArray.length > msWidth / 2) msArray.shift();

    const max = Math.max(...msArray);
    msArray.forEach((ms: number, i: number) => {
      const v = Math.min(Math.max((ms - msMin) / msMax, 0), 1);
      msCtx.fillStyle = `rgba(${v * 255}, ${(1 - v) * 255}, 0, 0.5)`;
      const height = 50 * (ms / max);
      msCtx.fillRect(msWidth - i * 2, 50 - height, 2, height);
    });
    msCtx.fillStyle = "black";
    msCtx.fillText(name + ": " + ms + suffix, 10, 40);
  };

  exp.show = function() {
    visible = true;
    msCanvas.style.display = "";
  };

  exp.hide = function() {
    visible = false;
    msCanvas.style.display = "none";
  };

  return exp;
}
