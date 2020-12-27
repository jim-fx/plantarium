<script>
  export let padding = '10px';
  export let height = 'fit-content';
  export let width = 'fit-content';
</script>

<style lang="scss">
  .component-wrapper {
    position: relative;
    background-color: #4b4b4b;
    border-radius: 2px;
    user-select: none;
    transition: box-shadow 0.3s ease;
    box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0);
  }

  .component-wrapper:hover {
    box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.4);
  }
</style>

<svelte:options tag={'plant-component'} />

<div
  class="component-wrapper"
  style={`padding:${padding}; height: ${height}; width: ${width}`}>
  <slot />
</div>
