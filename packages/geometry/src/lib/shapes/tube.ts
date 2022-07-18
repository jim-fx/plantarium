import type { TransferGeometry } from '@plantarium/types';
import { extrudePath } from '../helpers';

export default function(skeleton: Float32Array, resX = 8): TransferGeometry {
  return extrudePath(skeleton, resX);
}
