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
    LikeButton,
    InputShape,
    Section,
    AlertWrapper,
    InputTab,
    Form,
    InputEditable
  } from '$lib';
  import { Highlight } from 'svelte-highlight';
  import atomOneDark from 'svelte-highlight/styles/atom-one-dark';
  import { setTheme, ThemeProvider } from '@plantarium/theme';
  export const prerender = true;

  const searchItems = [
    { value: 'number', group: 'input' },
    { value: 'boolean', group: 'input' },
    { value: 'math' },
    { value: 'boolops' },
    ...new Array(10).fill(null).map((_, i) => {
      return { value: 'value' + i };
    })
  ];

  import * as _icons from '$lib/icons/index.js';
  import InputRange from '$lib/InputRange.svelte';
  import Gallery from '$lib/Gallery.svelte';
  import GalleryItem from '$lib/GalleryItem.svelte';
  import Message from '$lib/Message.svelte';
  import ButtonGroup from '$lib/ButtonGroup.svelte';
  let animateIcons = false;
  let activeIcon = false;
  let editableValue = 'Cheeckthis';
  const icons = Object.keys(_icons) as unknown as keyof typeof _icons;

  let formData = {};
  const formFields = {
    username: {
      type: 'username',
      label: 'Username',
      placeholder: 'Username',
      validators: [(s: string) => s.length < 3 && ['Username must be longer than 3 characters']]
    },
    password: {
      type: 'password',
      label: 'password',
      placeholder: 'Password',
      validators: [(s: string) => s.length < 8 && ['Password must be longer than 8 characters']]
    },
    submit: {
      type: 'submit',
      label: 'login'
    }
  };

  const handleThemeChange = (e: CustomEvent<string>) => setTheme(e.detail);
  const handleSearchInput = (e: CustomEvent<string>) => createToast('You selected ' + e.detail);
  const handleEditableChange = (e: CustomEvent<string>) => {
    editableValue = e.detail;
  };
</script>

<svelte:head>
  {@html atomOneDark}
</svelte:head>

<ThemeProvider />

<main>
  <section>
    <h3>Button</h3>
    <Button icon="cog" name="Projects" />
    <br />
    <Button name="Projects" />
    <br />
    <Button name="Primary" invert />
    <br />
    <LikeButton />
  </section>

  <section>
    <h3>ButtonGroup</h3>
    <i>Vertical:</i>
    <ButtonGroup>
      <Button icon="cog" name="Projects" />
      <Button name="Projects" />
      <Button name="Primary" />
    </ButtonGroup>

    <br />

    <i>Horizontal:</i>
    <ButtonGroup direction="horizontal">
      <Button icon="cog" name="Projects" />
      <Button name="Projects" />
      <Button name="Primary" />
    </ButtonGroup>
  </section>

  <section>
    <h3>Icon</h3>
    <InputCheckbox bind:value={animateIcons} label="Animated" />
    <InputCheckbox bind:value={activeIcon} label="Active" />
    <br />
    <div style="display:flex; max-width: 100%; flex-wrap: wrap;">
      {#each icons as icon (icon)}
        <div style="margin: 10px; display:grid; place-items:center">
          <Icon name={icon} --width="40px" active={activeIcon} animated={animateIcons} hover />
          <p>{icon}</p>
        </div>
      {/each}
    </div>
  </section>

  <section>
    <h3>Message</h3>
    <Message type="error" message={['Oh', 'No', 'Something went wrong']} />
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
    <h3>Form</h3>
    <Form title="Login" fields={formFields} bind:data={formData} />
    <br />
    <br />
    <pre><code>{JSON.stringify(formData, null, 2)}</code></pre>
  </section>

  <section>
    <h3>Tab</h3>
    <InputTab values={['dark', 'light', 'pinky']} on:change={handleThemeChange} />
  </section>

  <section>
    <h3>Integer</h3>
    <InputInteger />
    <br />
    <i>With min/max</i>
    <InputInteger min={0} max={100} />
  </section>

  <section>
    <h3>InputEditable</h3>
    <InputEditable value={editableValue} on:submit={handleEditableChange} />
    <p>
      Value: {editableValue}
    </p>
  </section>

  <section>
    <h3>Float</h3>
    <InputFloat />
  </section>

  <section>
    <h3>Range</h3>
    <InputRange />
  </section>

  <section class="deprecated">
    <h3>Slider</h3>
    <InputSlider />
  </section>

  <section>
    <h3>Select</h3>
    <InputSelect values={['test', 'one', 'two']} />
  </section>

  <section>
    <h3>Gallery</h3>
    <Gallery>
      <GalleryItem>
        <img src="https://cdn.lorem.space/images/movie/.cache/500x0/matrix-1999.jpg" alt="" />
      </GalleryItem>
      <GalleryItem>
        <img src="https://cdn.lorem.space/images/movie/.cache/500x0/max-max-2015.jpeg" alt="" />
      </GalleryItem>
      <GalleryItem>
        <img src="https://cdn.lorem.space/images/movie/.cache/500x0/wonder-woman-2.jpg" alt="" />
      </GalleryItem>
      <GalleryItem>
        <img src="https://cdn.lorem.space/images/movie/.cache/500x0/leon-1994.jpg" alt="" />
      </GalleryItem>
    </Gallery>
  </section>

  <section>
    <h3>Search</h3>
    <InputSearch values={searchItems} on:input={handleSearchInput} />
  </section>

  <section>
    <h3>Shape</h3>
    <InputShape />
  </section>

  <section>
    <h3>Toasts</h3>
    <Button name="Info Toast" on:click={() => createToast('Short informativ message')} />
    <br />
    <Button
      name="Success Toast"
      on:click={() => createToast('Short happy message', { type: 'success', timeout: 0 })}
    />
    <br />
    <Button
      name="Select Toast"
      on:click={async () => {
        const result = await createToast('Select one:', { values: ['A', 'B', 'C'] });
        createToast(`You selected: ${result}`);
      }}
    />
    <br />
    <Button
      name="Warning Toast"
      on:click={() => createToast('Warning Message', { type: 'warning' })}
    />
    <br />
    <Button
      name="Error Toast"
      on:click={() =>
        createToast(new Error('Something went wrong'), {
          values: ['Help', 'Me', 'Recover', 'This', 'Error']
        })}
    />
    <br />

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
    background-color: var(--background-color);
  }

  section {
    padding: 50px 0px;
    border-bottom: solid thin gray;
  }

  img {
    max-height: 30vh;
  }

  h3 {
    margin-top: 0px;
  }
  .deprecated {
    opacity: 0.8;
  }
  .deprecated > h3::after {
    width: fit-content;
    content: 'deprecated';
    font-weight: normal;
    background: rgba(255, 50, 50, 0.5);
    border-radius: 5px;
    padding: 5px 7px;
    font-size: 0.8em;
    margin-left: 10px;
  }
</style>
