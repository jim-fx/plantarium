import { cleanup, render } from '@testing-library/svelte';
import { afterEach, describe, expect, it } from 'vitest';

import Checkbox from '../src/lib/InputCheckbox.svelte';

describe('InputCheckbox.svelte', () => {
  afterEach(() => cleanup());

  it('mounts', () => {
    const { container } = render(Checkbox, { value: true });
    expect(container).toBeTruthy();
  });
});
