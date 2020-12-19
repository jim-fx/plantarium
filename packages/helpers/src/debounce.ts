export default function debounce(
  func: (...args: unknown[]) => unknown,
  wait: number,
  immediate?: boolean,
) {
  let timeout: number;
  return (...args: unknown[]) => {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = window.setTimeout(later, wait);
    if (callNow) func(...args);
  };
}
