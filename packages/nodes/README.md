# Extensible Node System à la Blender

[![pipeline](https://gitlab.com/jim-fx/plantarium-nodes/badges/master/pipeline.svg?style=flat-square)](https://gitlab.com/jim-fx/plantarium-nodes/)
[![coverage](https://gitlab.com/jim-fx/plantarium-nodes/badges/master/coverage.svg?style=flat-square)](https://gitlab.com/jim-fx/plantarium-nodes/)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@jim-fx/nodez?style=flat-square)](https://gitlab.com/jim-fx/plantarium-nodes/)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![npm version](https://img.shields.io/npm/v/@jim-fx/nodez?style=flat-square)](https://www.npmjs.com/package/@jim-fx/nodez)

<div align="center">

<img src="public/assets/ms-icon-310x310.png" width="30%"/>

  <h3 align="center">@jim-fx/nodez</h3>

  <p align="center">
    Extensible/Serializable visual NodeSystem Library à la Blender.
    <br />
    <br />
    <a href="https://jim-fx.gitlab.io/plantarium-nodes/">Demo</a>
     ·
    <a href="https://jim-fx.gitlab.io/plantarium-nodes/docs/">Docs</a>
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

## Getting Started

### Installation

#### NPM:

```sh
yarn add @jim-fx/nodez
```

#### CDN:

```html
<script src="https://unpkg.com/@jim-fx/nodez/dist/index.umd.js"></script>
```

## Usage

Import it as module:

```javascript
import { NodeSystem } from '@jim-fx/nodez';
```

Then use it like so:

```javascript
const system = new NodeSystem();
```

If you want to register your own node types:

```javascript
system.registerNodeType({
  name: 'subtract',
  inputs: ['number', 'number'],
  outputs: ['number'],
  // I strongly recommend to destructure and use defaults
  compute([input1 = 0, input2 = 0], state) {
    return input1 - input2;
  },
});
```

Saving and loading of systems

```javascript
// save the node system
const save = system.export();
// Download/Upload/stringify the save

// Load the node system
system.load(save);
```
