<script lang="ts">
  export let hover = false;
</script>

<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" class:hover>
  <path d="M17 47L23.6667 74H77.6667L81 47" />
  <path d="M49.8378 60V28M49.8378 28L37 41.617M49.8378 28L62 41.617" />
</svg>

<style>
  .hover:hover > path:nth-child(2) {
    animation: point 0.4s ease;
    transform: translateY(0px);
  }

  @keyframes point {
    0% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-10px);
    }
    70% {
      transform: translateY(-10px);
    }
    100% {
      transform: translateY(0px);
    }
  }
</style>
