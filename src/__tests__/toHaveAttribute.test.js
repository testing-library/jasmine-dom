import { render } from './helpers/renderer';
import { toHaveAttribute } from '../toHaveAttribute';

describe('.toHaveAttribute', () => {
	const { compare, negativeCompare } = toHaveAttribute();
	const { queryByTestId } = render(`
    <button data-testid="button" type="submit" disabled>
      OK
    </button>
    <svg data-testid="svg-element" width="12"></svg>
  `);
	const button = queryByTestId('button');
	const svgElement = queryByTestId('svg-element');

	it('positive test cases', () => {
		expect(button).toHaveAttribute('disabled');
		expect(button).toHaveAttribute('type');
		expect(button).toHaveAttribute('type', 'submit');
		expect(button).not.toHaveAttribute('type', 'button');
		expect(button).not.toHaveAttribute('class');
		expect(button).not.toHaveAttribute('width');
		expect(svgElement).toHaveAttribute('width');
		expect(svgElement).toHaveAttribute('width', '12');
	});

	it('negative test cases', () => {
		const { message: buttonDisabledMessage, pass: buttonDisabledPass } = negativeCompare(button, 'disabled');
		const { message: buttonTypeMessage, pass: buttonTypePass } = negativeCompare(button, 'type');
		const { message: buttonClassMessage, pass: buttonClassPass } = compare(button, 'class');

		expect(buttonDisabledPass).toBeFalse();
		expect(buttonDisabledMessage).toMatch(/Expected the value.*not to be.*but received.*/);

		expect(buttonTypePass).toBeFalse();
		expect(buttonTypeMessage).toMatch(/Expected the value.*not to be.*but received.*/);

		expect(buttonClassPass).toBeFalse();
		expect(buttonClassMessage).toMatch(/Expected the value.*to be.*but received.*/);
	});
});
