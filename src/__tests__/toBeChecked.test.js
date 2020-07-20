import { render } from './helpers/renderer';
import { toBeChecked } from '../toBeChecked';

describe('.toBeChecked', () => {
	const { compare, negativeCompare } = toBeChecked();
	it('input type checkbox', () => {
		const { queryByTestId } = render(`
            <input type="checkbox" checked data-testid="checked-checkbox" />
            <input type="checkbox" data-testid="unchecked-checkbox" />
        `);
		expect(queryByTestId('checked-checkbox')).toBeChecked();
		expect(queryByTestId('unchecked-checkbox')).not.toBeChecked();
	});

	it('input type radio', () => {
		const { queryByTestId } = render(`
    <input type="radio" checked value="foo" data-testid="checked-radio" />
    <input type="radio" value="bar" data-testid="unchecked-radio" />
    `);
		expect(queryByTestId('checked-radio')).toBeChecked();
		expect(queryByTestId('unchecked-radio')).not.toBeChecked();
	});

	it('element w/ checkbox role', () => {
		const { queryByTestId } = render(`
    <div role="checkbox" aria-checked="true" data-testid="aria-checked-checkbox" />
    <div role="checkbox" aria-checked="false" data-testid="aria-unchecked-checkbox" />
    `);
		expect(queryByTestId('aria-checked-checkbox')).toBeChecked();
		expect(queryByTestId('aria-unchecked-checkbox')).not.toBeChecked();
	});

	it('element w/ radio role', () => {
		const { queryByTestId } = render(`
    <div role="radio" aria-checked="true" data-testid="aria-checked-radio" />
    <div role="radio" aria-checked="false" data-testid="aria-unchecked-radio" />
    `);
		expect(queryByTestId('aria-checked-radio')).toBeChecked();
		expect(queryByTestId('aria-unchecked-radio')).not.toBeChecked();
	});

	it('element w/ switch role', () => {
		const { queryByTestId } = render(`
    <div role="switch" aria-checked="true" data-testid="aria-checked-switch" />
    <div role="switch" aria-checked="false" data-testid="aria-unchecked-switch" />
    `);
		expect(queryByTestId('aria-checked-switch')).toBeChecked();
		expect(queryByTestId('aria-unchecked-switch')).not.toBeChecked();
	});

	xit('TO BE ADDED: element w/ menuitemcheckbox role', () => {
		const { queryByTestId } = render(`
      <div role="menuitemcheckbox" aria-checked="true" data-testid="checked-aria-menuitemcheckbox" />
      <div role="menuitemcheckbox" aria-checked="false" data-testid="unchecked-aria-menuitemcheckbox" />
    `);

		expect(queryByTestId('checked-aria-menuitemcheckbox')).toBeChecked();
		expect(queryByTestId('unchecked-aria-menuitemcheckbox')).not.toBeChecked();
	});

	it('throws when input type checkbox is checked but expected not to be', () => {
		const { queryByTestId } = render(`
    <input type="checkbox" checked data-testid="checked-input" />
    `);
		const { message, pass } = negativeCompare(queryByTestId('checked-input'));

		expect(pass).toBeFalse();
		expect(message).toMatch(/Expected the element.*not to be checked and it.*is checked.*\./);
	});

	it("throws when input type checkbox isn't checked but expected to be", () => {
		const { queryByTestId } = render(`
    <input type="checkbox" data-testid="unchecked-input" />
    `);
		const { message, pass } = compare(queryByTestId('unchecked-input'));

		expect(pass).toBeFalse();
		expect(message).toMatch(/Expected the element.*to be checked and it.*isn't checked.*\./);
	});

	it('throws when element w/ role checkbox is checked but expected not to be', () => {
		const { queryByTestId } = render(`
    <div role="checkbox" aria-checked="true" data-testid="checked-aria-checkbox" />
    `);
		const { message, pass } = negativeCompare(queryByTestId('checked-aria-checkbox'));

		expect(pass).toBeFalse();
		expect(message).toMatch(/Expected the element.*not to be checked and it.*is checked.*\./);
	});

	it("throws when element w/ role checkbox isn't checked but expected to be", () => {
		const { queryByTestId } = render(`
    <div role="checkbox" aria-checked="false" data-testid="checked-aria-checkbox" />
    `);
		const { message, pass } = compare(queryByTestId('checked-aria-checkbox'));

		expect(pass).toBeFalse();
		expect(message).toMatch(/Expected the element.*to be checked and it.*isn't checked.*\./);
	});

	it('throws when input type radio is checked but expected not to be', () => {
		const { queryByTestId } = render(`
      <input type="radio" checked data-testid="checked-radio-input" />
    `);
		const { message, pass } = negativeCompare(queryByTestId('checked-radio-input'));

		expect(pass).toBeFalse();
		expect(message).toMatch(/Expected the element.*not to be checked and it.*is checked.*\./);
	});

	it("throws when input type radio isn't checked but expected to be", () => {
		const { queryByTestId } = render(`
      <input type="radio" data-testid="unchecked-radio-input" />
    `);
		const { message, pass } = compare(queryByTestId('unchecked-radio-input'));

		expect(pass).toBeFalse();
		expect(message).toMatch(/Expected the element.*to be checked and it.*isn't checked.*\./);
	});

	it('throws when element w/ role radio is checked but expected not to be', () => {
		const { queryByTestId } = render(`
    <div role="radio" aria-checked="true" data-testid="checked-aria-radio" />
    `);
		const { message, pass } = negativeCompare(queryByTestId('checked-aria-radio'));

		expect(pass).toBeFalse();
		expect(message).toMatch(/Expected the element.*not to be checked and it.*is checked.*\./);
	});

	it("throws when element w/ role radio isn't checked but expected to be", () => {
		const { queryByTestId } = render(`
    <div role="radio" aria-checked="false" data-testid="checked-aria-radio" />
    `);
		const { message, pass } = compare(queryByTestId('checked-aria-radio'));

		expect(pass).toBeFalse();
		expect(message).toMatch(/Expected the element.*to be checked and it.*isn't checked.*\./);
	});

	it('throws when element w/ role switch is checked but expected not to be', () => {
		const { queryByTestId } = render(`
    <div role="switch" aria-checked="true" data-testid="checked-aria-switch" />
    `);
		const { message, pass } = negativeCompare(queryByTestId('checked-aria-switch'));

		expect(pass).toBeFalse();
		expect(message).toMatch(/Expected the element.*not to be checked and it.*is checked.*\./);
	});

	it("throws when element w/ role switch isn't checked but expected to be", () => {
		const { queryByTestId } = render(`
    <div role="switch" aria-checked="false" data-testid="checked-aria-switch" />
    `);
		const { message, pass } = compare(queryByTestId('checked-aria-switch'));

		expect(pass).toBeFalse();
		expect(message).toMatch(/Expected the element.*to be checked and it.*isn't checked.*\./);
	});

	it('throws when element w/ role checkbox has an invalid aria-checked attribute', () => {
		const { queryByTestId } = render(`
      <div role="checkbox" aria-checked="whatever" data-testid="invalid-aria-checkbox" />
    `);
		const { message, pass } = compare(queryByTestId('invalid-aria-checkbox'));

		expect(pass).toBeFalse();
		expect(message).toMatch(
			/Only inputs with type='checkbox\/radio' or elements with role='checkbox\/radio\/switch' and a valid aria-checked attribute can be used.*Use.*toHaveValue\(\).*instead/
		);
	});

	it('throws when element w/ role radio has an invalid aria-checked attribute', () => {
		const { queryByTestId } = render(`
      <div role="radio" aria-checked="whatever" data-testid="invalid-aria-radio" />
    `);
		const { message, pass } = compare(queryByTestId('invalid-aria-radio'));

		expect(pass).toBeFalse();
		expect(message).toMatch(
			/Only inputs with type='checkbox\/radio' or elements with role='checkbox\/radio\/switch' and a valid aria-checked attribute can be used.*Use.*toHaveValue\(\).*instead/
		);
	});

	it('throws when element w/ role switch has an invalid aria-checked attribute', () => {
		const { queryByTestId } = render(`
      <div role="switch" aria-checked="whatever" data-testid="invalid-aria-switch" />
    `);
		const { message, pass } = compare(queryByTestId('invalid-aria-switch'));

		expect(pass).toBeFalse();
		expect(message).toMatch(
			/Only inputs with type='checkbox\/radio' or elements with role='checkbox\/radio\/switch' and a valid aria-checked attribute can be used.*Use.*toHaveValue\(\).*instead/
		);
	});

	it('throws when element is not an input regardless of expecting it to be checked or not', () => {
		const { queryByTestId } = render(`
      <select data-testid="select"></select>
    `);
		const { message: positiveMessage, pass: positivePass } = compare(queryByTestId('select'));
		const { message: negativeMessage, pass: negativePass } = negativeCompare(queryByTestId('select'));

		expect(positivePass).toBeFalse();
		expect(positiveMessage).toMatch(
			/Only inputs with type='checkbox\/radio' or elements with role='checkbox\/radio\/switch' and a valid aria-checked attribute can be used.*Use.*toHaveValue\(\).*instead/
		);

		expect(negativePass).toBeFalse();
		expect(negativeMessage).toMatch(
			/Only inputs with type='checkbox\/radio' or elements with role='checkbox\/radio\/switch' and a valid aria-checked attribute can be used.*Use.*toHaveValue\(\).*instead/
		);
	});
});
