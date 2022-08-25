import { cleanup, render } from '@testing-library/svelte';
import 'vitest';

import { afterEach, describe, expect, it } from 'vitest';

import Vec2 from '../src/lib/InputVec2.svelte';

describe('InputVec2.svelte', () => {
  afterEach(() => cleanup());

  it('mounts', () => {
    const { container } = render(Vec2);
    expect(container).toBeTruthy();
  });

  it('Should render with the passed value', async () => {
    render(Vec2, { value: { x: 4, y: 2 } });
  });
});
