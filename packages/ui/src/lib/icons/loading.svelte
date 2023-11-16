<script lang="ts">
  export let animated = false;
</script>

<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" class:animated>
  <path
    d="M72.5918 45.0101L79.2959 47.5865L85.2551 53.137L86 62.249L82.7374 70.3948L73.3575 74H27.2737L16.2626 70.3948L13 60.2125L16.2626 47.5865L21.1564 42.699L31.6224 41.3161M72.5918 45.0101L70.5028 34.9604L61.9385 27.6292L51.3352 26L41.1397 27.6292L34.602 34.9604L31.6224 41.3161M72.5918 45.0101L62.9082 42.699M31.6224 41.3161L30.8775 49.443"
  />
  <path
    id="circle"
    d="M47.3636 47L43 51.2857L43.7273 59.1429L50.2727 62L57.5455 59.8571L59 53.4286L57.5455 49.8571"
  />
</svg>

<style>
  ellipse {
    fill: red;
  }
  .animated > #circle {
    animation: rotate 1.5s infinite;
    animation-timing-function: linear;
    transform-origin: 51% 54%;
  }
  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
