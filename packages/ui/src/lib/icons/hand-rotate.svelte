<script lang="ts">
  export let animated = false;
</script>

<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" class:animated>
  <path
    d="M46.11 71.8599L28.0101 52.5825L25.4072 45.9585L30.1055 41.5471L34.1579 41.3695L45.1184 53.043L50.4574 48.0302L54.7927 48.7959L60.4521 43.4822L65.3908 44.8905L71.2201 40.8278L82.2801 49.1837L88.9249 62.8943L96.4186 79.4349L77.4117 97.2807L63.2043 90.0664L47.8481 86.5502L42.9832 79.2289L46.11 71.8599ZM46.11 71.8599L52.9477 79.1425M44.9173 52.8288L54.8722 63.4314M55.5153 48.9235L62.4536 56.3132M66.019 44.7037L72.555 51.665"
  />
  <path
    d="M33.8098 67.2625L21.9024 68.9092H11.2163L4.19397 67.2625M4.19397 67.2625L11.2163 61.1786M4.19397 67.2625L8.05929 76.2104M65.8681 36.3043L68.616 27.0827V13.909L67.3947 5.34615M67.3947 5.34615L59.5969 13.909M67.3947 5.34615L76.7761 11.3589"
  />
</svg>

<style>
  svg.animated {
    overflow: visible;
  }

  svg.animated > path:first-child {
    animation: wiggle 1.7s ease-in-out infinite alternate;
  }

  @keyframes wiggle {
    0% {
      transform: rotate(-5deg);
    }

    100% {
      transform: rotate(5deg);
    }
  }
</style>
