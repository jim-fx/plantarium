<script lang="ts">
  import { Icon } from '@plantarium/ui';
</script>

<p>
  Hey there <span><Icon name="hand" --stroke={'#1a1a1a'} /></span>
</p>
<p>
  Welcome to <b>Plantarium</b>, a tool for creating parametrized, procedural 3D
  plants.
</p>

<style lang="scss">
  @keyframes wave {
    0% {
      transform: rotate(20deg) translateX(0);
    }

    10% {
      transform: rotate(-20deg) translateX(-5px) scale(1.2);
    }

    20% {
      transform: rotate(20deg) translateX(5px) scale(1.2);
    }

    30% {
      transform: rotate(20deg) translateX(0);
    }

    100% {
      transform: rotate(20deg) translateX(0);
    }
  }

  p {
    white-space: normal;
  }

  span {
    display: inline-block;
    transform: translateY(2px);
    width: 20px;
    :global(.icon-wrapper) {
      animation: wave 8s ease infinite;
    }
  }
</style>
