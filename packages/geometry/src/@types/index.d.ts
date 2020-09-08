/**
 * Result of the skeleton phase of the Generator
 */
interface SkeletonResult extends NodeResult {
  result: {
    skeletons?: Float32Array[];
  };
  parameters: {
    [key: string]: SkeletonResult | ParameterResult | boolean;
  };
}

/**
 * Result of the geometry phase of the Generator
 */
interface GeometryResult extends SkeletonResult {
  result: {
    skeletons?: Float32Array[];
    geometry?: TransferGeometry;
  };
  parameters: {
    [key: string]: GeometryResult | ParameterResult | boolean;
  };
}
