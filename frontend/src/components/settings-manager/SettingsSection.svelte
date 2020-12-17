<script lang="ts">
  import { stateToComponent,Section } from '@plantarium/ui';
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
    delete c.type;

    return c;
  };
</script>

<style>
  .wrapper {
    margin-left: 20px;
    width: calc(100% - 20px);
    display: flex;
    justify-content:space-between;
    flex-wrap: wrap;

    margin-bottom: 5px;
    padding-bottom: 10px;
    margin-top: 5px;
    padding-top: 10px;

    border-bottom: solid thin #30303055;
  }

  h3{
    user-select: none;
    width: fit-content;
  }
</style>

<div class="wrapper">
  {#if template.options}

    <Section name={key}>

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

  </Section>
  {:else}
    <h3>{key}</h3>
    <svelte:component
      this={stateToComponent(template, value)}
      {value}
      {...templateToProps(template)}
      on:change={(ev) => sm.set(path, ev.detail)} />
  {/if}
</div>