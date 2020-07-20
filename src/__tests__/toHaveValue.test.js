import { render } from './helpers/renderer';
import { toHaveValue } from '../toHaveValue';

describe('.toHaveValue', () => {
	const { compare, negativeCompare } = toHaveValue();
	it('handles text input', () => {
		const { queryByTestId } = render(`
      <input type="text" value="foo" data-testid="text" />
      <input type="text" value=""  data-testid="empty" />
      <input type="text" data-testid="without" />
    `);
		const text = queryByTestId('text');
		const empty = queryByTestId('empty');
		const noValue = queryByTestId('without');

		expect(text).toHaveValue('foo');
		expect(text).toHaveValue();
		expect(text).not.toHaveValue('bar');
		expect(text).not.toHaveValue('');

		expect(empty).toHaveValue('');
		expect(empty).not.toHaveValue('foo');
		expect(empty).not.toHaveValue();

		expect(noValue).toHaveValue('');
		expect(noValue).not.toHaveValue();
		expect(noValue).not.toHaveValue('foo');
		noValue.value = 'bar';
		expect(noValue).toHaveValue('bar');
	});

	it('handles number input', () => {
		const { queryByTestId } = render(`
      <input type="number" value="5" data-testid="number" />
      <input type="number" value=""  data-testid="empty" />
      <input type="number" data-testid="without" />
    `);
		const number = queryByTestId('number');
		const empty = queryByTestId('empty');
		const noValue = queryByTestId('without');

		expect(number).toHaveValue(5);
		expect(number).toHaveValue();
		expect(number).not.toHaveValue(4);
		expect(number).not.toHaveValue('5');

		expect(empty).toHaveValue(null);
		expect(empty).not.toHaveValue('5');
		expect(empty).not.toHaveValue();

		expect(noValue).toHaveValue(null);
		expect(noValue).not.toHaveValue();
		expect(noValue).not.toHaveValue('10');
		noValue.value = 10;
		expect(noValue).toHaveValue(10);

		const { message: positiveMessage, pass: positivePass } = compare(number, '5');
		const { message: negativeMessage, pass: negativePass } = negativeCompare(number);

		expect(positivePass).toBeFalse();
		expect(positiveMessage).toMatch(/Expected the provided.*input.*to have value.*5 \(string\).*\./);

		expect(negativePass).toBeFalse();
		expect(negativeMessage).toMatch(/Expected the provided.*input.*not to have value.*\(any\).*\./);
	});

	it('handles select element', () => {
		const { queryByTestId } = render(`
      <select data-testid="single">
        <option value="first">First Value</option>
        <option value="second" selected>Second Value</option>
        <option value="third">Third Value</option>
      </select>
      
      <select data-testid="multiple" multiple>
        <option value="first">First Value</option>
        <option value="second" selected>Second Value</option>
        <option value="third" selected>Third Value</option>
      </select>
      
      <select data-testid="not-selected" >
        <option value="" disabled selected>- Select some value - </option>
        <option value="first">First Value</option>
        <option value="second">Second Value</option>
        <option value="third">Third Value</option>
      </select>
    `);
		const single = queryByTestId('single');
		const multiple = queryByTestId('multiple');
		const notSelected = queryByTestId('not-selected');

		expect(single).toHaveValue('second');
		expect(single).toHaveValue();

		expect(multiple).toHaveValue(['second', 'third']);
		expect(multiple).toHaveValue();

		expect(notSelected).not.toHaveValue();
		expect(notSelected).toHaveValue('');

		single.children[0].setAttribute('selected', true);
		expect(single).toHaveValue('first');
	});

	it('handles textarea element', () => {
		const { queryByTestId } = render(`
      <textarea data-testid="textarea">text value</textarea>
    `);
		expect(queryByTestId('textarea')).toHaveValue('text value');
	});

	it('throws when passed checkbox or radio inputs', () => {
		const { queryByTestId } = render(`
      <input data-testid="checkbox" type="checkbox" name="checkbox" value="val" checked />
      <input data-testid="radio" type="radio" name="radio" value="val" checked />
    `);
		let errorMsg;

		try {
			expect(queryByTestId('checkbox')).toHaveValue('');
		} catch (error) {
			errorMsg = error.message;
		}
		expect(errorMsg).toMatch(
			/input elements with.*type="checkbox\/radio".*cannot be used with.*\.toHaveValue\(\).*\. Use.*\.toBeChecked\(\).*for type="checkbox" or.*\.toHaveFormValues\(\).*instead\./
		);

		try {
			expect(queryByTestId('radio')).not.toHaveValue('');
		} catch (error) {
			errorMsg = error.message;
		}
		expect(errorMsg).toMatch(
			/input elements with.*type="checkbox\/radio".*cannot be used with.*\.toHaveValue\(\).*\. Use.*\.toBeChecked\(\).*for type="checkbox" or.*\.toHaveFormValues\(\).*instead\./
		);
	});

	it('throws when the expected input value does not match', () => {
		const { queryByTestId } = render(`
      <input data-testid="one" value="foo" />
    `);
		const { message, pass } = compare(queryByTestId('one'), 'whatever');

		expect(pass).toBeFalse();
		expect(message).toMatch(/Expected the provided.*input.*to have value.*whatever.*/);
	});

	it('throws with type information when the expected text input value has loose equality with the received value', () => {
		const { queryByTestId } = render(`
      <input data-testid="one" value="8" />
      <input data-testid="two" />
    `);
		const { message: noValueMessage, pass: noValuePass } = compare(queryByTestId('two'));
		const { message: positiveMessage, pass: positivePass } = compare(queryByTestId('one'), 8);
		const { message: negativeMessage, pass: negativePass } = negativeCompare(queryByTestId('one'), '8');

		expect(noValuePass).toBeFalse();
		expect(noValueMessage).toMatch(/Expected the provided.*input.*to have value.*\(any\).*\./);

		expect(positivePass).toBeFalse();
		expect(positiveMessage).toMatch(/Expected the provided.*input.*to have value.*8 \(number\).*\./);

		expect(negativePass).toBeFalse();
		expect(negativeMessage).toMatch(/Expected the provided.*input.*not to have value.*8.*\./);
	});
});
