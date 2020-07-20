import { render } from './helpers/renderer';
import { toBePartiallyChecked } from '../toBePartiallyChecked';

describe('.toBePartiallyChecked', () => {
	const { compare, negativeCompare } = toBePartiallyChecked();

	it('input type checkbox w/ aria-checked', () => {
		const { queryByTestId } = render(`
      <input type="checkbox" aria-checked="mixed" data-testid="mixed-checkbox" />
      <input type="checkbox" checked data-testid="checked-checkbox" />
      <input type="checkbox" data-testid="unchecked-checkbox" />
    `);

		expect(queryByTestId('mixed-checkbox')).toBePartiallyChecked();
		expect(queryByTestId('checked-checkbox')).not.toBePartiallyChecked();
		expect(queryByTestId('unchecked-checkbox')).not.toBePartiallyChecked();
	});

	it('input type checkbox w/ indeterminate set to true', () => {
		const { queryByTestId } = render(`
      <input type="checkbox" data-testid="mixed-checkbox" />
      <input type="checkbox" checked data-testid="checked-checkbox" />
      <input type="checkbox" data-testid="unchecked-checkbox" />
    `);
		queryByTestId('mixed-checkbox').indeterminate = true;

		expect(queryByTestId('mixed-checkbox')).toBePartiallyChecked();
		expect(queryByTestId('checked-checkbox')).not.toBePartiallyChecked();
		expect(queryByTestId('unchecked-checkbox')).not.toBePartiallyChecked();
	});

	it('elements w/ checkbox role', () => {
		const { queryByTestId } = render(`
      <div role="checkbox" aria-checked="mixed" data-testid="aria-checkbox-mixed" />
      <div role="checkbox" aria-checked="true" data-testid="aria-checkbox-checked" />
      <div role="checkbox" aria-checked="false" data-testid="aria-checkbox-unchecked" />
    `);

		expect(queryByTestId('aria-checkbox-mixed')).toBePartiallyChecked();
		expect(queryByTestId('aria-checkbox-checked')).not.toBePartiallyChecked();
		expect(queryByTestId('aria-checkbox-unchecked')).not.toBePartiallyChecked();
	});

	it('throws when input type checkbox is mixed but expected not to be', () => {
		const { queryByTestId } = render(`
      <input type="checkbox" aria-checked="mixed" data-testid="mixed-checkbox" />
    `);
		const { message, pass } = negativeCompare(queryByTestId('mixed-checkbox'));

		expect(pass).toBeFalse();
		expect(message).toMatch(/Expected the element.*not to be partially checked, and it.*is partially checked.*\./);
	});

	it('throws when input type checkbox is indeterminate but expected not to be', () => {
		const { queryByTestId } = render(`
      <input type="checkbox" data-testid="mixed-checkbox" />
    `);
		queryByTestId('mixed-checkbox').indeterminate = true;
		const { message, pass } = negativeCompare(queryByTestId('mixed-checkbox'));

		expect(pass).toBeFalse();
		expect(message).toMatch(/Expected the element.*not to be partially checked, and it.*is partially checked.*\./);
	});

	it('throws when input type checkbox is not checked but expected to be', () => {
		const { queryByTestId } = render(`
      <input type="checkbox" data-testid="empty-checkbox" />
    `);
		const { message, pass } = compare(queryByTestId('empty-checkbox'));

		expect(pass).toBeFalse();
		expect(message).toMatch(/Expected the element.*to be partially checked, and it.*isn't partially checked.*\./);
	});

	it('throws when element with checkbox role is partially checked but expected not to be', () => {
		const { queryByTestId } = render(`
      <div role="checkbox" aria-checked="mixed" data-testid="mixed-aria-checkbox" />
    `);
		const { message, pass } = negativeCompare(queryByTestId('mixed-aria-checkbox'));

		expect(pass).toBeFalse();
		expect(message).toMatch(/Expected the element.*not to be partially checked, and it.*is partially checked.*\./);
	});

	it('throws when element with checkbox role is checked but expected to be partially checked', () => {
		const { queryByTestId } = render(`
      <div role="checkbox" aria-checked="true" data-testid="checked-aria-checkbox" />
    `);
		const { message, pass } = compare(queryByTestId('checked-aria-checkbox'));

		expect(pass).toBeFalse();
		expect(message).toMatch(/Expected the element.*to be partially checked, and it.*isn't partially checked.*\./);
	});

	it("throws when element with checkbox role isn't checked but expected to be partially checked", () => {
		const { queryByTestId } = render(`
      <div role="checkbox" aria-checked="false" data-testid="unchecked-aria-checkbox" />
    `);
		const { message, pass } = compare(queryByTestId('unchecked-aria-checkbox'));

		expect(pass).toBeFalse();
		expect(message).toMatch(/Expected the element.*to be partially checked, and it.*isn't partially checked.*\./);
	});

	it('throws when element with checkbox role has an invalid aria-checked attribute', () => {
		const { queryByTestId } = render(`
      <div role="checkbox" aria-checked="something" data-testid="invalid-aria-checkbox" />
    `);
		const { message, pass } = compare(queryByTestId('invalid-aria-checkbox'));

		expect(pass).toBeFalse();
		expect(message).toMatch(/Expected the element.*to be partially checked, and it.*isn't partially checked.*\./);
	});

	it('throws when the element is not a valid checkbox', () => {
		const { queryByTestId } = render(`
      <select data-testid="select"></select>
    `);
		const { message: positiveMessage, pass: positivePass } = compare(queryByTestId('select'));
		const { message: negativeMessage, pass: negativePass } = negativeCompare(queryByTestId('select'));

		expect(positivePass).toBeFalse();
		expect(positiveMessage).toMatch(
			/Only inputs with type="checkbox" or elements with role="checkbox" and a valid aria-checked attribute can be used with.*toBePartiallyChecked\(\).*Use.*toHaveValue\(\).*instead/
		);

		expect(negativePass).toBeFalse();
		expect(negativeMessage).toMatch(
			/Only inputs with type="checkbox" or elements with role="checkbox" and a valid aria-checked attribute can be used with.*toBePartiallyChecked\(\).*Use.*toHaveValue\(\).*instead/
		);
	});
});
