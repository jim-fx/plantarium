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
