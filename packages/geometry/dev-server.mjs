import esbuild from 'esbuild';
import { createServer, request } from 'http';

const clients = [];

esbuild
  .build({
    entryPoints: ['./src/index.ts', "./src/ogl.ts"],
    bundle: true,
    sourcemap: true,
    format: 'esm',
    outdir: 'public/dist',
    banner: {
      js: 'window.onload = setTimeout(() => new EventSource("/esbuild").onmessage = () => location.reload(),1000);',
    },
    watch: {
      onRebuild(error, result) {
        clients.forEach((res) => res.write('data: update\n\n'));
        clients.length = 0;
        console.log(error ? error : '...');
      },
    },
  })
  .catch(() => process.exit(1));

esbuild.serve({ servedir: './public' }, {}).then(() => {
  createServer((req, res) => {
    const { url, method, headers } = req;
    if (req.url === '/esbuild')
      return clients.push(
        res.writeHead(200, {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
        }),
      );
    const path = ~url.split('/').pop().indexOf('.') ? url : `/index.html`; //for PWA with router
    req.pipe(
      request(
        { hostname: '0.0.0.0', port: 8000, path, method, headers },
        (prxRes) => {
          res.writeHead(prxRes.statusCode, prxRes.headers);
          prxRes.pipe(res, { end: true });
        },
      ),
      { end: true },
    );
  }).listen(8082);
});
