import {
  ValueTemplate,
  ValueResult,
  NodeResult,
  GeneratorContext,
  ParameterResult,
  TransferGeometry,
} from '@plantarium/types';

interface GeometryResult extends NodeResult {
  result: {
    skeletons?: Float32Array[];
    geometry?: TransferGeometry;
  };
  parameters: {
    [key: string]: GeometryResult | ParameterResult | string;
  };
}

export interface PlantNode {
  name: string;
  type: string;

  outputs: string[];

  state: {
    [key: string]: ValueTemplate;
  };

  computeNode(parameters: { [key: string]: ValueResult }): NodeResult;
  computeSkeleton?(part: GeometryResult, ctx: GeneratorContext);
  computeGeometry?(part: GeometryResult, ctx: GeneratorContext);
}
