import FileSaver from 'file-saver';

// Download
const download = (
  data: string,
  name: string,
  mimetype: string,
  extension: string,
) => {
  if (typeof data !== 'string') data = JSON.stringify(data);
  const blob = new Blob([data], { type: mimetype + ';charset=utf-8' });
  FileSaver.saveAs(blob, name + '.' + extension);
};

export const json = (data, name = 'default') => {
  download(JSON.stringify(data), name, 'application/json', 'json');
};

export const obj = (data, name = 'default') => {
  download(data, name, 'text/plain', 'obj');
};
