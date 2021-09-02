import 'svelte/register';

export function svelteTemplateEngine(filePath: string, options: any, next) {
  const Component = require(filePath).default;
  let { html, head, css } = Component.render(options);
  if (css.code) {
    head = `${head}<style>${css.code}</style>`;
  }
  next(null, html.replace('%head%', head));
}
