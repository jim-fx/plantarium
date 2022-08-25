let activeElement: HTMLElement;
let callback: (value: string) => unknown;
let value: string;

function setCursorPos(el: HTMLElement) {
  el.focus();
  if (
    typeof window.getSelection != 'undefined' &&
    typeof document.createRange != 'undefined'
  ) {
    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }
}

function stopEditing(ev: KeyboardEvent | FocusEvent) {
  if (ev.type === 'blur' || ev["key"] === "Enter") {
    if (activeElement.getAttribute('contenteditable')) {
      activeElement.removeAttribute('contenteditable');

      activeElement.removeEventListener('blur', (ev) => stopEditing(ev), false);
      activeElement.removeEventListener(
        'keydown',
        (ev) => stopEditing(ev),
        false,
      );

      if (value !== activeElement.innerText) callback(activeElement.innerText);
    }
  }
}

export default function(el: HTMLElement, cb: (value: string) => unknown) {
  activeElement = el;
  callback = cb;
  value = el.innerText;

  el.setAttribute('contenteditable', 'true');

  el.addEventListener('keydown', (ev) => stopEditing(ev), false);

  el.addEventListener('blur', (ev) => stopEditing(ev), false);

  setCursorPos(el);
}
