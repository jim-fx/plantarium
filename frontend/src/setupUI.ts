import { version } from '../package.json';
import { resizeTable } from '@plantarium/helpers';

const table = document.querySelector('table');
// Save table width to localStorage
resizeTable(table, (width: number) =>
  localStorage.setItem('plantarium-ui-width', width + ''),
);

// Read table width from localstorage
if (localStorage.getItem('plantarium-ui-width')) {
  const tableCell = table.querySelector('td');
  tableCell.style.width = localStorage.getItem('plantarium-ui-width') + 'px';
}

document.getElementById('version').innerHTML = 'v' + version;
