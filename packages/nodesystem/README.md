# @Plantarium/Nodesystem

<div align="center">

<img src="public/assets/ms-icon-310x310.png" width="30%"/>

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
      defaultValue: 0,
    },
    b: {
      type: 'number',
      defaultValue: 0,
    },
  },
  compute({ a, b }: { a: number, b: number }) {
    return a + b;
  },
});
```


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


Saving and loading of systems

```javascript
// save the node system
const save = system.serialize();
// Download/Upload/stringify the save

// Load the node system
system.load(save);
```