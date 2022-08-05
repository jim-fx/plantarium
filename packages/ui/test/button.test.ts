import { cleanup, fireEvent, render, screen } from '@testing-library/svelte';
import { afterEach, describe, expect, test } from "vitest";

import Button from '../src/lib/Button.svelte';

describe('Hello.svelte', () => {

  afterEach(() => cleanup());

  test('It should render the passed text', () => {

    const name = 'Duuuude';

    const { container } = render(Button, { name });
    expect(container.innerHTML).toContain(name);
  });

  test('Should render with icon', async () => {
    const { container } = render(Button, { icon: 'cog' });

    expect(container.innerHTML).toContain('svg');
  });


  test('Should fire click event', async () => {

    render(Button);

    const btn = screen.getByRole('button')

    await fireEvent.click(btn)

  });

});
