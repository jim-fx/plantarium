import polka from 'polka';
import files from 'sirv';
import { get } from './helpers/env';

const app = polka();

app.use(files('../frontend/public', { dev: true }));

const PORT = get('PORT', 8080);

app.listen(PORT, () => {
  console.log('[SERVER] listening on port ' + PORT);
});
