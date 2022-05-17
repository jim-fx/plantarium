# @Plantarium/Nodesystem

<div align="center">

<img src="static/favicon.svg" width="30%"/>

  <h3 align="center">@plantarium/nodesystem</h3>

  <p align="center">
    Extensible/Serializable visual NodeSystem Library à la Blender.
    <br />
    <br />
    <a href="https://jim-fx.com/plant/nodes/">Demo</a>
     ·
    <a href="https://jim-fx.com/plant/nodes/">Docs</a>
  </p>

</div>

## Table of Contents

- [About the Project](#about-the-project)
- [Getting Started](#getting-started)
  - [Installation](#installation)
- [Usage](#usage)
- [License](#license)

## About The Project

This project came out of another project where i needed a node interface.

## Installation

Without a package manager:

```html
<script type="module">
  import { Nodesystem } from 'https://cdn.skypack.dev/@plantarium/nodesystem';
</script>
```

With a package manager:

```shell
npm install @plantarium/nodesystem
yarn add @plantarium/nodesystem
pnpm add @plantarium/nodesystem
```

## Usage

Import it as module:

```javascript
import { NodeSystem } from '@plantarium/nodesystem';
```

Then use it like so:

```javascript
const system = new NodeSystem();
```

If you want to register your own node types:

```javascript
system.registerNodeType({
  title: 'Add',
  type: 'add',
  outputs: ['number'],
  parameters: {
    a: {
      type: 'number',
      value: 0,
    },
    b: {
      type: 'number',
      value: 0,
    },
  },
  compute({ a, b }: { a: number, b: number }) {
    return a + b;
  },
});
```

### All Options to register a NodeType:

```typescript
interface NodeTypeData {
  title: string;

  type: string;

  outputs: string | string[];

  meta?: {
    description?: string;
    tags?: string[];
  };

  parameters: {
    [key: string]: ValueTemplate;
  };

  compute(parameters: { [key: string]: unknown }): unknown;
}
```

### All options for a single parameter

```typescript
interface ValueTemplate {
  type: string;
  label?: boolean | string;
  value?: boolean | string | number;
  values?: string[];
  points?: Vec2[];
  isAccessible?: boolean;
  external?: boolean;
  internal?: boolean;
  inputType?: string;
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: number | string | boolean;
}
```

Saving and loading of systems

```javascript
// save the node system
const save = system.serialize();
// Download/Upload/stringify the save

// Load the node system
system.load(save);
```
