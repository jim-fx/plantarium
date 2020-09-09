export default function debounce(
  func: () => unknown,
  wait: number,
  immediate: boolean,
) {
  let timeout: ReturnType<typeof setTimeout> | null;
  return () => {
    const later = () => {
      timeout = null;
      if (!immediate) func();
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func();
  };
}
