import { render } from './helpers/renderer';
import { toHaveDescription } from '../toHaveDescription';

describe('.toHaveDescription', () => {
	const matchersUtilMock = {
		equals: Object.is,
	};

	const { compare, negativeCompare } = toHaveDescription(matchersUtilMock);

	it('positive test cases', () => {
		const { queryByTestId } = render(`
      <div>
        Single description cases
        <div id="description">The description</div>
        <div data-testid="single" aria-describedby="description"></div>
        <div data-testid="invalid-id" aria-describedby="invalid"></div>
        <div data-testid="without"></div>
      </div>
    `);
		const singleDescription = queryByTestId('single');
		const invalidDescriptionId = queryByTestId('invalid-id');
		const withoutDescription = queryByTestId('without');

		expect(singleDescription).toHaveDescription('The description');
		expect(singleDescription).toHaveDescription(/The/);
		expect(singleDescription).toHaveDescription(/the/i);
		expect(singleDescription).not.toHaveDescription(/whatever/);
		expect(singleDescription).not.toHaveDescription('The');

		expect(invalidDescriptionId).toHaveDescription('');
		expect(invalidDescriptionId).not.toHaveDescription();

		expect(withoutDescription).toHaveDescription('');
		expect(withoutDescription).not.toHaveDescription();
	});

	it('cases w/ multiple description ids', () => {
		const { queryByTestId } = render(`
      <div id="first">First description</div>
      <div id="second">Second description</div>
      <div id="third">Third description</div>
      <div data-testid="multiple" aria-describedby="first second third"></div>
    `);
		const multipleDescriptions = queryByTestId('multiple');

		expect(multipleDescriptions).toHaveDescription('First description Second description Third description');
		expect(multipleDescriptions).toHaveDescription(/Second description Third/);
		expect(multipleDescriptions).not.toHaveDescription('First');
		expect(multipleDescriptions).not.toHaveDescription('whatever');
		expect(multipleDescriptions).not.toHaveDescription(/stuff/);
	});

	it('normalizes whitespace', () => {
		const { queryByTestId } = render(`
      <div id="first">
      Step
        1
          of
            4
      </div>
      <div id="second">
        And
          extra
            description
      </div>
      <div data-testid="target" aria-describedby="first second"></div>
    `);
		expect(queryByTestId('target')).toHaveDescription('Step 1 of 4 And extra description');
		expect(queryByTestId('target')).not.toHaveDescription(/\s{2,}/);
	});

	it('can handle multiple levels w/ content spread across descendants', () => {
		const { queryByTestId } = render(`
    <span id="description">
      <span>Step</span>
      <span>      1</span>
      <span><span>of</span></span>


      4</span>
    </span>
    <div data-testid="target" aria-describedby="description"></div>
    `);

		expect(queryByTestId('target')).toHaveDescription('Step 1 of 4');
		expect(queryByTestId('target')).not.toHaveDescription('Step');
	});

	it('handles extra whitespace w/ multiple ids', () => {
		const { queryByTestId } = render(`
      <div id="first">First description</div>
      <div id="second">Second description</div>
      <div id="third">Third description</div>
      <div data-testid="multiple" aria-describedby="  first
      second    third
      "></div>
    `);

		expect(queryByTestId('multiple')).toHaveDescription('First description Second description Third description');
		expect(queryByTestId('multiple')).not.toHaveDescription('First description');
	});

	it('is case-sensitive', () => {
		const { queryByTestId } = render(`
      <span id="description">Sensitive text</span>
      <div data-testid="target" aria-describedby="description"></div>
    `);

		expect(queryByTestId('target')).toHaveDescription('Sensitive text');
		expect(queryByTestId('target')).not.toHaveDescription('sensitive text');
	});

	it('negative test cases', () => {
		const { queryByTestId } = render(`
      <div id="description">The description</div>
      <div data-testid="target" aria-describedby="description"></div>
    `);
		const unexistentElement = queryByTestId('other');
		const targetElement = queryByTestId('target');
		const { message: negativeTargetMessage, pass: negativeTargetPass } = negativeCompare(
			targetElement,
			'The description'
		);
		const { message: positiveTargetMessage, pass: positiveTargetPass } = compare(targetElement, 'whatever');

		expect(() => compare(unexistentElement, 'The description')).toThrowError(
			/FAILED.*Received element must be an HTMLElement or an SVGElement.*/
		);

		expect(negativeTargetPass).toBeFalse();
		expect(negativeTargetMessage).toMatch(/Expected.*not to have description.*/);
		expect(positiveTargetPass).toBeFalse();
		expect(positiveTargetMessage).toMatch(/Expected.*to have description.*/);
		expect(targetElement).toHaveDescription();
	});
});
