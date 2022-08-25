import { cleanup, render } from '@testing-library/svelte';
import 'vitest';

import { afterEach, describe, expect, it } from 'vitest';

import Select from '../src/lib/InputSelect.svelte';

describe('InputFloat.svelte', () => {
  afterEach(() => cleanup());

  it('mounts', () => {
    const { container } = render(Select);
    expect(container).toBeTruthy();
  });

  // it("Should render with the passed value", async () => {
  //   render(Select, { values: ["a", "b", "c", "d"], value: "b" })
  //
  //   // const input = (await screen.findByRole('spinbutton')) as HTMLInputElement;
  //
  //   // expect(+input.value).toEqual(0.66);
  // })
});
