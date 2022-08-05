import { cleanup, fireEvent, render, screen } from '@testing-library/svelte';
import { afterEach, describe, expect, it } from "vitest";
import InputInteger from '../src/lib/InputInteger.svelte';

const renderInput = (opts?: Record<string, unknown>) => render(InputInteger, opts);

describe("InputInteger.svelte", () => {
  afterEach(() => cleanup());


  it('Should render the default value', async () => {

    const value = 42;

    renderInput({ value });

    const input = (await screen.findByRole('spinbutton')) as HTMLInputElement;

    expect(+input.value).toEqual(value);
  });

  it('Increase in plus click', async () => {
    renderInput({ value: 41 });

    const input = (await screen.findByRole('spinbutton')) as HTMLInputElement;

    const increaseButton = screen.queryByText('+') as HTMLButtonElement;

    await fireEvent.click(increaseButton);

    expect(+input.value).toEqual(42);
  });

  it('Decrease on minus click', async () => {
    renderInput({ value: 43 });

    const input = (await screen.findByRole('spinbutton')) as HTMLInputElement;

    const decreaseButton = screen.queryByText('-') as HTMLButtonElement;

    await fireEvent.click(decreaseButton);

    expect(+input.value).toEqual(42);
  });
})
