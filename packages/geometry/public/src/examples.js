export const split = `import * as g from "geometry";

let skelly = Float32Array.from(new Array(100).fill(null).map((_,i,a) => {
    const stepSize = 4/a.length;
    return [
        0,i*stepSize,0,(1-i/a.length)*0.2
    ]
}).flat())

let skellies = g.splitSkeleton(skelly, 0.4,4,.4)

for(const s of skellies){
    const tubed = g.tube(Float32Array.from(s),6);
    scene.add(tubed)
}`


export const leaf = `import * as g from "geometry";


const l = g.leaf([  {
    x: 0.9,
    y: 1,
    pinned: true,
  },
  {
    x: 0.62,
    y: 0.84,
    pinned: false,
  },
  {
    x: 0.54,
    y: 0.63,
    pinned: false,
  },
  {
    x: 0.38,
    y: 0.41,
    pinned: true,
  },
  {
    x: 0.44,
    y: 0.23,
    pinned: false,
  },
  {
    x: 0.64,
    y: 0.12,
    pinned: false,
  },
  {
    x: 0.9,
    y: 0,
    pinned: true,
  },
],{res:12,xCurvature:4,yCurvature:0})


scene.add(l)`


export const gravity = `import * as g from "geometry";

let skelly = Float32Array.from(new Array(10).fill(null).map((_,i,a) => {
    const stepSize = 4/a.length;
    return [
        0,i*stepSize,0,(1-i/a.length)*0.2
    ]
}).flat())

g.rotateSkeleton(skelly,[0,0,1],0.2);

skelly = g.gravitySkeleton(skelly,-2,false);

const tubed = g.tube(Float32Array.from(skelly),6);
scene.add(tubed)`
