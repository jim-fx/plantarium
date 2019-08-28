let activeElement: HTMLElement, callback: Function, value: string;

function setCursorPos(el) {
  el.focus();
  if (typeof window.getSelection != "undefined" && typeof document.createRange != "undefined") {
    var range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  } else if (typeof document.body.createTextRange != "undefined") {
    var textRange = document.body.createTextRange();
    textRange.moveToElementText(el);
    textRange.collapse(false);
    textRange.select();
  }
}

function stopEditing(ev) {
  if (ev.type === "blur" || ev.keyCode === 13) {
    if (activeElement.getAttribute("contenteditable")) {
      activeElement.removeAttribute("contenteditable");

      activeElement.removeEventListener("blur", ev => stopEditing(ev), false);
      activeElement.removeEventListener("keydown", ev => stopEditing(ev), false);

      if (value !== activeElement.innerText) callback(activeElement.innerText);
    }
  }
}

export default function(el: HTMLElement, cb: Function) {
  activeElement = el;
  callback = cb;
  value = el.innerText;

  el.setAttribute("contenteditable", "true");

  el.addEventListener("keydown", ev => stopEditing(ev), false);

  el.addEventListener("blur", ev => stopEditing(ev), false);

  setCursorPos(el);
}
