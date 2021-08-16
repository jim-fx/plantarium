export default (value): value is GeneratorContextNode => {
  return typeof value === 'object' && 'type' in value;
};
