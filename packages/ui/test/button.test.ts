import Button from '../src/lib/Button.svelte';
import { cleanup, render } from '@testing-library/svelte';

test('It should render the passed text', () => {
	afterEach(() => cleanup());

	const name = 'Duuuude';

	const { container } = render(Button, { name });
	expect(container.innerHTML).toContain(name);
});

test('Should render with icon', async () => {
	const { container } = render(Button, { icon: 'cog' });

	expect(container.innerHTML).toContain('svg');
});
