export default function debounce(
  func: () => unknown,
  wait: number,
  immediate: boolean,
) {
  let timeout: number;
  return () => {
    const later = () => {
      timeout = null;
      if (!immediate) func();
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = window.setTimeout(later, wait);
    if (callNow) func();
  };
}
