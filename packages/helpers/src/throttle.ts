export default function throttle<T>(_func: T, wait: number): T {
  let context: (() => unknown) | null;
  let args: IArguments;
  let result: unknown;

  let timeout: number | null = null;
  let previous = 0;

  const func = _func as unknown as () => void;

  const later = () => {
    previous = 0;
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };

  const f = function(...args: unknown[]) {
    const now = Date.now();
    if (!previous) previous = now;
    const remaining = wait - (now - previous);
    //eslint-disable-next-line
    context = this;
    // eslint-disable-next-line prefer-rest-params
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout) {
      timeout = setTimeout(later, remaining) as unknown as number;
    }
    return result;
  };
  return f as unknown as T;
}
