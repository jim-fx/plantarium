import {
  executeGeometryNode,
  executeSkeletonNode,
  executeValueNode,
} from './executeNode';
import isNode from './helpers/isNode';

export const walkSkeletonNode = (node, ctx: GeneratorContext) => {
  // Compute all the values for the parameters
  node.computedParameters = {};
  Object.entries(node.parameters).forEach(([parameterName, param]) => {
    if (isNode(param)) {
      node.computedParameters[parameterName] = walkSkeletonNode(param, ctx);
    } else {
      node.computedParameters[parameterName] = param;
    }
  });

  // Calculate the output of the node
  node.result = executeSkeletonNode(node, ctx);

  return node;
};

export const walkGeometryNode = (node, ctx) => {
  node.computedParameters = {};
  Object.entries(node.parameters).forEach(([key, value]) => {
    if (isNode(value)) {
      node.computedParameters[key] = walkGeometryNode(value, ctx);
    } else {
      node.computedParameters[key] = value;
    }
  });

  // We need to merge the result of the previous pass with this one
  node.result = { ...node.result, ...executeGeometryNode(node, ctx) };

  return node;
};

export const walkValueNode = (
  node: GeneratorContextNode,
  ctx: GeneratorContext,
  alpha?: number,
) => {
  // Compute all the values for the parameters
  node.computedParameters = node.computedParameters ?? {};

  Object.entries(node.parameters).forEach(([parameterName, param]) => {
    if (isNode(param)) {
      node.computedParameters[parameterName] = walkValueNode(param, ctx, alpha);
    } else {
      node.computedParameters[parameterName] = param;
    }
  });

  // Calculate the output of the node

  return executeValueNode(node, ctx, alpha);
};
