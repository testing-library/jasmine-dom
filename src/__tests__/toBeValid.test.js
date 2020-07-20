import { JSDOM } from 'jsdom';
import { render } from './helpers/renderer';
import { toBeValid } from '../toBeInvalid';

function getDOMElement(htmlString, selector) {
	return new JSDOM(htmlString).window.document.querySelector(selector);
}

describe('.toBeValid', () => {
	const { compare, negativeCompare } = toBeValid();

	const invalidInputHtml = `<input required>`;
	const invalidInputNode = getDOMElement(invalidInputHtml, 'input');

	const invalidFormHtml = `<form>${invalidInputHtml}</form>`;
	const invalidFormNode = getDOMElement(invalidFormHtml, 'form');

	it('input', () => {
		const { queryByTestId } = render(`
      <div>
        <input data-testid="no-aria-invalid">
        <input data-testid="aria-invalid" aria-invalid>
        <input data-testid="aria-invalid-value" aria-invalid="true">
        <input data-testid="aria-invalid-false" aria-invalid="false">
      </div>
    `);
		const noAriaInvalid = queryByTestId('no-aria-invalid');
		const ariaInvalid = queryByTestId('aria-invalid');
		const ariaInvalidValue = queryByTestId('aria-invalid-value');
		const falseAriaInvalid = queryByTestId('aria-invalid-false');

		expect(noAriaInvalid).toBeValid();
		expect(ariaInvalid).not.toBeValid();
		expect(ariaInvalidValue).not.toBeValid();
		expect(falseAriaInvalid).toBeValid();
		expect(invalidInputNode).not.toBeValid();

		const { message: negativeNoAriaMessage, pass: negativeNoAriaPass } = negativeCompare(noAriaInvalid);
		const { message: positiveAriaInvalidMessage, pass: positiveAriaInvalidPass } = compare(ariaInvalid);
		const { message: positiveAriaValueMessage, pass: positiveAriaValuePass } = compare(ariaInvalidValue);
		const { message: negativeFalseAriaMessage, pass: negativeFalseAriaPass } = negativeCompare(falseAriaInvalid);

		expect(negativeNoAriaPass).toBeFalse();
		expect(negativeNoAriaMessage).toMatch(/Expected the element.*not to be valid.*is valid/);

		expect(positiveAriaInvalidPass).toBeFalse();
		expect(positiveAriaInvalidMessage).toMatch(/Expected the element.*to be valid.*isn't valid/);

		expect(positiveAriaValuePass).toBeFalse();
		expect(positiveAriaValueMessage).toMatch(/Expected the element.*to be valid.*isn't valid/);

		expect(negativeFalseAriaPass).toBeFalse();
		expect(negativeFalseAriaMessage).toMatch(/Expected the element.*not to be valid.*is valid/);
	});

	it('form', () => {
		const { queryByTestId } = render(`
			<form data-testid="valid">
				<input>
			</form>
		`);

		expect(queryByTestId('valid')).toBeValid();
		expect(invalidFormNode).not.toBeValid();

		const { message: negativeValidMessage, pass: negativeValidPass } = negativeCompare(queryByTestId('valid'));
		const { message: positiveInvalidMessage, pass: positiveInvalidPass } = compare(invalidFormNode);

		expect(negativeValidPass).toBeFalse();
		expect(negativeValidMessage).toMatch(/Expected.*not to be valid.*is valid.*\./);

		expect(positiveInvalidPass).toBeFalse();
		expect(positiveInvalidMessage).toMatch(/Expected.*to be valid.*isn't valid.*\./);
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
		const valid = queryByTestId('valid');
		const noAriaInvalid = queryByTestId('no-aria-invalid');
		const ariaInvalid = queryByTestId('aria-invalid');
		const ariaInvalidValue = queryByTestId('aria-invalid-value');
		const ariaInvalidFalse = queryByTestId('aria-invalid-false');

		expect(valid).toBeValid();
		expect(noAriaInvalid).toBeValid();
		expect(ariaInvalid).not.toBeValid();
		expect(ariaInvalidValue).not.toBeValid();
		expect(ariaInvalidFalse).toBeValid();

		const { message: negativeValidMessage, pass: negativeValidPass } = negativeCompare(valid);
		const { message: negativeNoAriaMessage, pass: negativeNoAriaPass } = negativeCompare(noAriaInvalid);
		const { message: positiveAriaInvalidMessage, pass: positiveAriaInvalidPass } = compare(ariaInvalid);
		const { message: positiveAriaValueMessage, pass: positiveAriaValuePass } = compare(ariaInvalidValue);
		const { message: negativeFalseAriaMessage, pass: negativeFalseAriaPass } = negativeCompare(ariaInvalidFalse);

		expect(negativeValidPass).toBeFalse();
		expect(negativeValidMessage).toMatch(/Expected.*not to be valid.*is valid.*\./);

		expect(negativeNoAriaPass).toBeFalse();
		expect(negativeNoAriaMessage).toMatch(/Expected.*not to be valid.*is valid.*\./);

		expect(positiveAriaInvalidPass).toBeFalse();
		expect(positiveAriaInvalidMessage).toMatch(/Expected.*to be valid.*isn't valid.*\./);

		expect(positiveAriaValuePass).toBeFalse();
		expect(positiveAriaValueMessage).toMatch(/Expected.*to be valid.*isn't valid.*\./);

		expect(negativeFalseAriaPass).toBeFalse();
		expect(negativeFalseAriaMessage).toMatch(/Expected.*not to be valid.*is valid.*\./);
	});
});
