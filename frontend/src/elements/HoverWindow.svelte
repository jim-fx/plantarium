<script lang="ts">
  import { ThemeStore } from '@plantarium/theme';
  import Button from '@plantarium/ui/src/Button.svelte';
  import type { IconType } from '@plantarium/ui/src/Icon.svelte';
  import ClickOutside from 'svelte-click-outside';
  import type { SvelteComponentDev } from 'svelte/internal';

  export let name: string;
  export let right = false;
  export let icon: IconType;
  export let component: SvelteComponentDev;

  export let visible = false;
</script>

<ClickOutside on:clickoutside={() => (visible = false)}>
  <div class="icon-wrapper" class:active={visible}>
    <Button
      useActive
      {icon}
      {name}
      --bg="transparent"
      --text={$ThemeStore['text-color']}
      bind:active={visible}
    />

    <div class="wrapper" class:visible class:right>
      <svelte:component this={component} {visible} />
    </div>
  </div>
</ClickOutside>

<style lang="scss">
  @use '~@plantarium/theme/src/themes.module.scss';

  .icon-wrapper {
    position: relative;
  }

  .wrapper {
    position: absolute;
    width: fit-content;
    background-color: themes.$light-green;
    pointer-events: none;
    display: none;

    border-radius: 5px;
    padding: 10px;
    margin-top: -5px;

    overflow: auto;

    min-height: 100px;
    min-width: var(--min-width, unset);
    max-height: 70vh;
    max-width: 500px;
  }

  .wrapper.right {
    right: 0px;
  }

  .visible {
    display: block;
    pointer-events: all;
  }
</style>
