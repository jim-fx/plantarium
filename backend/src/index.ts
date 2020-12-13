import polka from 'polka';
import { createServer } from 'http';
import files from 'sirv';
import { get } from './helpers/env';

const app = polka();
const isProd = get('NODE_ENV', 'production') === 'production';

app.use(files('../frontend/public', { dev: true }));

app.get('/test', (req, res) => res.send('EYYY'));

const PORT = get('PORT', 8080);

//@ts-ignore
createServer(app.handler).listen(PORT, () => {
  console.log('[SERVER] listening on port ' + PORT);
});
