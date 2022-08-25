import { cleanup, render } from '@testing-library/svelte';
import { tick } from 'svelte';
/// <reference types="vitest" />

import { afterEach, describe, expect, it } from 'vitest';
import { createToast } from '../src/lib/toast/ToastStore';

import ToastWrapper from '../src/lib/toast/ToastWrapper.svelte';

describe('ToastWrapper.svelte', () => {
  afterEach(() => cleanup());

  it('mounts', () => {
    const { container } = render(ToastWrapper);
    expect(container).toBeTruthy();
  });

  it('Should render with the passed value', async () => {
    const { container } = render(ToastWrapper);
    createToast('testtest');
    await tick();

    expect(container.innerHTML).toContain('testtest');
  });
});
