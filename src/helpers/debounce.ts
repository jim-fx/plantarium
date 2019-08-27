export default function debounce(func: Function, wait: number, immediate: boolean) {
  let timeout: ReturnType<typeof setTimeout> | null;
  return function() {
    var later = function() {
      timeout = null;
      if (!immediate) func();
    };
    var callNow = immediate && !timeout;
    clearTimeout(<ReturnType<typeof setTimeout>>timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func();
  };
}
