import 'svelte/register';

export async function svelteTemplateEngine(
	filePath: string,
	options: any,
	next,
) {
	console.log('RENDER', filePath);
	const { default: Component } = await import(filePath);
	const { html, head: _head, css } = Component.render(options);
	let head = _head;
	if (css.code) {
		head = `${head}<style>${css.code}</style>`;
	}
	next(null, html.replace('%head%', head));
}
