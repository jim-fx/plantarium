import { cleanup, render } from '@testing-library/svelte';
/// <reference types="vitest" />

import { afterEach, describe, expect, it } from 'vitest';

import Vec3 from '../src/lib/InputVec3.svelte';

describe('InputVec3.svelte', () => {
  afterEach(() => cleanup());

  it('mounts', () => {
    const { container } = render(Vec3);
    expect(container).toBeTruthy();
  });

  it('Should render with the passed value', async () => {
    render(Vec3, { value: { x: 4, y: 2, z: 0 } });
  });
});
