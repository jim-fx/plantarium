type Pojo = Record<string, any>;

export function diffObjects(alpha: Pojo, beta: Pojo) {
  if (alpha === undefined && undefined === beta) {
    return;
  }
  const type = Array.isArray(alpha) ? 'array' : typeof alpha;

  if (type === 'string' || type === 'boolean' || type === 'number') {
    if (alpha === beta) return;
    return beta;
  }

  if (Array.isArray(alpha)) {
    const arrDiff = alpha.map((v, i) => {
      if (typeof beta === 'object' && i in beta) return diffObjects(v, beta[i]);
      return beta[i];
    });
    if (!arrDiff.length || (arrDiff.length === 1 && !arrDiff[0])) return;
    return arrDiff;
  }

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

export function diffBoth(alpha: Pojo, beta: Pojo) {
  return [diffObjects(alpha, beta), diffObjects(beta, alpha)];
}

export function mergeObjects(alpha: Pojo, beta: Pojo) {
  const type = typeof alpha;

  if (type === 'string' || type === 'boolean' || type === 'number') {
    return beta;
  }

  if (Array.isArray(alpha)) {
    return alpha.map((v, i) => {
      if (beta[i]) return mergeObjects(v, beta[i]);
      return v;
    });
  }

  if (typeof alpha === 'object') {
    const keys = Object.keys(beta);
    const diff = { ...alpha };
    keys.forEach((k) => {
      diff[k] = mergeObjects(alpha[k], beta[k]);
    });
    return diff;
  }
}
