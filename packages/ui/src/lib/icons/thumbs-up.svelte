<script lang="ts">
  export let active = false;
</script>

<svg viewBox="0 0 100 100" class:active xmlns="http://www.w3.org/2000/svg">
  <path
    d="M76.25 71L76.25 79.5L68.5 84.5L17.5 83L16 57.5L17.5 36.9999L33 36.9999L46 22.5L50 5.5L56.5 5L60.5 8L60.5 20.5L53 36.9999L78.7258 35.5L82.5 41.5L80 47.5M76.25 71L80 66.5L79.5 59.5M76.25 71L66.25 71M79.5 59.5L83.5 53L80 47.5M79.5 59.5L67 59.5M80 47.5L70 47.5M32 78.5L32 41.5"
  />
</svg>

<style>
  svg {
    overflow: visible;
  }
  .active > path {
    animation: activate 0.7s forwards;
  }

  svg:hover > path {
    fill: rgba(255, 255, 255, 0.1);
  }

  @keyframes activate {
    0% {
      transform: rotate(0deg) translate(0%, 0%);
    }
    10% {
      transform: rotate(-5deg) translate(0%, 0%);
    }

    20% {
      transform: rotate(0deg) translate(3%, -3%);
    }

    60% {
      transform: rotate(5deg) translate(3%, 0%);
    }

    80% {
      transform: rotate(5deg) translate(3%, 0%);
    }

    100% {
      transform: rotate(0deg) translate(0%, 0%);
    }
  }
</style>
