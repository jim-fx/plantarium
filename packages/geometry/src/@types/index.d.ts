import { NodeResult, TransferGeometry } from '@plantarium/types';
/**
 * Result of the geometry phase of the Generator
 */
export interface GeometryResult extends NodeResult {
  result: {
    skeletons?: Float32Array[];
    geometry?: TransferGeometry;
  };
  parameters: {
    [key: string]: GeometryResult;
  };
}
