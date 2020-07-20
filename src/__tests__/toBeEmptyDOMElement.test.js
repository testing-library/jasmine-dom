import { render } from './helpers/renderer';
import { toBeEmptyDOMElement } from '../toBeEmptyDOMElement';

describe('.toBeEmptyDOMElement', () => {
	const { compare, negativeCompare } = toBeEmptyDOMElement();
	const { queryByTestId } = render(`
        <span data-testid="not-empty-span">
            <span data-testid="empty-span"></span>
            <svg data-testid="empty-svg"></svg>
        </span>
    `);
	const notAnElement = { whatever: 'clearly not an element' };

	it('positive compare', () => {
		expect(queryByTestId('empty-span')).toBeEmptyDOMElement();
		expect(queryByTestId('empty-svg')).toBeEmptyDOMElement();
	});

	it('negative compare', () => {
		expect(queryByTestId('not-empty-span')).not.toBeEmptyDOMElement();
	});

	it('negative test cases', () => {
		const { message: negativeMessage, pass: negativePass } = negativeCompare(queryByTestId('empty-span'));
		const { message: emptySVGMessage, pass: emptySVGPass } = negativeCompare(queryByTestId('empty-svg'));
		const { message: positiveMessage, pass: positivePass } = compare(queryByTestId('not-empty-span'));

		expect(negativePass).toBeFalse();
		expect(negativeMessage).toMatch(/Expected.*not to be an empty DOM element\./);
		expect(emptySVGPass).toBeFalse();
		expect(emptySVGMessage).toMatch(/Expected.*not to be an empty DOM element\./);

		expect(positivePass).toBeFalse();
		expect(positiveMessage).toMatch(/Expected.*to be an empty DOM element\./);

		expect(() => expect(notAnElement).toBeEmptyDOMElement()).toThrowError();
	});
});
