// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="monaco.d.ts"/>

import debounce from './debounce.js';

// var require = require ?? null;
require.config({
  paths: { vs: 'http://localhost:8000/monaco' },
});

self.MonacoEnvironment = { getWorkerUrl: () => proxy };

let proxy = URL.createObjectURL(
  new Blob(
    [
      `
	self.MonacoEnvironment = {
    baseUrl: 'http://localhost:8000/monaco'
	};
	importScripts('http://localhost:8000/monaco/workerMain.js');
`,
    ],
    { type: 'text/javascript' },
  ),
);

const importLine = `import * as g from "geometry";`;
let code = importLine + "\n";

if (window.location.hash.length > 5) {
  code = decodeURIComponent(
    escape(window.atob(window.location.hash.replace(/^#/, ''))),
  );

  if(code === importLine){
    code = code + "\n";
  }
}

const cbs = [];
export function onValueChange(cb) {
  cbs.push(cb);
}

/**
 *
 * @param {monaco} monaco
 */
async function initEditor(monaco) {
  const typeContent = await (await fetch('dist/bundle.d.ts')).text();

  monaco.languages.typescript.typescriptDefaults.addExtraLib(
    typeContent,
    'dist/index.d.ts',
  );
  monaco.languages.typescript.typescriptDefaults.addExtraLib(
    `namespace scene {
      declare function add(i :any) :void;
    }`,
    'scene.d.ts',
  );

  monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: true,
    noSyntaxValidation: false,
  });

  // compiler options
  monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
    target: monaco.languages.typescript.ScriptTarget.ESNext,
    allowNonTsExtensions: true,
    noLib: true,
  });

  const model = monaco.editor.createModel(
    code,
    'typescript',
    new monaco.Uri('dist'),
  );

  const editor = monaco.editor.create(document.getElementById('container'), {
    language: 'typescript',
    theme: 'vs-dark',
    automaticLayout: true,
    folding: true,
    minimap: {
      enabled: false,
    },
    model,
  });

  const readonlyRange = new monaco.Range(1, 0, 2, 0);
  editor.onKeyDown((e) => {
    const contains = editor
      .getSelections()
      .findIndex((range) => readonlyRange.intersectRanges(range));
    if (contains !== -1) {
      e.stopPropagation();
      e.preventDefault(); // for Ctrl+C, Ctrl+V
    }
  });

  const handleSave = debounce((value) => {
    window.location.hash = window.btoa(unescape(encodeURIComponent(value)));
    cbs.forEach((cb) => cb(value.replace(importLine, '')));
  }, 500);


  const handleChange = () => {
    const value = editor.getValue();
    if(value === importLine){ 
      editor.getModel().setValue(value+"\n")
    }
    handleSave(value);
  }

  model.onDidChangeContent(handleChange);

  {
    const value = editor.getValue();
    cbs.forEach((cb) => cb(value.replace(importLine, '')));
  }
}

require(['vs/editor/editor.main'], initEditor);
