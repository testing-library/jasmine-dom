import { render } from './helpers/renderer';
import { toHaveTextContent } from '../toHaveTextContent';

describe('.toHaveTextContent', () => {
	const { compare, negativeCompare } = toHaveTextContent();

	it('positive test cases', () => {
		const { queryByTestId } = render(`
      <span data-testid="count-value">2</span>
    `);
		const countValue = queryByTestId('count-value');

		expect(countValue).toHaveTextContent('2');
		expect(countValue).toHaveTextContent(2);
		expect(countValue).toHaveTextContent(/2/);
		expect(countValue).not.toHaveTextContent('21');
	});

	it('negative test cases', () => {
		const { queryByTestId } = render(`
      <span data-testid="count-value">2</span>
    `);
		const countValue = queryByTestId('count-value');
		const { message: positiveMessage, pass: positivePass } = compare(countValue, '3');
		const { message: negativeMessage, pass: negativePass } = negativeCompare(countValue, '2');

		expect(positivePass).toBeFalse();
		expect(positiveMessage).toMatch(/Expected.*'2'.*to match.*'3'/);
		expect(negativePass).toBeFalse();
		expect(negativeMessage).toMatch(/Expected.*not to match/);
	});

	it('normalizes whitespaces by default', () => {
		const { container } = render(`
      <span>
        Step
          1
            of
              4
      </span>
    `);

		expect(container.querySelector('span')).toHaveTextContent('Step 1 of 4');
	});

	it('normalizing whitespace is an option and can be turned off', () => {
		const { container } = render(`
      <span>&nbsp;&nbsp;Step 1 of 4</span>
    `);

		expect(container.querySelector('span')).toHaveTextContent('  Step 1 of 4', {
			normalizeWhitespace: false,
		});

		expect(container.querySelector('span')).not.toHaveTextContent('Step 2 of 3', {
			normalizeWhitespace: false,
		});
	});

	it('can handle multiple levels', () => {
		const { container } = render(`
      <span id="parent"><span>Step 1 
    
      of 4</span></span>
    `);

		expect(container.querySelector('#parent')).toHaveTextContent('Step 1 of 4');
	});

	it('can handle multiple levels spread across descendants', () => {
		const { container } = render(`
      <span id="parent">
        <span>Step</span>
        <span>      1</span>
        <span><span>of</span></span>
        4</span>
      </span>
    `);

		expect(container.querySelector('#parent')).toHaveTextContent('Step 1 of 4');
	});

	it("doesn't throw for empty content", () => {
		const { container } = render(`
      <span></span>
    `);

		expect(container.querySelector('span')).toHaveTextContent('');
	});

	it('is case-sensitive', () => {
		const { container } = render(`
      <span>Sensitive text</span>
    `);

		expect(container.querySelector('span')).toHaveTextContent('Sensitive text');
		expect(container.querySelector('span')).not.toHaveTextContent('sensitive text');
	});

	it('when matching an empty string and an element with content, suggest using toBeEmptyDOMElement instead', () => {
		const { container } = render(`
      <span>Not empty</span>
    `);
		const { message: positiveMessage, pass: positivePass } = compare(container.querySelector('span'), '');
		const { message: negativeMessage, pass: negativePass } = negativeCompare(container.querySelector('span'), '');

		expect(positivePass).toBeFalse();
		expect(positiveMessage).toMatch(
			/Checking with an empty string will always match\. Try using.*.toBeEmptyDOMElement\(\)/
		);

		expect(negativePass).toBeFalse();
		expect(negativeMessage).toMatch(
			/Checking with an empty string will always match\. Try using.*.toBeEmptyDOMElement\(\)/
		);
	});
});
