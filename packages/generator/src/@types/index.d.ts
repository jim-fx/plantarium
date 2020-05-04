interface InstanceGeometry {
  position: Float32Array;
  normal: Float32Array;
  uv: Float32Array;
  index: Uint16Array;
  offset: Float32Array;
  rotation: Float32Array;
  scale: Float32Array;
}

interface TransferGeometry {
  position: Float32Array;
  normal: Float32Array;
  uv: Float32Array;
  index: Uint16Array | Uint32Array;

  skeleton?: Float32Array[];

  leaf?: InstanceGeometry;
}

interface Parameter {
  value: any;
  curve: any;
}

interface LeafGeometry {
  position: Float32Array;
  normal: Float32Array;
  uv: Float32Array;
  index: Uint16Array;
  offset: Float32Array;
  rotation: Float32Array;
  scale: Float32Array;
}
