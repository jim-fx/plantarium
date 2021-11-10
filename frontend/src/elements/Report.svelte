<script lang="ts">
  import { Button, InputCheckbox, Section } from '@plantarium/ui';
  import { onMount } from 'svelte';
  import { detect, api } from '../helpers';
  import MultiSelect from 'svelte-multiselect';
  import { getAvailableLabels } from '@plantarium/client-api';
  import { parseStackTrace } from '@plantarium/helpers';
  export let mode: 'feat' | 'bug' = 'bug';
  let info = detect();

  let title;
  let description;
  let includeBrowserInfo = false;
  export let error: Error;
  $: stackTrace = error && parseStackTrace(error.stack);
  let includeStacktrace = true;

  let submitPromise;
  function submit() {
    const data = {
      type:mode,
      title,
      description,
    };

    if (includeStacktrace) {
      data.stacktrace = stackTrace;
    }

    if (includeBrowserInfo) {
      data.browser = detect();
      data.browser.screen = {
        width: window.innerWidth,
        height: window.innerHeight,
        dpi: window.devicePixelRatio,
      };
    }

    submitPromise = api.submitReport(data);

  }

  onMount(async () => {
    if (stackTrace) {
      title = stackTrace.type + ': ' + stackTrace.title;
    }
  });
</script>

<section>
  <label for="title">Title</label>
  <input
    type="text"
    id="title"
    placeholder="Simple Title"
    on:keydown|stopPropagation
    bind:value={title}
  />
</section>

<section>
  <label for="description">Description</label>
  <textarea
    type="text"
    id="description"
    rowspan="5"
    on:keydown|stopPropagation
    bind:value={description}
    placeholder={mode === 'bug'
      ? 'Please provide a detailed description of what happened.'
      : 'Please describe the feature.'}
  />
</section>

{#if mode === 'bug'}
  {#if stackTrace}
    <section>
      <div style="display:flex; align-items: center">
        <InputCheckbox bind:value={includeStacktrace} />
        <p style="margin-left: 5px;">Include StackTrace</p>
      </div>

      <Section name="What is that?">
        <pre><code>{error.stack}</code></pre>
      </Section>
    </section>
  {/if}

  <section>
    <div style="display:flex; align-items: center">
      <InputCheckbox bind:value={includeBrowserInfo} />
      <p style="margin-left: 5px;">Include Browser Info</p>
    </div>

    <Section name="What is that?">
      <p>
        This information makes it easier for a developer to track down what
        might have caused the bug.
      </p>
      <ul>
        <li>OS <i>({info.os})</i></li>
        <li>Browser <i>({info.name} / {info.version})</i></li>
        <li>
          Screen Resolution <i>({window.innerWidth}x{window.innerHeight})</i>
        </li>
        <li>
          Screen DPI <i>({window.devicePixelRatio})</i>
        </li>
      </ul>
    </Section>
  </section>
{/if}

<Button --bg="white" --text-color="#303030" name="Submit" on:click={submit} />

<style>
  section {
    margin: 1em 0px;
  }

  label {
    font-size: 1em;
    color: white;
  }

  textarea,
  input[type='text'] {
    color: white;
    font-size: 0.8em;
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 5px;
    border: solid 2px rgba(255, 255, 255, 0.8);
    width: 100% !important;
    min-width: 100%;
    padding: 10px;
  }

  section :global(.multiselect) {
    margin: 0px;
  }

  section :global(.multiselect > svg) {
    display: none !important;
  }
  section :global(.multiselect > svg > path),
  section :global(.multiselect > button > svg > path),
  section :global(.multiselect ul > li > button > svg > path) {
    stroke: none !important;
    fill: white;
  }

  section :global(.multiselect .options) {
    background: #e26565;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
  }

  section :global(.multiselect .options > .selected) {
    border-color: white;
  }
</style>
