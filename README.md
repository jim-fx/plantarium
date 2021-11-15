# Plantarium

<div align="center">

<img src="frontend/public/favicon/favicon.svg" width="30%"/>

<a href="https://jim-fx.com/plant/"><h2 align="center">Plantarium</h2></a>

  <p align="center">
    Plantarium is a Tool for the procedural generation of 3D plants.
  </p>

</div>

# Table of contents

- [What is Plantarium](#WhatisPlantarium?)
- [Architecture](#Architecture)
- [Developing](#Developing)
- [Contributing](#Contributing)
- [Roadmap](#Roadmap)

# What is Plantarium?

Plantarium is a web app that allows the user to procedurally define and generate 3D plant geometry.

# Architecture

See [Architecture.md](./ARCHITECTURE.md)

# Developing

### Install prerequesits:

- Node.js
- pnpm

### Install dependancies

```bash
$ pnpm i -r
```

### (Only for the Backend)
```bash
$ pnpm migrate -r
```

### Start the dev server

```bash
$ pnpm dev
```
# Roadmap

### 0.1

- [x] ~~Implement node base interface~~
- [x] ~~Implement Projects~~

### [1.0](https://git.jim-fx.com/max/plantarium/milestone/1)

---

- [x] ~~Theme Support~~ [#28](https://git.jim-fx.com/max/plantarium/issues/28)
- [x] ~~Move Generator to WebWorker~~ [#1](https://git.jim-fx.com/max/plantarium/issues/1)
- [x] ~~Tutorial Mode~~ [#27](https://git.jim-fx.com/max/plantarium/issues/27)
- [x] Bug Report Feature [#26](https://git.jim-fx.com/max/plantarium/issues/26)
- [ ] Undo System [#14](https://git.jim-fx.com/max/plantarium/issues/14)
- [x] Preview Renders [#21](https://git.jim-fx.com/max/plantarium/issues/21)
- [ ] Node Tutorial 
- [x] ~~Add some more nodes~~
  - [x] ~~Shape Node~~ [#23](https://git.jim-fx.com/max/plantarium/issues/23)
  - [x] ~~Curve Node~~
  - [x] ~~Leaf Node~~ [#22](https://git.jim-fx.com/max/plantarium/issues/22)

### [1.1](https://git.jim-fx.com/max/plantarium/milestone/2)

---

- [ ] Synchronize Projects with a Backend
- [ ] Add some more nodes
  - [ ] Split Branch Node
