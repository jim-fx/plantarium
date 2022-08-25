import { cleanup, render } from '@testing-library/svelte';
/// <reference types="vitest" />

import { screen } from '@testing-library/svelte';
import { afterEach, describe, expect, it } from 'vitest';

import Float from '../src/lib/InputFloat.svelte';

describe('InputFloat.svelte', () => {
  afterEach(() => cleanup());

  it('mounts', () => {
    const { container } = render(Float);
    expect(container).toBeTruthy();
  });

  it('Should render with the passed value', async () => {
    render(Float, { value: 0.66 });

    const input = (await screen.findByRole('spinbutton')) as HTMLInputElement;

    expect(+input.value).toEqual(0.66);
  });
});
