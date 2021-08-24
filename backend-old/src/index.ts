import polka from 'polka';
import files from 'sirv';
import { get } from './helpers/env';

const app = polka();

if (process.env.NODE_ENV === 'development') {
  app.use(files('../frontend/dist', { dev: true }));
}

const PORT = get('PORT', 8083);

app.listen(PORT, () => {
  console.log('[SERVER] listening on port ' + PORT);
});
