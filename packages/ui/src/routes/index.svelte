<script lang="ts">
  import {
    InputSelect,
    Button,
    Icon,
    ToastWrapper,
    InputCheckbox,
    InputColor,
    InputCurve,
    createToast,
    createAlert,
    InputInteger,
    InputFloat,
    InputSlider,
    InputSearch,
    InputShape,
    Section,
    AlertWrapper,
    InputTab
  } from '$lib';
  import { Highlight } from 'svelte-highlight';
  import atomOneDark from 'svelte-highlight/styles/atom-one-dark';

  const searchItems = [
    { value: 'number', group: 'input' },
    { value: 'boolean', group: 'input' },
    { value: 'math' },
    { value: 'boolops' },
    ...new Array(10).fill(null).map((_, i) => {
      return { value: 'value' + i };
    })
  ];
</script>

<svelte:head>
  {@html atomOneDark}
</svelte:head>

<main>
  <section>
    <h3>Button</h3>
    <Button icon="cog" name="Projects" />
  </section>
  <section>
    <h3>Tab</h3>
    <InputTab values={['one', 'two', 'three']} />
  </section>

  <section>
    <h3>Icon</h3>
    <table>
      <tr>
        <td>arrow</td>
        <td>
          <Icon name="arrow" />
        </td>
      </tr>
      <tr>
        <td>checkmark</td>
        <td>
          <Icon name="checkmark" />
        </td>
      </tr>
      <tr>
        <td>branch</td>
        <td>
          <Icon name="branch" />
        </td>
      </tr>
      <tr>
        <td>folder</td>
        <td>
          <Icon name="folder" />
        </td>
      </tr>
      <tr>
        <td>cog</td>
        <td>
          <Icon name="cog" />
        </td>
      </tr>
      <tr>
        <td>cross</td>
        <td>
          <Icon name="cross" />
        </td>
      </tr>
      <tr>
        <td>leaf</td>
        <td>
          <Icon name="leaf" />
        </td>
      </tr>
      <tr>
        <td>stem</td>
        <td>
          <Icon name="stem" />
        </td>
      </tr>
      <tr>
        <td>triangle</td>
        <td>
          <Icon name="triangle" />
        </td>
      </tr>
    </table>
  </section>

  <section>
    <h3>Checkbox</h3>
    <InputCheckbox />
    <br />
    <details>
      <summary>Code</summary>
      <Highlight code={`<InputCheckbox on:click={handleClick}/>`} />
    </details>
  </section>

  <section>
    <h3>Color</h3>
    <InputColor />
  </section>

  <section>
    <h3>Curve</h3>
    <InputCurve />
  </section>

  <section>
    <h3>Integer</h3>
    <InputInteger />
  </section>

  <section>
    <h3>Float</h3>
    <InputFloat />
  </section>

  <section>
    <h3>Slider</h3>
    <InputSlider />
  </section>

  <section>
    <h3>Select</h3>
    <InputSelect values={['test', 'one', 'two']} />
  </section>

  <section>
    <h3>Search</h3>
    <InputSearch
      values={searchItems}
      on:input={({ detail: value }) => createToast('You selected ' + value)}
    />
  </section>

  <section>
    <h3>Shape</h3>
    <InputShape />
  </section>

  <section style={`--text-color: white`}>
    <h3>Toasts</h3>
    <Button name="Info Toast" on:click={() => createToast('Short informativ message')} />
    <Button
      name="Success Toast"
      on:click={() => createToast('Short happy message', { type: 'success' })}
    />
    <Button
      name="Select Toast"
      on:click={async () => {
        const result = await createToast('Select one:', { values: ['A', 'B', 'C'] });
        createToast(`You selected: ${result}`);
      }}
    />
    <Button
      name="Warning Toast"
      on:click={() => createToast('Warning Message', { type: 'warning' })}
    />
    <Button
      name="Error Toast"
      on:click={() =>
        createToast(new Error('Something went wrong'), {
          values: ['Help', 'Me', 'Recover', 'This', 'Error']
        })}
    />

    <h3>Alerts</h3>
    <Button
      name="Alert"
      on:click={() =>
        createAlert('Something so important its worth interrupting the user for', {
          values: ['Help', 'Me', 'Recover', 'This', 'Error']
        })}
    />
  </section>

  <section>
    <h3>Section</h3>
    <Section name="TestSection">
      <h3>Test1</h3>
      <h3>Test2</h3>
      <h3>Test3</h3>
    </Section>
  </section>
</main>

<ToastWrapper />
<AlertWrapper />

<style>
  main {
    margin: 0 auto;
    max-width: 600px;
  }

  section {
    padding: 50px 0px;
    border-bottom: solid thin gray;
  }

  h3 {
    margin-top: 0px;
  }

  tr {
    border-bottom: solid thin gray;
  }

  tr > td:first-child {
    text-align: right;
  }

  tr > td:last-child {
    padding: 5px 10px;
  }
</style>
