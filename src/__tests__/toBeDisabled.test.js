import { render } from './helpers/renderer';
import { toBeDisabled } from '../toBeDisabled';

describe('.toBeDisabled()', () => {
	const { compare, negativeCompare } = toBeDisabled();
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

	it('positive compare', () => {
		const { message, pass } = compare(queryByTestId('anchor'));
		expect(pass).toBeFalse();
		expect(message).toMatch(/Expected the element.*to be disabled and it.*isn't disabled.*\./);

		expect(queryByTestId('button')).toBeDisabled();
		expect(queryByTestId('textarea')).toBeDisabled();
		expect(queryByTestId('input')).toBeDisabled();

		expect(queryByTestId('fieldset')).toBeDisabled();
		expect(queryByTestId('fieldset-child')).toBeDisabled();

		expect(queryByTestId('nested-button')).toBeDisabled();
		expect(queryByTestId('nested-select')).toBeDisabled();
		expect(queryByTestId('nested-optgroup')).toBeDisabled();
		expect(queryByTestId('nested-option')).toBeDisabled();
	});

	it('negative compare', () => {
		const { message, pass } = negativeCompare(queryByTestId('button'));
		expect(pass).toBeFalse();
		expect(message).toMatch(/Expected the element.*not to be disabled and it.*is disabled.*\./);

		expect(queryByTestId('div')).not.toBeDisabled();
		expect(queryByTestId('div-child')).not.toBeDisabled();

		expect(queryByTestId('nested-anchor')).not.toBeDisabled();
		expect(queryByTestId('anchor')).not.toBeDisabled();
	});
});

describe('.toBeDisabled() w/ fieldset>legend', () => {
	const { queryByTestId } = render(`
        <div>
          <fieldset disabled={true}>
            <button data-testid="inherited-element">x</button>
          </fieldset>
          <fieldset disabled={true}>
            <legend>
              <button data-testid="inside-legend-element">x</button>
            </legend>
          </fieldset>
          <fieldset disabled={true}>
            <legend>
              <div>
                <button data-testid="nested-inside-legend-element">x</button>
              </div>
            </legend>
          </fieldset>
          <fieldset disabled={true}>
            <div></div>
            <legend>
              <button data-testid="first-legend-element">x</button>
            </legend>
            <legend>
              <button data-testid="second-legend-element">x</button>
            </legend>
          </fieldset>
          <fieldset disabled={true}>
            <fieldset>
              <legend>
                <button data-testid="outer-fieldset-element">x</button>
              </legend>
            </fieldset>
          </fieldset>
        </div>
    `);

	it('positive compare', () => {
		expect(queryByTestId('inherited-element')).toBeDisabled();
		expect(queryByTestId('second-legend-element')).toBeDisabled();
		expect(queryByTestId('outer-fieldset-element')).toBeDisabled();
	});

	it('negative compare', () => {
		expect(queryByTestId('nested-inside-legend-element')).not.toBeDisabled();
		expect(queryByTestId('inside-legend-element')).not.toBeDisabled();
		expect(queryByTestId('first-legend-element')).not.toBeDisabled();
	});
});
