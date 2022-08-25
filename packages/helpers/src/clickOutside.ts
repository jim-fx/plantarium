/** Dispatch event on click outside of node */
export function clickOutside(node: HTMLElement) {

  const handleClick = (event: MouseEvent & { target: HTMLElement }) => {
    if (node && !node.contains(event.target) && !event.defaultPrevented) {
      node.dispatchEvent(
        new CustomEvent('click_outside', { detail: node })
      )
    }
  }

  document.addEventListener('click', handleClick, true);

  return {
    destroy() {
      document.removeEventListener('click', handleClick, true);
    }
  }
}
