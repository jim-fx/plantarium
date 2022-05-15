<script lang="ts">
  import ThemeStore from './ThemeStore';
  import generateCSSVariables from 'css-vars-from-json';
  import { onMount } from 'svelte';
  $: styles = generateCSSVariables($ThemeStore);

  let themeWrapper: HTMLStyleElement;
  $: if (styles) transition();

  let isAnimating = false;

  function transition() {
    if (isAnimating || !themeWrapper) return;
    isAnimating = true;
    themeWrapper.innerHTML = `* {transition: color 0.2s ease, background-color 0.2s ease, outline 0.2s ease !important;}`;
    setTimeout(() => {
      themeWrapper.innerHTML = `* {transition: color 0.2s ease, background-color 0.2s ease, outline 0.2s ease !important;} :root{${styles}}`;
      setTimeout(() => {
        themeWrapper.innerHTML = `:root{${styles}}`;
        isAnimating = false;
      }, 200);
    }, 1);
  }

  onMount(() => {
    themeWrapper.innerHTML = `:root{${styles}}`;
  });
</script>

<svelte:head>
  <style type="text/css" id="theme-css" bind:this={themeWrapper}></style>
</svelte:head>
