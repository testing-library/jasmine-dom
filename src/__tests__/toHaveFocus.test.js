import { render } from './helpers/renderer';
import document from './helpers/jsdom';
import { toHaveFocus } from '../toHaveFocus';

describe('.toHaveFocus', () => {
	const { compare, negativeCompare } = toHaveFocus();
	const { container } = render(`
    <div>
      <label for="focused">test</label>
      <input id="focused" type="text" />
      <button type="submit" id="unfocused">Not Focused</button>
    </div>
  `);

	const focused = container.querySelector('#focused');
	const unfocused = container.querySelector('#unfocused');

	it('positive test cases', () => {
		document.body.appendChild(container);
		focused.focus();

		expect(focused).toHaveFocus();
		expect(unfocused).not.toHaveFocus();
	});

	it('negative test cases', () => {
		const { message: negativeMessage, pass: negativePass } = negativeCompare(focused);
		const { message: positiveMessage, pass: positivePass } = compare(unfocused);

		expect(negativePass).toBeFalse();
		expect(negativeMessage).toMatch(/Expected.*not to have focus\./);

		expect(positivePass).toBeFalse();
		expect(positiveMessage).toMatch(/Expected the provided.*button.* element to have focus\./);
	});
});
