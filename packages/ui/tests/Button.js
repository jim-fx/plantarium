import 'inline-svg-register';
import { test } from 'uvu';
import * as assert from 'uvu/assert';
import Count from '../src/lib/Button.svelte';
import { render, reset, setup } from './setup/env';

test.before(setup);
test.before.each(reset);

test('should render with "5" by default', () => {
  const { container } = render(Count, { name: 'Duuuude' });
  assert.match(container.innerHTML, /Duuuude/);
});

test.run();
