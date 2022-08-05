<script lang="ts">
  export let vertical = false;
</script>

<div class="wrapper" class:vertical>
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

  .wrapper.vertical :global(.component-wrapper) {
    --width: 100%;
    width: 100%;
    position: relative;
  }

  .wrapper.vertical > :global(.component-wrapper:after),
  .wrapper.vertical > :global(div > .component-wrapper:after) {
    width: calc(100% - 8px);
    height: 1px;
    left: 4px;
    top: 0px;
  }

  .wrapper :global(*:first-child > .component-wrapper:after),
  .wrapper :global(*:first-child > div > .component-wrapper:after) {
    display: none;
  }

  .wrapper > :global(.component-wrapper button),
  .wrapper > :global(div > .component-wrapper button) {
    border-radius: 0px;
  }

  .wrapper > :global(.component-wrapper:after),
  .wrapper > :global(div > .component-wrapper:after) {
    content: '';
    position: absolute;
    height: 80%;
    top: 10%;
    width: 1px;
    background-color: white;
    opacity: 0.5;
  }
</style>
