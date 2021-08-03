export default function Debounce(wait: number, immediate: boolean = false) {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    var timeout: any;
    var originalMethod = descriptor.value;
    descriptor.value = function () {
      var context = this;
      var args = arguments;
      var later = function () {
        timeout = null;
        if (!immediate) originalMethod.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) originalMethod.apply(context, args);
    };
    return descriptor;
  };
}
