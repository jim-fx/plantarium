import nodes from './nodes';

export function executeSkeletonNode(node, ctx: GeneratorContext) {
  if (node.type in nodes) {
    if (nodes[node.type].computeSkeleton) {
      return nodes[node.type].computeSkeleton(node.computedParameters, ctx);
    }
  }
  return node.computedParameters;
}

export function executeGeometryNode(node, ctx: GeneratorContext) {
  if (node.type in nodes && nodes[node.type].computeGeometry) {
    return nodes[node.type].computeGeometry(
      node.computedParameters,
      node.result,
      ctx,
    );
  }

  return node.computedParameters;
}

export function executeValueNode(node, ctx: GeneratorContext, alpha?: number) {
  if (node.type in nodes && nodes[node.type].computeValue) {
    return nodes[node.type].computeValue(node.computedParameters, ctx, alpha);
  }

  return node.computedParameters;
}
