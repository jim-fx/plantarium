require.config({
  paths: { vs: 'https://unpkg.com/monaco-editor@latest/min/vs' },
});

self.MonacoEnvironment = { getWorkerUrl: () => proxy };

let proxy = URL.createObjectURL(
  new Blob(
    [
      `
	self.MonacoEnvironment = {
		baseUrl: 'https://unpkg.com/monaco-editor@latest/min/'
	};
	importScripts('https://unpkg.com/monaco-editor@latest/min/vs/base/worker/workerMain.js');
`,
    ],
    { type: 'text/javascript' },
  ),
);

const importLine = `import * as g from "geometry";`;
const code =
  localStorage.getItem('code') ??
  `${importLine}
`;

const scene = {
  add: (f) => {
    console.log('SCENE:ADD', f);
  },
};

const cbs = [];
export function onValueChange(cb) {
  cbs.push(cb);
}

require(['vs/editor/editor.main'], async function () {
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

  let editor = monaco.editor.create(document.getElementById('container'), {
    language: 'typescript',
    theme: 'vs-dark',
    automaticLayout: true,
    folding: true,
    minimap: {
      enabled: false,
    },
    model: monaco.editor.createModel(
      code,
      'typescript',
      new monaco.Uri('dist'),
    ),
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

  editor.onDidChangeModelContent(function (e) {
    const value = editor.getValue();

    localStorage.setItem('code', value);

    cbs.forEach((cb) => cb(value.replace(importLine, '')));
  });
});
