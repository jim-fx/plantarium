
# svelte-custom-element

### A project template to build custom elements (web components) with [Svelte](https://svelte.technology). 

## Table of Contents
1. [Usage](#usage)
2. [About this template](#about-this-template)
3. [Gotchas](#gotchas)
4. [Demo (alert-box)](#demo)

## Usage

*Note that you will need to have [Node.js](https://nodejs.org) installed.*

To create a new project based on this template using [degit](https://github.com/Rich-Harris/degit):

```bash
npx degit gojutin/svelte-custom-element my-custom-element
cd my-custom-element
```

Install the dependencies:

```bash
cd my-custom-element
npm install
```

Then start your development server with [Rollup](https://rollupjs.org):

```bash
npm run dev
```

You can then view your site in your browser by visiting [localhost:5000](http://localhost:5000). 

## About this template

The Svelte compiler provides the option to compile to a custom element (web component). This allows you to use most of the niceties of Svelte to create your custom elements, which can be a nice alternative to the general class-based approach. 

This template is pre-configured with everything you need to start building a custom element out of the box, including [Jest](https://jestjs.io/) and [Svelte Testing Library](https://github.com/testing-library/svelte-testing-library) for testing your custom element.

*TODO: Add additional documentation about this test setup and how to test your custom elements.*

*Note: This template does not include any of the web component polyfills for broader support. It's typically best to leave that up to the consumer, so they were purposely left out.*

### The basic idea:

1. You create your custom element in the `App.svelte` file and use the `public/index.html` file to interact with your element. During development (`npm run dev`), live reloading will be enabled. This means that any changes made to your custom-element or the HTML will be immediately reflected in the browser.

2. Write tests for your custom element and ensure they are all passing.

3. Once your element is ready to ship, you run `npm run build` in the terminal, which will compile a minified, production-ready version of your custom element in the `public/bundle.js` file. The compiler will take care of creating the Shadow DOM, applying attributes/properties, and defining your custom element. 

You can then do whatever you want with the `bundle.js` file. Your custom element is completely self-contained and does not require any additional dependencies. This means that you can drop it in virtually any environment that supports HTML and JavaScript. 

This template is very much a work in progress. As I learn or discover best practices or better solutions around creating custom elements with Svelte, I will be sure to update the template to incorporate my findings. 

If you see any opportunities for improvement and would like to contribute, please feel free to create a PR.

## Gotchas

### `imports`
You cannot import regular Svelte components from other files unless you declare those component(s) as custom elements with the `<svelte:option tag="some-element>` tag. By declaring child components as custom elements, these elements are also publicly available to the consumer, which may not be your intention. They also share the same Shadow DOM as the parent component, which means there is no ability to set the Shadow DOM mode to "closed" for any child components. 

### `props`
Any props that your custom element accepts will automatically be transformed to element attributes at compile time. It is recommended to stick with lowercase attribute names as naming conventions like camelCase or PascalCase will not work in HTML.

Doesn't work in HTML
```html
<script>
  export let someValue = "Default Text"
</script>
```

Does work in HTML
```js
<script>
  export let somevalue = "Default Text"
</script>
```

### `events`
Custom events can be created in your Svelte component using the `CustomEvent` api. After defining a custom event, you can dispatch that event by calling `this.dispatchEvent(event)` in response to changes in your component. 

If you try to dispatch an event inside of an arrow function, you will get an error due to the lexical scoping of `this` in arrow functions. You can remedy this by simply converting your arrow function to a function expression or dispatching an event from a custom ref. 

Custom events cannot be dispatched in response to lifecycle methods. For instance, if you try to dispatch a custom event in your `onMount` lifecycle method, your event will not be dispatched. 

### `transitions`
Svelte's built-in transitions do not work with custom elements. You are pretty much on your own to create any animations that you would like your custom element to use.

### `bundle.js` 
You will most likely encounter errors if you try to use a non-production build of your custom element (`bundle.js` file) in another framework like React or Vue. This is due to the the development build containing mapping meta data, which causes an error with some bundlers. This can be resolved by running `npm run build` before using the file.

## Demo

This template includes a demo `alert-box` custom element.

`alert-box` is a closeable alert box similar to the alerts provided by Bootstrap. This element accepts various theme attributes (outlined below), as well as a `fixed` attribute, which prevents the alert-box from being closed. This custom element incorporates several concepts, including attribute definitions, custom events, and exposing styles via CSS variables.

You can see the `alert-box` custom element in action using a few different front end flavors with the following CodeSandbox demos:

[React Demo](https://codesandbox.io/s/03y4j4vl70)

[Vue Demo](https://codesandbox.io/s/r0m63y4q1m)

[HTML Demo](https://codesandbox.io/s/l3950z2zyq)

Here's a list of the attributes, events, and CSS variables that the `alert-box` custom element exposes:

### Attributes

`primary` | `success` | `warning` | `danger` | `dark` 

These attributes apply a background and text color style similar to the bootstrap alerts. 

*Note: You can also set your own colors. See CSS variables below.*

![svelte-custom-element](https://res.cloudinary.com/gojutin/image/upload/w_300/v1557713022/create-svelte-site/svelte-custom-element-alert-box.png "svelte-custom-element")

`fixed` 

This attribute hides the close (X) button, which prevents users from being able to close the alert-box.

Example:
```html
<alert-box primary fixed>Thanks for signing up!<alert-box>
```

### Slots

This custom element includes two slots: 

**The `default` slot**

The `alert-box` message content will be placed in this slot.

**The `close` slot**

 You can optionally override the default close (X) icon with your own markup in this slot. The `close` event is automatically bound to this slot. 

 Example:

 ```html
<alert-box>
  The alert-box content in the default slot.
  <small slot="close">Close</small>
</alert-box>
 ```

### Events
`close` 

This event is triggered on non-fixed alert-boxes when the close (X) icon is clicked. The event can be subscribed to with an event listener, which allows the end user to handle showing and hiding of the alert-box as the close (X) icon is clicked. By leaving the display logic to the consumer, they are given full control to implement animations and display logic that fits their needs.

Example:
```js
const alertBox = document.querySelector('alert-box');

alertBox.addEventListener("close", () => {
  alertBox.setAttribute('hidden', true)
})
```

*Note: If you are using your custom element in a framework like Vue or React, they take care of setting up the event listener for you.*

React:
```html
<alert-box onClose={doSomething}>Thanks for joining!</alert-box>
```

Vue:
```html
<alert-box @close={doSomething}>Thanks for joining!</alert-box>
```

### CSS Variables

You can use the following CSS variables to change the background color, text color, and width of the alert-box.

|variable | description|
|---|---|
|`--alert-box-bg`| Changes the background color.|
|`--alert-box-text` |Changes the text color.|
|`--alert-box-width`|Changes the width.|

```css
alert-box {
  --alert-box-bg: #333;
}

alert-box#some-id {
  --alert-box-bg: steelblue;
}
```
Have fun making your own custom elements with Svelte! 😀