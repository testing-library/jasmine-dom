import { JSDOM } from 'jsdom';
import { render } from './helpers/renderer';
import { toBeInvalid } from '../toBeInvalid';

function getDOMElement(htmlString, selector) {
	return new JSDOM(htmlString).window.document.querySelector(selector);
}

const invalidInputHTML = `<input required>`;
const invalidInputNode = getDOMElement(invalidInputHTML, 'input');

const invalidFormHTML = `<form>${invalidInputHTML}</form>`;
const invalidFormNode = getDOMElement(invalidFormHTML, 'form');

describe('.toBeInvalid', () => {
	const { compare, negativeCompare } = toBeInvalid();
	it('input', () => {
		const { queryByTestId } = render(`
            <div>
                <input data-testid="no-aria-invalid">
                <input data-testid="aria-invalid" aria-invalid>
                <input data-testid="aria-invalid-value" aria-invalid="true">
                <input data-testid="aria-invalid-false" aria-invalid="false">
            </div>
        `);

		expect(invalidInputNode).toBeInvalid();
		expect(queryByTestId('aria-invalid')).toBeInvalid();
		expect(queryByTestId('aria-invalid-value')).toBeInvalid();
		expect(queryByTestId('no-aria-invalid')).not.toBeInvalid();
		expect(queryByTestId('aria-invalid-false')).not.toBeInvalid();
	});

	it('form', () => {
		const { queryByTestId } = render(`
            <form data-testid="valid">
                <input>
            </form>
        `);

		expect(queryByTestId('valid')).not.toBeInvalid();
		expect(invalidFormNode).toBeInvalid();
	});

	it('other elements', () => {
		const { queryByTestId } = render(`
            <ol data-testid="valid">
                <li data-testid="no-aria-invalid" > </li>
                <li data-testid="aria-invalid" aria-invalid>  </li>
                <li data-testid="aria-invalid-value" aria-invalid="true">  </li>
                <li data-testid="aria-invalid-false" aria-invalid="false">  </li>
            </ol>
        `);

		expect(queryByTestId('aria-invalid')).toBeInvalid();
		expect(queryByTestId('aria-invalid-value')).toBeInvalid();
		expect(queryByTestId('valid')).not.toBeInvalid();
		expect(queryByTestId('no-aria-invalid')).not.toBeInvalid();
		expect(queryByTestId('aria-invalid-false')).not.toBeInvalid();
	});

	it('negative test cases', () => {
		const { queryByTestId } = render(`
      <div>
        <input data-testid="no-aria-invalid">
        <input data-testid="aria-invalid" aria-invalid>
        <input data-testid="aria-invalid-value" aria-invalid="true">
        <input data-testid="aria-invalid-false" aria-invalid="false">
      </div>
      `);
		const { message: positiveMessage, pass: positivePass } = compare(queryByTestId('no-aria-invalid'));
		const { message: negativeMessage, pass: negativePass } = negativeCompare(queryByTestId('aria-invalid'));

		expect(positivePass).toBeFalse();
		expect(positiveMessage).toMatch(/Expected the element.*input.*to be invalid, and it.*isn't invalid.*\./);
		expect(negativePass).toBeFalse();
		expect(negativeMessage).toMatch(/Expected the element.*input.*not to be invalid, and it.*is invalid.*\./);
	});
});
