import InputInteger from '../src/lib/InputInteger.svelte';
import { fireEvent, cleanup, render, screen } from '@testing-library/svelte';

const renderInput = (opts?: Record<string, unknown>) => render(InputInteger, opts);

test('Should render the default value', async () => {
	afterEach(() => cleanup());

	const value = 42;

	renderInput({ value });

	const input = (await screen.findByRole('spinbutton')) as HTMLInputElement;

	expect(+input.value).toEqual(value);
});

test('Increase in plus click', async () => {
	renderInput({ value: 41 });

	const input = (await screen.findByRole('spinbutton')) as HTMLInputElement;

	const increaseButton = screen.queryByText('+') as HTMLButtonElement;

	await fireEvent.click(increaseButton);

	expect(+input.value).toEqual(42);
});

test('Decrease on minus click', async () => {
	renderInput({ value: 43 });

	const input = (await screen.findByRole('spinbutton')) as HTMLInputElement;

	const decreaseButton = screen.queryByText('-') as HTMLButtonElement;

	await fireEvent.click(decreaseButton);

	expect(+input.value).toEqual(42);
});
