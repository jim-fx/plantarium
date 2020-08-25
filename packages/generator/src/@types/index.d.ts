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
  skeletons: Float32Array[];
  geometry?: TransferGeometry;
  parameters: any;
}

interface TransferGeometry {
  position: Float32Array;
  normal: Float32Array;
  uv: Float32Array;
  index: Uint16Array | Uint32Array;

  skeleton?: Float32Array[];

  leaf?: InstanceGeometry;
}

// interface BranchDescription extends PartDescription {
//   input: PlantPart;
//   amount: number;
//   lowestBranch: Parameter;
//   length: Parameter;
//   angle: Parameter;
//   rotation: Parameter;
//   diameter: Parameter;
//   offset: Parameter;
// }

// interface StemDescription extends PartDescription {
//   origin: Vec3;

//   amount: number;
//   diameter: Parameter;
//   height: Parameter;

//   originOffset: Parameter;
//   originAngle: Parameter;
//   originRotation: Parameter;
// }
