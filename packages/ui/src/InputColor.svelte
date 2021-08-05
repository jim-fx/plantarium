<svelte:options tag="plant-color" />

<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';

  export let startColor = '#FF0000';

  export let fullWidth = false;

  onMount(() => {
    document.addEventListener('mouseup', mouseUp);
    document.addEventListener('touchend', mouseUp);
    document.addEventListener('mousemove', mouseMove);
    document.addEventListener('touchmove', touchMove);
    document.addEventListener('touchstart', killMouseEvents);
    document.addEventListener('mousedown', killTouchEvents);
    setStartColor();
  });

  export let showAlpha = false;
  export let showOutput = false;

  const dispatch = createEventDispatcher();
  let tracked;
  let h = 1;
  let s = 1;
  let v = 1;
  let a = 1;
  let r = 255;
  let g = 0;
  let b = 0;
  let hexValue = '#FF0000';

  let colorSquare: HTMLElement;
  let colorSquarePicker: HTMLElement;
  let pickedColor: HTMLElement;
  let huePicker: HTMLElement;
  let alphaPicker: HTMLElement;

  function setStartColor() {
    let hex = startColor.replace('#', '');
    if (hex.length !== 6 && hex.length !== 3 && !hex.match(/([^A-F0-9])/gi)) {
      alert('Invalid property value (startColor)');
      return;
    }
    let hexFiltered = '';
    if (hex.length === 3)
      hex.split('').forEach((c) => {
        hexFiltered += c + c;
      });
    else hexFiltered = hex;
    hexValue = hexFiltered;
    r = parseInt(hexFiltered.substring(0, 2), 16);
    g = parseInt(hexFiltered.substring(2, 4), 16);
    b = parseInt(hexFiltered.substring(4, 6), 16);
    rgbToHSV(r, g, b, true);
    updateCsPicker();
    updateHuePicker();
  }

  function removeEventListenerFromElement(
    elementId,
    eventName,
    listenerCallback,
  ) {
    let element = document.querySelector(elementId);
    if (element) element.removeEventListener(eventName, listenerCallback);
  }

  function killMouseEvents() {
    removeEventListenerFromElement('#alpha-event', 'mousedown', alphaDown);
    removeEventListenerFromElement('#colorsquare-event', 'mousedown', csDown);
    removeEventListenerFromElement('#hue-event', 'mousedown', hueDown);
    document.removeEventListener('mouseup', mouseUp);
    document.removeEventListener('mousemove', mouseMove);
    document.removeEventListener('touchstart', killMouseEvents);
    document.removeEventListener('mousedown', killTouchEvents);
  }

  function killTouchEvents() {
    removeEventListenerFromElement(
      '#alpha-event',
      'touchstart',
      alphaDownTouch,
    );
    removeEventListenerFromElement(
      '#colorsquare-event',
      'touchstart',
      csDownTouch,
    );
    removeEventListenerFromElement('#hue-event', 'touchstart', hueDownTouch);
    document.removeEventListener('touchend', mouseUp);
    document.removeEventListener('touchmove', touchMove);
    document.removeEventListener('touchstart', killMouseEvents);
    document.removeEventListener('mousedown', killTouchEvents);
  }

  function updateCsPicker() {
    let xPercentage = s * 100;
    let yPercentage = (1 - v) * 100;
    colorSquarePicker.style.top = yPercentage + '%';
    colorSquarePicker.style.left = xPercentage + '%';
  }

  function updateHuePicker() {
    let xPercentage = h * 100;
    huePicker.style.left = xPercentage + '%';
  }

  function colorChangeCallback() {
    dispatch('colorChange', {
      r: r,
      g: g,
      b: b,
      a: a,
    });
  }

  function mouseMove(event) {
    if (tracked) {
      let mouseX = event.clientX;
      let mouseY = event.clientY;
      let trackedPos = tracked.getBoundingClientRect();
      let xPercentage, yPercentage, picker;
      switch (tracked.id) {
        case 'colorsquare-event':
          xPercentage = ((mouseX - trackedPos.x) / 240) * 100;
          yPercentage = ((mouseY - trackedPos.y) / 160) * 100;
          xPercentage > 100
            ? (xPercentage = 100)
            : xPercentage < 0
            ? (xPercentage = 0)
            : null;
          yPercentage > 100
            ? (yPercentage = 100)
            : yPercentage < 0
            ? (yPercentage = 0)
            : null;
          yPercentage = yPercentage.toFixed(2);
          xPercentage = xPercentage.toFixed(2);
          colorSquarePicker.style.top = yPercentage + '%';
          colorSquarePicker.style.left = xPercentage + '%';
          s = xPercentage / 100;
          v = 1 - yPercentage / 100;
          colorChange();
          break;
        case 'hue-event':
          xPercentage = ((mouseX - 10 - trackedPos.x) / 220) * 100;
          xPercentage > 100
            ? (xPercentage = 100)
            : xPercentage < 0
            ? (xPercentage = 0)
            : null;
          xPercentage = xPercentage.toFixed(2);
          huePicker.style.left = xPercentage + '%';
          h = xPercentage / 100;
          hueChange();
          break;
        case 'alpha-event':
          xPercentage = ((mouseX - 10 - trackedPos.x) / 220) * 100;
          xPercentage > 100
            ? (xPercentage = 100)
            : xPercentage < 0
            ? (xPercentage = 0)
            : null;
          xPercentage = xPercentage.toFixed(2);
          alphaPicker.style.left = xPercentage + '%';
          a = xPercentage / 100;
          colorChange();
          break;
      }
    }
  }

  function touchMove(event) {
    if (tracked) {
      let mouseX = event.touches[0].clientX;
      let mouseY = event.touches[0].clientY;
      let trackedPos = tracked.getBoundingClientRect();
      let xPercentage, yPercentage, picker;
      switch (tracked.id) {
        case 'colorsquare-event':
          xPercentage = ((mouseX - trackedPos.x) / 240) * 100;
          yPercentage = ((mouseY - trackedPos.y) / 160) * 100;
          xPercentage > 100
            ? (xPercentage = 100)
            : xPercentage < 0
            ? (xPercentage = 0)
            : null;
          yPercentage > 100
            ? (yPercentage = 100)
            : yPercentage < 0
            ? (yPercentage = 0)
            : null;
          yPercentage = yPercentage.toFixed(2);
          xPercentage = xPercentage.toFixed(2);
          colorSquarePicker.style.top = yPercentage + '%';
          colorSquarePicker.style.left = xPercentage + '%';
          s = xPercentage / 100;
          v = 1 - yPercentage / 100;
          colorChange();
          break;
        case 'hue-event':
          xPercentage = ((mouseX - 10 - trackedPos.x) / 220) * 100;
          xPercentage > 100
            ? (xPercentage = 100)
            : xPercentage < 0
            ? (xPercentage = 0)
            : null;
          xPercentage = xPercentage.toFixed(2);
          huePicker.style.left = xPercentage + '%';
          h = xPercentage / 100;
          hueChange();
          break;
        case 'alpha-event':
          xPercentage = ((mouseX - 10 - trackedPos.x) / 220) * 100;
          xPercentage > 100
            ? (xPercentage = 100)
            : xPercentage < 0
            ? (xPercentage = 0)
            : null;
          xPercentage = xPercentage.toFixed(2);
          alphaPicker.style.left = xPercentage + '%';
          a = xPercentage / 100;
          colorChange();
          break;
      }
    }
  }

  function csDown(event) {
    tracked = event.currentTarget;
    let xPercentage = ((event.offsetX + 1) / 240) * 100;
    let yPercentage = ((event.offsetY + 1) / 160) * 100;
    yPercentage = +yPercentage.toFixed(2);
    xPercentage = +xPercentage.toFixed(2);
    colorSquarePicker.style.top = yPercentage + '%';
    colorSquarePicker.style.left = xPercentage + '%';
    s = xPercentage / 100;
    v = 1 - yPercentage / 100;
    colorChange();
  }

  function csDownTouch(event) {
    tracked = event.currentTarget;
    let rect = event.target.getBoundingClientRect();
    let offsetX = event.targetTouches[0].clientX - rect.left;
    let offsetY = event.targetTouches[0].clientY - rect.top;
    let xPercentage = ((offsetX + 1) / 240) * 100;
    let yPercentage = ((offsetY + 1) / 160) * 100;
    yPercentage = +yPercentage.toFixed(2);
    xPercentage = +xPercentage.toFixed(2);
    colorSquarePicker.style.top = yPercentage + '%';
    colorSquarePicker.style.left = xPercentage + '%';
    s = xPercentage / 100;
    v = 1 - yPercentage / 100;
    colorChange();
  }

  function mouseUp(event) {
    tracked = null;
  }

  function hueDown(event) {
    tracked = event.currentTarget;
    let xPercentage = ((event.offsetX - 9) / 220) * 100;
    xPercentage = +xPercentage.toFixed(2);
    huePicker.style.left = xPercentage + '%';
    h = xPercentage / 100;
    hueChange();
  }

  function hueDownTouch(event) {
    tracked = event.currentTarget;
    let rect = event.target.getBoundingClientRect();
    let offsetX = event.targetTouches[0].clientX - rect.left;
    let xPercentage = ((offsetX - 9) / 220) * 100;
    xPercentage = +xPercentage.toFixed(2);
    huePicker.style.left = xPercentage + '%';
    h = xPercentage / 100;
    hueChange();
  }

  function hueChange() {
    let rgb = hsvToRgb(h, 1, 1);
    colorSquare.style.background = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},1)`;
    colorChange();
  }

  function colorChange() {
    let rgb = hsvToRgb(h, s, v);
    r = rgb[0];
    g = rgb[1];
    b = rgb[2];
    hexValue = RGBAToHex();
    // pickedColor.style.background = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${a})`;
    colorChangeCallback();
  }

  function alphaDown(event) {
    tracked = event.currentTarget;
    let xPercentage = ((event.offsetX - 9) / 220) * 100;
    xPercentage = +xPercentage.toFixed(2);
    alphaPicker.style.left = xPercentage + '%';
    a = xPercentage / 100;
    colorChange();
  }

  function alphaDownTouch(event) {
    tracked = event.currentTarget;
    let rect = event.target.getBoundingClientRect();
    let offsetX = event.targetTouches[0].clientX - rect.left;
    let xPercentage = ((offsetX - 9) / 220) * 100;
    xPercentage = +xPercentage.toFixed(2);
    alphaPicker.style.left = xPercentage + '%';
    a = xPercentage / 100;
    colorChange();
  }

  //Math algorithms
  function hsvToRgb(h, s, v) {
    var r, g, b;

    var i = Math.floor(h * 6);
    var f = h * 6 - i;
    var p = v * (1 - s);
    var q = v * (1 - f * s);
    var t = v * (1 - (1 - f) * s);

    switch (i % 6) {
      case 0:
        (r = v), (g = t), (b = p);
        break;
      case 1:
        (r = q), (g = v), (b = p);
        break;
      case 2:
        (r = p), (g = v), (b = t);
        break;
      case 3:
        (r = p), (g = q), (b = v);
        break;
      case 4:
        (r = t), (g = p), (b = v);
        break;
      case 5:
        (r = v), (g = p), (b = q);
        break;
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  }

  function RGBAToHex() {
    let rHex = r.toString(16);
    let gHex = g.toString(16);
    let bHex = b.toString(16);

    if (rHex.length == 1) rHex = '0' + rHex;
    if (gHex.length == 1) gHex = '0' + gHex;
    if (bHex.length == 1) bHex = '0' + bHex;

    return ('#' + rHex + gHex + bHex).toUpperCase();
  }

  function rgbToHSV(r, g, b, update) {
    let rperc, gperc, bperc, max, min, diff, pr, hueNew, satNew, valNew;
    rperc = r / 255;
    gperc = g / 255;
    bperc = b / 255;
    max = Math.max(rperc, gperc, bperc);
    min = Math.min(rperc, gperc, bperc);
    diff = max - min;

    valNew = max;
    valNew == 0 ? (satNew = 0) : (satNew = diff / max);

    for (let i = 0; i < 3; i++) {
      if ([rperc, gperc, bperc][i] === max) {
        pr = i;
        break;
      }
    }
    if (diff == 0) {
      hueNew = 0;
      if (update) {
        h = hueNew;
        s = satNew;
        v = valNew;
        hueChange();
        return;
      } else {
        return { h: hueNew, s: satNew, v: valNew };
      }
    } else {
      switch (pr) {
        case 0:
          hueNew = (60 * (((gperc - bperc) / diff) % 6)) / 360;
          break;
        case 1:
          hueNew = (60 * ((bperc - rperc) / diff + 2)) / 360;
          break;
        case 2:
          hueNew = (60 * ((rperc - gperc) / diff + 4)) / 360;
          break;
      }
      if (hueNew < 0) hueNew += 6;
    }

    if (update) {
      h = hueNew;
      s = satNew;
      v = valNew;
      hueChange();
    } else {
      return { h: hueNew, s: satNew, v: valNew };
    }
  }
</script>

<div class="component-wrapper" class:fullWidth>
  <div class="main-container">
    <div class="colorsquare size" bind:this={colorSquare}>
      <div class="saturation-gradient">
        <div class="value-gradient">
          <div id="colorsquare-picker" bind:this={colorSquarePicker} />
          <div
            id="colorsquare-event"
            on:mousedown={csDown}
            on:touchstart={csDownTouch}
          />
        </div>
      </div>
    </div>

    <div class="hue-selector">
      <div id="hue-picker" bind:this={huePicker} />
      <div id="hue-event" on:mousedown={hueDown} on:touchstart={hueDownTouch} />
    </div>

    {#if showAlpha}
      <div class="alpha-selector">
        <div class="alpha-value" />
        <div id="alpha-picker" bind:this={alphaPicker} />
        <div
          id="alpha-event"
          on:mousedown={alphaDown}
          on:touchstart={alphaDownTouch}
        />
      </div>
    {/if}

    {#if showOutput}
      <div class="color-info-box">
        <div class="color-picked-bg">
          <div class="color-picked" bind:this={pickedColor} />
        </div>

        <div class="hex-text-block">
          <p class="text">{hexValue}</p>
        </div>

        <div class="rgb-text-div">
          <div class="rgb-text-block">
            <p class="text">{r}</p>
            <p class="text-label">R</p>
          </div>

          <div class="rgb-text-block">
            <p class="text">{g}</p>
            <p class="text-label">G</p>
          </div>

          <div class="rgb-text-block">
            <p class="text">{b}</p>
            <p class="text-label">B</p>
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>

<style lang="scss">
  @import './global.scss';

  .main-container {
    width: 240px;
  }

  .saturation-gradient {
    background: linear-gradient(
      to right,
      rgb(255, 255, 255),
      rgba(255, 255, 255, 0)
    );
    width: 240px;
    height: 160px;
  }

  .value-gradient {
    background: linear-gradient(to top, rgb(0, 0, 0), rgba(0, 0, 0, 0));
    overflow: hidden;
    width: 240px;
    height: 160px;
  }

  .hue-selector {
    background: linear-gradient(
      to right,
      #ff0000 0%,
      #ffff00 17%,
      #00ff00 33%,
      #00ffff 50%,
      #0000ff 67%,
      #ff00ff 83%,
      #ff0000 100%
    );
    margin: 15px 10px 10px 10px;
    border-radius: 10px;
    height: 10px;
  }

  #hue-picker {
    background: #fff;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    left: 0%;
    position: relative;
    cursor: default;
    transform: translate(-5px, -1px);
    -webkit-box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.67);
    -moz-box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.67);
    box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.67);
  }

  #hue-event {
    width: 236px;
    height: 14px;
    transform: translate(-8px, -14px);
    cursor: default;
    touch-action: none;
  }

  .alpha-selector {
    background-image: linear-gradient(45deg, #808080 25%, transparent 25%),
      linear-gradient(-45deg, #808080 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, #808080 75%),
      linear-gradient(-45deg, transparent 75%, #808080 75%);
    background-size: 10px 10px;
    background-position: 0 0, 0 5px, 5px -5px, -5px 0px;
    margin: 10px 10px;
    border-radius: 10px;
    height: 10px;
    position: relative;
  }

  // #alpha-picker {
  //   background: #fff;
  //   width: 12px;
  //   height: 12px;
  //   border-radius: 50%;
  //   left: 100%;
  //   position: relative;
  //   cursor: default;
  //   transform: translate(-5px, -11px);
  //   -webkit-box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.67);
  //   -moz-box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.67);
  //   box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.67);
  // }

  // #alpha-event {
  //   width: 236px;
  //   height: 14px;
  //   transform: translate(-8px, -24px);
  //   cursor: default;
  //   touch-action: none;
  // }

  // .alpha-value {
  //   background: linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1));
  //   width: 100%;
  //   height: 100%;
  //   border-radius: 10px;
  // }

  .colorsquare {
    background: rgb(255, 0, 0);
  }

  #colorsquare-picker {
    margin: 0;
    padding: 0;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: 2px solid #fffb;
    position: relative;
    transform: translate(-9px, -9px);
    left: 100%;
  }

  #colorsquare-event {
    width: 100%;
    height: 100%;
    position: relative;
    transform: translate(0, -16px);
    touch-action: none;
  }

  // .color-info-box {
  //   margin: 10px;
  //   width: 100%;
  //   height: 22px;
  //   vertical-align: middle;
  //   position: relative;
  // }

  // .color-picked {
  //   width: 18px;
  //   height: 18px;
  //   border-radius: 2px;
  //   background: rgba(255, 0, 0, 1);
  //   display: inline-block;
  // }

  // .color-picked-bg {
  //   background-image: linear-gradient(45deg, #808080 25%, transparent 25%),
  //     linear-gradient(-45deg, #808080 25%, transparent 25%),
  //     linear-gradient(45deg, transparent 75%, #808080 75%),
  //     linear-gradient(-45deg, transparent 75%, #808080 75%);
  //   background-size: 10px 10px;
  //   background-position: 0 0, 0 5px, 5px -5px, -5px 0px;
  //   border: 2px solid #fff;
  //   border-radius: 4px;
  //   width: 18px;
  //   height: 18px;
  //   color: #fff;
  //   display: inline-block;
  // }

  // .hex-text-block {
  //   display: inline-block;
  //   background: white;
  //   border-radius: 2px;
  //   padding: 2px;
  //   border: 1px solid #e3e3e3;
  //   height: 16px;
  //   width: 54px;
  //   vertical-align: top;
  //   text-align: center;
  // }

  // .rgb-text-block {
  //   display: inline-block;
  //   background: white;
  //   border-radius: 2px;
  //   padding: 2px;
  //   margin: 0 1px;
  //   border: 1px solid #dcdcdc;
  //   height: 16px;
  //   width: 23px;
  //   vertical-align: top;
  //   text-align: center;
  // }

  // .rgb-text-div {
  //   right: 10%;
  //   display: inline-block;
  //   vertical-align: top;
  //   position: absolute;
  // }

  // .text-label {
  //   position: relative;
  //   top: -12px;
  //   font-family: sans-serif;
  //   font-size: small;
  //   color: #888;
  // }

  // .text {
  //   display: inline;
  //   font-family: sans-serif;
  //   margin: 0;
  //   display: inline-block;
  //   font-size: 12px;
  //   font-size-adjust: 0.5;
  //   position: relative;
  //   top: -1px;
  //   vertical-align: middle;
  //   -webkit-touch-callout: all;
  //   -webkit-user-select: all;
  //   -khtml-user-select: all;
  //   -moz-user-select: all;
  //   -ms-user-select: all;
  //   user-select: all;
  // }

  .component-wrapper {
    width: fit-content;
    padding: 10px;
    padding-bottom: 6px;
  }
</style>
