<script lang="ts">
  export let direction: 'vertical' | 'horizontal' = 'vertical';
</script>

<div
  class="wrapper"
  class:vertical={direction === 'vertical'}
  class:horizontal={direction === 'horizontal'}
>
  <slot />
</div>

<style>
  .wrapper {
    display: flex;
    border-radius: 5px;
    overflow: hidden;
    position: relative;
    flex-wrap: wrap;
    width: var(--width, fit-content);
  }

  .wrapper.vertical :global(button) {
    --width: 100%;
    width: 100%;
    position: relative;
  }

  .wrapper.horizontal :global(.component-wrapper) {
    display: flex;
  }

  .wrapper.vertical > :global(button:after),
  .wrapper.vertical > :global(div > button:after) {
    width: 100%;
    height: 1px;
    left: 0px;
    top: 0px;
  }

  .wrapper :global(*:first-child:after),
  .wrapper :global(*:first-child > div > button:after) {
    display: none;
  }

  .wrapper > :global(button),
  .wrapper > :global(div > button) {
    border-radius: 0px;
  }

  .wrapper > :global(button:after),
  .wrapper > :global(div > button:after) {
    content: '';
    position: absolute;
    height: 80%;
    top: 10%;
    left: -1px;
    width: 1px;
    background-color: white;
    opacity: 0.5;
  }
</style>
