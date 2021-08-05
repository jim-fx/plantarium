export default function Debounce(wait: number, immediate = false) {
  return function (
    target,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    let timeout;
    const originalMethod = descriptor.value;
    descriptor.value = function (...args) {
      const later = () => {
        timeout = null;
        if (!immediate) originalMethod.apply(this, args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) originalMethod.apply(this, args);
    };
    return descriptor;
  };
}
