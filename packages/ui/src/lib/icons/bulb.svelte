<script lang="ts">
  export let active = false;
</script>

<svg class:active viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g class="streaks">
    <path d="M19 28.5L11.5 23.5M35 14L29 4.5M61 10L63 -0.5M78 19.5L90.5 10M85 39.5L92 39" />
    <path d="M22.5 50L14.5 52.5" />
  </g>
  <path
    d="M42 88.5V80V63.5L32 55L26 39.5L32 24.5L46 15L67.5 19L78 30.5V51.5L65 66.5V76V88.5L59.5 94.5H46L42 88.5Z"
  />
  <path d="M51.5 69.5L49.5 58.5L43.5 51.5L60.5 50.5L59 57.5L58 71.5" />
  <path d="M55 25.5L64.5 28.5L69 38V44" />
  <path d="M42 74L64.5 83" />
  <path d="M42.5 82.5L63 91" />
  <path d="M42 70L67 71" />
</svg>

<style>
  .streaks {
    transform: scale(0.8);
    transform-origin: center center;
    opacity: 0;
    transition: transform 0.2s ease, opacity 0.2s ease;
  }

  .active {
    fill: white;
  }

  .active > .streaks {
    transform: scale(1);
    opacity: 1;
  }
</style>
