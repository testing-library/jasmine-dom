import { render } from './helpers/renderer';
import { toBeEnabled } from '../toBeDisabled';

const { compare, negativeCompare } = toBeEnabled();

describe('.toBeEnabled()', () => {
	const { queryByTestId } = render(`
        <div>
          <button disabled={true} data-testid="button">Button</button>
          <textarea disabled={true} data-testid="textarea"></textarea>
          <input type="checkbox" disabled={true} data-testid="input" />
          <fieldset disabled={true} data-testid="fieldset">
            <button data-testid="fieldset-child">Fieldset child button</button>
          </fieldset>
          <div disabled={true} data-testid="div">
            <button data-testid="div-child">Div child button</button>
          </div>
          <fieldset disabled={true}>
            <div>
              <button data-testid="nested-button">Nested button</button>
              <select data-testid="nested-select">
                <optgroup data-testid="nested-optgroup">
                  <option data-testid="nested-option">Nested option</option>
                </optgroup>
              </select>
            </div>
            <a href="https://github.com/brrianalexis" data-testid="nested-anchor">Nested anchor</a>
          </fieldset>
          <a href="https://github.com/brrianalexis" disabled={true} data-testid="anchor">Anchor</a>
        </div>
    `);

	it('positive test cases', () => {
		expect(queryByTestId('div')).toBeEnabled();
		expect(queryByTestId('div-child')).toBeEnabled();
		expect(queryByTestId('button')).not.toBeEnabled();
	});

	it('negative test cases', () => {
		const { message: buttonMessage, pass: buttonPass } = compare(queryByTestId('button'));
		const { message: textareaMessage, pass: textareaPass } = compare(queryByTestId('textarea'));
		const { message: inputMessage, pass: inputPass } = compare(queryByTestId('input'));
		const { message: fieldsetMessage, pass: fieldsetPass } = compare(queryByTestId('fieldset'));
		const { message: fieldsetChildMessage, pass: fieldsetChildPass } = compare(queryByTestId('fieldset-child'));
		const { message: nestedButtonMessage, pass: nestedButtonPass } = compare(queryByTestId('nested-button'));
		const { message: nestedSelectMessage, pass: nestedSelectPass } = compare(queryByTestId('nested-select'));
		const { message: nestedOptGroupMessage, pass: nestedOptGroupPass } = compare(queryByTestId('nested-optgroup'));
		const { message: nestedOptionMessage, pass: nestedOptionPass } = compare(queryByTestId('nested-option'));
		const { message: anchorMessage, pass: anchorPass } = negativeCompare(queryByTestId('anchor'));
		const { message: nestedAnchorMessage, pass: nestedAnchorPass } = negativeCompare(queryByTestId('nested-anchor'));

		expect(buttonPass).toBeFalse();
		expect(buttonMessage).toMatch(/Expected the element.*to be enabled and it.*isn't enabled.*\./);

		expect(textareaPass).toBeFalse();
		expect(textareaMessage).toMatch(/Expected the element.*to be enabled and it.*isn't enabled.*\./);

		expect(inputPass).toBeFalse();
		expect(inputMessage).toMatch(/Expected the element.*to be enabled and it.*isn't enabled.*\./);

		expect(fieldsetPass).toBeFalse();
		expect(fieldsetMessage).toMatch(/Expected the element.*to be enabled and it.*isn't enabled.*\./);

		expect(fieldsetChildPass).toBeFalse();
		expect(fieldsetChildMessage).toMatch(/Expected the element.*to be enabled and it.*isn't enabled.*\./);

		expect(nestedButtonPass).toBeFalse();
		expect(nestedButtonMessage).toMatch(/Expected the element.*to be enabled and it.*isn't enabled.*\./);

		expect(nestedSelectPass).toBeFalse();
		expect(nestedSelectMessage).toMatch(/Expected the element.*to be enabled and it.*isn't enabled.*\./);

		expect(nestedOptGroupPass).toBeFalse();
		expect(nestedOptGroupMessage).toMatch(/Expected the element.*to be enabled and it.*isn't enabled.*\./);

		expect(nestedOptionPass).toBeFalse();
		expect(nestedOptionMessage).toMatch(/Expected the element.*to be enabled and it.*isn't enabled.*\./);

		expect(anchorPass).toBeFalse();
		expect(anchorMessage).toMatch(/Expected the element.*not to be enabled and it.*is enabled.*\./);

		expect(nestedAnchorPass).toBeFalse();
		expect(nestedAnchorMessage).toMatch(/Expected the element.*not to be enabled and it.*is enabled.*\./);
	});
});

describe('.toBeEnabled() w/ fieldset>legend', () => {
	const { queryByTestId } = render(`
        <div>
          <fieldset disabled={true}>
            <button data-testid="inherited">Fieldset button</button>
          </fieldset>
          <fieldset disabled={true}>
            <legend>
              <button data-testid="inside-legend">Legend button</button>
            </legend>
          </fieldset>
          <fieldset disabled={true}>
            <legend>
              <div>
                <button data-testid="nested-inside-legend">Nested legend button</button>
              </div>
            </legend>
          </fieldset>
          <fieldset disabled={true}>
            <div></div>
            <legend>
              <button data-testid="first-legend-child">First legend child button</button>
            </legend>
            <legend>
              <button data-testid="second-legend-child">Second legend child button</button>
            </legend>
          </fieldset>
          <fieldset disabled={true}>
            <fieldset>
              <legend>
                <button data-testid="outer-fieldset">Outer fieldset button</button>
              </legend>
            </fieldset>
          </fieldset>
        </div>
    `);

	it('positive test cases', () => {
		expect(queryByTestId('inside-legend')).toBeEnabled();
		expect(queryByTestId('nested-inside-legend')).toBeEnabled();
		expect(queryByTestId('first-legend-child')).toBeEnabled();
	});

	it('negative test cases', () => {
		const { message: inheritedMessage, pass: inheritedPass } = compare(queryByTestId('inherited'));
		const { message: secondChildMessage, pass: secondChildPass } = compare(queryByTestId('second-legend-child'));
		const { message: outerFieldsetMessage, pass: outerFieldsetPass } = compare(queryByTestId('outer-fieldset'));

		expect(inheritedPass).toBeFalse();
		expect(inheritedMessage).toMatch(/Expected the element.*to be enabled and it.*isn't enabled.*\./);

		expect(secondChildPass).toBeFalse();
		expect(secondChildMessage).toMatch(/Expected the element.*to be enabled and it.*isn't enabled.*\./);

		expect(outerFieldsetPass).toBeFalse();
		expect(outerFieldsetMessage).toMatch(/Expected the element.*to be enabled and it.*isn't enabled.*\./);
	});
});
