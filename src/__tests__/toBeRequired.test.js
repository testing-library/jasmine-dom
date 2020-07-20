import { render } from './helpers/renderer';
import { toBeRequired } from '../toBeRequired';

describe('.toBeRequired', () => {
	const { compare, negativeCompare } = toBeRequired();

	it('positive test cases', () => {
		const { queryByTestId } = render(`
      <div>
        <input data-testid="required-input" required>
        <input data-testid="aria-required-input" aria-required="true">
        <input data-testid="conflicted-input" required aria-required="false">
        <input data-testid="not-required-input" aria-required="false">
        <input data-testid="basic-input">
        <input data-testid="unsupported-type" type="image" required>
        <select data-testid="select" required></select>
        <textarea data-testid="textarea" required></textarea>
        <div data-testid="supported-role" role="tree" required></div>
        <div data-testid="supported-role-aria" role="tree" aria-required="true"></div>
      </div>
    `);

		expect(queryByTestId('required-input')).toBeRequired();
		expect(queryByTestId('aria-required-input')).toBeRequired();
		expect(queryByTestId('conflicted-input')).toBeRequired();
		expect(queryByTestId('not-required-input')).not.toBeRequired();
		expect(queryByTestId('basic-input')).not.toBeRequired();
		expect(queryByTestId('unsupported-type')).not.toBeRequired();
		expect(queryByTestId('select')).toBeRequired();
		expect(queryByTestId('textarea')).toBeRequired();
		expect(queryByTestId('supported-role')).not.toBeRequired();
		expect(queryByTestId('supported-role-aria')).toBeRequired();
	});

	it('negative test cases', () => {
		const { queryByTestId } = render(`
      <div>
        <input data-testid="required-input" required>
        <input data-testid="aria-required-input" aria-required="true">
        <input data-testid="conflicted-input" required aria-required="false">
        <input data-testid="not-required-input" aria-required="false">
        <input data-testid="basic-input">
        <input data-testid="unsupported-type" type="image" required>
        <select data-testid="select" required></select>
        <textarea data-testid="textarea" required></textarea>
        <div data-testid="supported-role" role="tree" required></div>
        <div data-testid="supported-role-aria" role="tree" aria-required="true"></div>
      </div>
    `);

		const { message: requiredMessage, pass: requiredPass } = negativeCompare(queryByTestId('required-input'));
		const { message: ariaRequiredMessage, pass: ariaRequiredPass } = negativeCompare(
			queryByTestId('aria-required-input')
		);
		const { message: conflictedMessage, pass: conflictedPass } = negativeCompare(queryByTestId('conflicted-input'));
		const { message: notRequiredMessage, pass: notRequiredPass } = compare(queryByTestId('not-required-input'));
		const { message: basicInputMessage, pass: basicInputPass } = compare(queryByTestId('basic-input'));
		const { message: unsupportedMessage, pass: unsupportedPass } = compare(queryByTestId('unsupported-type'));
		const { message: selectMessage, pass: selectPass } = negativeCompare(queryByTestId('select'));
		const { message: textareaMessage, pass: textareaPass } = negativeCompare(queryByTestId('textarea'));
		const { message: supportedRoleMessage, pass: supportedRolePass } = compare(queryByTestId('supported-role'));
		const { message: ariaSupportedRoleMessage, pass: ariaSupportedRolePass } = negativeCompare(
			queryByTestId('supported-role-aria')
		);

		expect(requiredPass).toBeFalse();
		expect(requiredMessage).toMatch(/Expected.*not to be required.*is required/);

		expect(ariaRequiredPass).toBeFalse();
		expect(ariaRequiredMessage).toMatch(/Expected.*not to be required.*is required/);

		expect(conflictedPass).toBeFalse();
		expect(conflictedMessage).toMatch(/Expected.*not to be required.*is required/);

		expect(notRequiredPass).toBeFalse();
		expect(notRequiredMessage).toMatch(/Expected.*to be required.*isn't required/);

		expect(basicInputPass).toBeFalse();
		expect(basicInputMessage).toMatch(/Expected.*to be required.*isn't required/);

		expect(unsupportedPass).toBeFalse();
		expect(unsupportedMessage).toMatch(/Expected.*to be required.*isn't required/);

		expect(selectPass).toBeFalse();
		expect(selectMessage).toMatch(/Expected.*not to be required.*is required/);

		expect(textareaPass).toBeFalse();
		expect(textareaMessage).toMatch(/Expected.*not to be required.*is required/);

		expect(supportedRolePass).toBeFalse();
		expect(supportedRoleMessage).toMatch(/Expected.*to be required.*isn't required/);

		expect(ariaSupportedRolePass).toBeFalse();
		expect(ariaSupportedRoleMessage).toMatch(/Expected.*not to be required.*is required/);
	});
});
