type Pojo = number | string | boolean | unknown[] | { [key: string]: Pojo };

export function diffObjects(alpha: Pojo, beta: Pojo) {
  if (alpha === undefined && undefined === beta) {
    return;
  }
  const type = Array.isArray(alpha) ? 'array' : typeof alpha;
  switch (type) {
    case 'string':
    case 'boolean':
    case 'number':
      if (alpha === beta) return;
      return beta;
    case 'array':
      const arrDiff = alpha.map((v, i) => {
        if (i in beta) return diffObjects(v, beta[i]);
        return beta[i];
      });
      if (!arrDiff.length || (arrDiff.length === 1 && !arrDiff[0])) return;
      return arrDiff;
    default:
      if (!alpha) return beta;
      const keys = Object.keys(alpha);
      const diff = {};
      let changed = false;
      keys.forEach((k) => {
        const _diff = diffObjects(alpha[k], beta[k]);
        if (_diff !== undefined) {
          changed = true;
          diff[k] = _diff;
        }
      });
      if (!changed) return;
      return diff;
  }
}

export function diffBoth(alpha: Pojo, beta: Pojo) {
  return [diffObjects(alpha, beta), diffObjects(beta, alpha)];
}

export function mergeObjects(alpha: Pojo, beta: Pojo) {
  const type = Array.isArray(alpha) ? 'array' : typeof alpha;

  switch (type) {
    case 'string':
    case 'boolean':
    case 'number':
      return beta;
    case 'array':
      return alpha.map((v, i) => {
        if (beta[i]) return mergeObjects(v, beta[i]);
        return v;
      });
    default:
      const keys = Object.keys(beta);
      //@ts-ignore
      const diff = { ...alpha };
      keys.forEach((k) => {
        diff[k] = mergeObjects(alpha[k], beta[k]);
      });
      return diff;
  }
}
