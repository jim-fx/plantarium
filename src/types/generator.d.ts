//For use in the model-generator;

interface TransferGeometry {
  position: Float32Array;
  normal: Float32Array;
  uv: Float32Array;
  index: Uint16Array | Uint32Array;

  skeleton?: Float32Array[];

  leaf?: {
    position: Float32Array;
    normal: Float32Array;
    uv: Float32Array;
    index: Uint16Array | Uint32Array;
    offset: Float32Array;
    rotation: Float32Array;
    scale: Float32Array;
  };
}
