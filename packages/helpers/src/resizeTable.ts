export default function (table: HTMLTableElement, cb: (width: number) => any) {
  const row = table.getElementsByTagName('tr')[0];
  const cols: HTMLElement[] = Array.prototype.slice.call(row.children);
  if (!cols) return;

  table.style.overflow = 'hidden';

  const tableHeight = table.offsetHeight;

  for (let i = 0; i < cols.length - 1; i++) {
    const div = createDiv(tableHeight);
    div.style.transition = 'all 0.2s ease';
    cols[i].appendChild(div);
    cols[i].style.position = 'relative';
    setListeners(div);
  }

  function show(e: HTMLElement) {
    e.style.borderRight = '2px solid gray';
    e.style.opacity = '1';
  }

  function hide(e: HTMLElement) {
    e.style.borderRight = '';
    e.style.opacity = '0';
  }

  function setListeners(div: HTMLElement) {
    let pageX: number;
    let curCol: HTMLElement;
    let nxtCol: HTMLElement;
    let curColWidth: number;
    let nxtColWidth: number;
    let mouseDown: boolean;

    div.addEventListener('mousedown', (e) => {
      show(div);
      mouseDown = true;

      const element = e.target as HTMLElement;
      curCol = element.parentElement;
      nxtCol = curCol.nextElementSibling as HTMLElement;
      pageX = e.pageX;

      const padding = paddingDiff(curCol);

      curColWidth = curCol.offsetWidth - padding;
      if (nxtCol) nxtColWidth = nxtCol.offsetWidth - padding;
    });

    div.addEventListener('mouseover', () => show(div));

    div.addEventListener('mouseout', () => !mouseDown && hide(div));

    document.addEventListener('mousemove', (e) => {
      if (curCol && mouseDown) {
        const diffX = e.pageX - pageX;

        if (nxtCol) nxtCol.style.width = nxtColWidth - diffX + 'px';

        curCol.style.width = curColWidth + diffX + 'px';

        const { width } = curCol.getBoundingClientRect();

        cb(Math.floor(width));
      }
    });

    document.addEventListener('mouseup', () => {
      mouseDown = false;
      hide(div);
    });
  }

  function createDiv(height: number) {
    const div = document.createElement('div');
    div.style.top = '0';
    div.style.right = '0';
    div.style.width = '2px';
    div.style.position = 'absolute';
    div.style.cursor = 'col-resize';
    div.style.userSelect = 'none';
    div.style.height = height + 'px';
    return div;
  }

  function paddingDiff(col: HTMLElement) {
    if (getStyleVal(col, 'box-sizing') === 'border-box') {
      return 0;
    }

    const padLeft = getStyleVal(col, 'padding-left');
    const padRight = getStyleVal(col, 'padding-right');
    return parseInt(padLeft, 10) + parseInt(padRight, 10);
  }

  function getStyleVal(elm: HTMLElement, css: string) {
    return window.getComputedStyle(elm, null).getPropertyValue(css);
  }
}
