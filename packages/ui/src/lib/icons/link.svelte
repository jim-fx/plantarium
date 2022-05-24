<script lang="ts">
  export let hover = false;
</script>

<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" class:hover>
  <path d="M49 32L33 33.0857L34.0183 70L70 68.9143V54" />
  <path
    id="arrow"
    d="M48.5 55L75.6343 27.0304M75.6343 27.0304L57.1306 27.477M75.6343 27.0304L74.8998 45.0625"
  />
</svg>

<style>
  .hover > #arrow {
    transition: transform 0.3s ease;
  }

  .hover:hover > #arrow {
    animation: scale 1s;
  }

  @keyframes scale {
    0% {
      transform: translate(0px, 0px);
    }
    40% {
      transform: translate(4px, -4px);
    }
    70% {
      transform: translate(4px, -4px);
    }
    100% {
      transform: translate(0px, 0px);
    }
  }
</style>
