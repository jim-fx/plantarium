interface InstanceGeometry {
  position: Float32Array;
  normal: Float32Array;
  uv: Float32Array;
  index: Uint16Array;
  offset: Float32Array;
  rotation: Float32Array;
  scale: Float32Array;
}

interface Vec3 {
  x: number;
  y: number;
  z: number;
}

interface PlantPart {
  type: string;
  result: {
    skeletons: Float32Array[];
    geometry?: TransferGeometry;
  };
  parameters: {
    [key: string]: any;
  };
}

type Parameter = {
  value: number | number[];
  variaton: number;
};

interface TransferGeometry {
  position: Float32Array;
  normal: Float32Array;
  uv: Float32Array;
  index: Uint16Array | Uint32Array;

  skeleton?: Float32Array[];

  leaf?: InstanceGeometry;
}
