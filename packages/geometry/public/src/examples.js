export const split = `import * as g from "geometry";

const mainSkeleton = new Array(100).fill(null).map((_,i,a) => {
    const stepSize = 4/a.length;
    return [
        0,i*stepSize,0,(1-i/a.length)*0.2
    ]
}).flat();

const tubed = g.tube(Float32Array.from(mainSkeleton),6);

scene.add(tubed)
`
