export default function throttle(func: (data: any) => any, wait: number) {
  let context: (() => any) | null;
  let args: any;
  let result: any;

  let timeout: number | null = null;
  let previous = 0;
  const later = () => {
    previous = 0;
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };

  return function () {
    const now = Date.now();
    if (!previous) previous = now;
    const remaining = wait - (now - previous);
    // @ts-ignore
    context = this;
    args = arguments;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        window.clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout) {
      timeout = window.setTimeout(later, remaining);
    }
    return result;
  };
}
