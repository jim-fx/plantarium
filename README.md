# plant-generator

![travis ci build status](https://api.travis-ci.com/jim-fx/plant-generator.svg?branch=master)

## Basic Idea

Through the interface the user defines the so called plantDescription, which is a JSON object with a certain structure. The plantDescription gets passed through a generator, which generates a 3D model which is then rendered.
The idea is to abstract the plantDescription, so you can generate lots of different plants from the same description.

## Why

I have always been fascinated by the way nature constructs plants. Also i like procedural modelling and programming interfaces.

## How?

So the idea is to seperate the application into horizontal and vertical layers. The horizontal layers are:

Importer --> Stem --> Branch --> Leaf --> Display --> IO --> Exporter

Each layer can modify the plantDescription and the passes it to the next layer

## Technology

Typescript, Scss, Babel, Rollup, and O-GL

## Screendesign:

![screendesign leaves](https://raw.githubusercontent.com/jim-fx/plant-generator/master/design/screendesign/leaves.jpg)

## Data flow inside the app:

![screendesign leaves](https://raw.githubusercontent.com/jim-fx/plant-generator/master/design/screendesign/data%20flow%20through%20stages.jpg)
