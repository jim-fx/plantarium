//For classes used in the model-generator;

interface TransferGeometry {
  position: Float32Array;
  normal: Float32Array;
  uv: Float32Array;
  index: Uint16Array | Uint32Array;
}
