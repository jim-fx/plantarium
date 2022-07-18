import type { TransferGeometry } from "@plantarium/types";

export default (s: number): TransferGeometry => {
  // Calculate distance from center to corners

  const maxLength = s * 3;

  //Final model
  const position = Float32Array.from([
    /*
    Indeces:
    5----6
    | 4--+-7
    0-|--1 |
      3----2
    */

    // Bottom plate
    +s,
    -s,
    -s,
    +s,
    -s,
    +s,
    -s,
    -s,
    +s,
    -s,
    -s,
    -s,

    // Top Plate
    -s,
    +s,
    -s,
    +s,
    +s,
    -s,
    +s,
    +s,
    +s,
    -s,
    +s,
    +s,
  ]);
  const normal = Float32Array.from([...position].map((v) => v / maxLength));
  const uv = Float32Array.from(new Array(24).fill(0.5));
  const index = Uint16Array.from([
    0, 1, 2, 0, 2, 3, 0, 3, 4, 4, 5, 0, 0, 1, 6, 0, 6, 5, 1, 2, 7, 1, 7, 6, 3,
    7, 2, 3, 7, 4, 4, 6, 7, 4, 6, 5,
  ]);

  return {
    position,
    normal,
    uv,
    index,
  };
};
