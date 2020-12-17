<script lang="ts">
  import { stateToComponent } from '@plantarium/ui';
  import type { SettingsManager } from '.';

  type SettingsTemplate = {
    [key: string]: ValueTemplate | { options: SettingsTemplate };
  };

  export let sm: SettingsManager;
  export let value: any;
  export let key: string;
  export let path: string = '';
  path = path + (path.length ? '.' : '') + key;
  export let template: SettingsTemplate;

  const templateToProps = (t: ValueTemplate) => {
    const c = { ...t };

    delete c.defaultValue;

    return c;
  };
</script>

<style>
  .wrapper {
    padding-left: 10px;
  }
</style>

<div class="wrapper">
  <h3>{key}</h3>

  {#if template.options}
    {#each Object.entries(value) as [_key, _value]}
      {#if _key in template.options}
        <svelte:self
          {sm}
          {path}
          value={_value}
          key={_key}
          template={template.options[_key]} />
      {:else}
        <p>error</p>
      {/if}
    {/each}
  {:else}
    <svelte:component
      this={stateToComponent(template, value)}
      {value}
      {...templateToProps(template)}
      on:change={(ev) => sm.set(path, ev.detail)} />
  {/if}
</div>
