<script lang="ts">
  import { stateToComponent, Section } from '@plantarium/ui';
  import sectionOpen from './sectionOpen';
  import type { SettingsManager } from '.';

  type SettingsTemplate = {
    [key: string]: ValueTemplate | { options: SettingsTemplate };
  };

  export let sm: SettingsManager;
  export let value: unknown;
  export let key: string;
  export let path = '';
  path = path + (path.length ? '.' : '') + key;
  export let template: SettingsTemplate;
  // We need to cheat here because sveltes {if else}
  // does not work with typescript types
  let _template: ValueTemplate = template as unknown as ValueTemplate;

  const isOpen = sectionOpen();

  const templateToProps = (t: ValueTemplate) => {
    const c = { ...t };

    delete c.defaultValue;
    delete c.type;

    return c;
  };
</script>

<div class="wrapper">
  {#if template.options}
    <Section
      name={key}
      open={isOpen.get()}
      on:toggle={({ detail }) => isOpen.set(detail)}
    >
      {#each Object.entries(value) as [_key, _value]}
        {#if _key in template.options}
          <svelte:self
            {sm}
            {path}
            value={_value}
            key={_key}
            template={template.options[_key]}
          />
        {:else}
          <p>error</p>
        {/if}
      {/each}
    </Section>
  {:else}
    <h3>{key}</h3>

    <svelte:component
      this={stateToComponent(_template, value)}
      {value}
      {...templateToProps(_template)}
      on:change={(ev) => sm.set(path, ev.detail)}
    />
  {/if}
</div>

<style>
  .wrapper {
    margin-left: 20px;
    width: calc(100% - 20px);
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;

    margin-bottom: 5px;
    padding-bottom: 10px;
    margin-top: 5px;
    padding-top: 10px;

    border-bottom: solid thin #30303055;
  }

  h3 {
    user-select: none;
    width: fit-content;
  }
</style>
