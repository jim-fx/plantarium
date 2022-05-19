# Plantarium

<div align="center">

<img src="frontend/static/favicon/favicon.svg" width="30%"/>

<a href="https://plant.jim-fx.com/"><h2 align="center">Plantarium</h2></a>

  <p align="center">
    Plantarium is a Tool for the procedural generation of 3D plants.
  </p>

</div>

# Table of contents

- [What is Plantarium](#what-is-plantarium)
- [Architecture](#architecture)
- [Developing](#developing)
- [Roadmap](#roadmap)

# What is Plantarium?

Plantarium is a web app that allows the user to procedurally define and generate 3D plant geometry.

# Architecture

See [Architecture.md](./ARCHITECTURE.md)

# Developing

### Install prerequisites:

- Node.js
- pnpm

### Install dependencies

```bash
$ pnpm i -r
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
- [x] ~~Bug Report Feature~~ [#26](https://git.jim-fx.com/max/plantarium/issues/26)
- [x] ~~Undo System~~ [#14](https://git.jim-fx.com/max/plantarium/issues/14)
- [x] ~~Preview Renders~~ [#21](https://git.jim-fx.com/max/plantarium/issues/21)
- [x] ~~Node Tutorial~~
- [x] ~~Add some more nodes~~
  - [x] ~~Shape Node~~ [#23](https://git.jim-fx.com/max/plantarium/issues/23)
  - [x] ~~Curve Node~~
  - [x] ~~Leaf Node~~ [#22](https://git.jim-fx.com/max/plantarium/issues/22)

### [1.1](https://git.jim-fx.com/max/plantarium/milestone/2)

---

- [x] ~~3D Model Exporter, obj, gltf, fbx? [#64](https://github.com/jim-fx/plantarium/issues/64)~~
  - [x] obj
  - [ ] gltf
  - [ ] fbx
- [ ] Fix Curve Node -> Maybe Profile Node?
- [ ] Tests and Coverage
- [ ] Add some more nodes
  - [ ] Rotate Around? -> Rotate Branch Around Stem, Leaf around Stem
  - [ ] Bend? ->  Sort of like rotate but with lerp
  - [x] Split Branch Node

## [1.2]()

## Fuuuture
- [ ] Digital Garden
Nicely visualize all the plants in a 3D garden scene, maybe let them be watered.

- [ ] Plant Encyclopedia
Online place to view all sorts of plants

- [ ] Blender Plugins
Let the user generate the models directly inside blender or unity, unreal, godot...
