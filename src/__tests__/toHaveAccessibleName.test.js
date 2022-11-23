import { render } from './helpers/renderer';
import { toHaveAccessibleName } from '../toHaveAccessibleName';

describe('.toHaveAccessibleName', () => {
	const fakeMatchersUtils = {
		equals: Object.is,
	};
	const { compare } = toHaveAccessibleName(fakeMatchersUtils);

	it("recognizes an element's content as its label when appropriate", () => {
		const { queryByTestId } = render(`
      <div>
        <ul data-testid="my-list">
          <li role="menuitem" data-testid="first"><strong>First</strong> element</li>
          <li role="menuitem" data-testid="second">Second <em>element</em></li>
        </ul>

        <button data-testid="my-button">
          <strong>Continue</strong> to the next step
        </button>
      </div>
    `);

		const list = queryByTestId('my-list');
		expect(list).not.toHaveAccessibleName();
		{
			const { pass, message } = compare(list);
			expect(pass).toBeFalse();
			expect(message).toMatch(/expected element to have accessible name/i);
		}

		expect(queryByTestId('first')).toHaveAccessibleName('First element');
		expect(queryByTestId('second')).toHaveAccessibleName('Second element');

		const button = queryByTestId('my-button');
		expect(button).toHaveAccessibleName();
		expect(button).toHaveAccessibleName('Continue to the next step');
		expect(button).toHaveAccessibleName(/continue to the next step/i);
		expect(button).toHaveAccessibleName(jasmine.stringContaining('Continue to the next'));
		expect(button).not.toHaveAccessibleName('Next step');
		{
			const { pass, message } = compare(button, 'Next step');
			expect(pass).toBeFalse();
			expect(message).toMatch(/expected element to have accessible name/i);
		}
	});

	it('works with label elements', () => {
		const { queryByTestId } = render(`
      <div>
        <label for="first-name-field">First name</label>
        <input type="text" id="first-name-field" data-testid="first-name-field" />

	      <label>
          <input type="checkbox" data-testid="checkbox-field" />
          Accept terms and conditions
	      </label>
      </div>
   `);

		const firstNameField = queryByTestId('first-name-field');
		expect(firstNameField).toHaveAccessibleName('First name');
		expect(queryByTestId('first-name-field')).toHaveAccessibleName(/first name/i);
		expect(firstNameField).toHaveAccessibleName(jasmine.stringContaining('First'));
		{
			const { pass, message } = compare(firstNameField, 'Last name');
			expect(pass).toBeFalse();
			expect(message).toMatch(/expected element to have accessible name/i);
		}

		const checkboxField = queryByTestId('checkbox-field');
		expect(checkboxField).toHaveAccessibleName('Accept terms and conditions');
		expect(checkboxField).toHaveAccessibleName(/accept terms/i);
		expect(checkboxField).toHaveAccessibleName(jasmine.stringContaining('Accept terms'));
		{
			const { pass, message } = compare(checkboxField, 'Accept our terms and conditions');
			expect(pass).toBeFalse();
			expect(message).toMatch(/expected element to have accessible name/i);
		}
	});

	it('works with aria-label attributes', () => {
		const { queryByTestId } = render(`
      <div>
        <label for="first-name-field">First name</label>
        <input
          type="text"
          id="first-name-field"
          data-testid="first-name-field"
          aria-label="Enter your name"
        />

	      <label>
          <input
            type="checkbox"
            data-testid="checkbox-field"
            aria-label="Accept our terms and conditions"
          />
          Accept terms and conditions
	      </label>

        <button
          type="submit"
          data-testid="submit-button"
          aria-label="Submit this form"
        >
          Continue
        </button>
      </div>
   `);

		const firstNameField = queryByTestId('first-name-field');
		expect(firstNameField).not.toHaveAccessibleName('First name');
		expect(firstNameField).toHaveAccessibleName('Enter your name');
		expect(firstNameField).toHaveAccessibleName(/enter your name/i);
		expect(firstNameField).toHaveAccessibleName(jasmine.stringContaining('your name'));
		{
			const { pass, message } = compare(firstNameField, 'First name');
			expect(pass).toBeFalse();
			expect(message).toMatch(/expected element to have accessible name/i);
		}

		const checkboxField = queryByTestId('checkbox-field');
		expect(checkboxField).not.toHaveAccessibleName('Accept terms and conditions');
		expect(checkboxField).toHaveAccessibleName('Accept our terms and conditions');
		expect(checkboxField).toHaveAccessibleName(/accept our terms/i);
		expect(checkboxField).toHaveAccessibleName(jasmine.stringContaining('terms'));
		{
			const { pass, message } = compare(checkboxField, 'Accept terms and conditions');
			expect(pass).toBeFalse();
			expect(message).toMatch(/expected element to have accessible name/i);
		}

		const submitButton = queryByTestId('submit-button');
		expect(submitButton).not.toHaveAccessibleName('Continue');
		expect(submitButton).toHaveAccessibleName('Submit this form');
		expect(submitButton).toHaveAccessibleName(/submit this form/i);
		expect(submitButton).toHaveAccessibleName(jasmine.stringContaining('form'));
		{
			const { pass, message } = compare(submitButton, 'Continue');
			expect(pass).toBeFalse();
			expect(message).toMatch(/expected element to have accessible name/i);
		}
	});

	it('works with aria-labelledby attributes', () => {
		const { queryByTestId } = render(`
      <div>
        <label for="first-name-field">First name</label>
        <input
          type="text"
          id="first-name-field"
          data-testid="first-name-field"
          aria-labelledby="first-name-label"
        />
        <p id="first-name-label">Enter your name</p>

	      <label>
          <input
            type="checkbox"
            data-testid="checkbox-field"
            aria-labelledby="checkbox-label"
          />
          Accept terms and conditions
	      </label>
        <p id="checkbox-label">Accept our terms and conditions</p>

        <button
          type="submit"
          data-testid="submit-button"
          aria-labelledby="button-label"
        >
          Continue
        </button>
        <p id="button-label">Submit this form</p>
      </div>
   `);

		const firstNameField = queryByTestId('first-name-field');
		expect(firstNameField).not.toHaveAccessibleName('First name');
		expect(firstNameField).toHaveAccessibleName('Enter your name');
		expect(firstNameField).toHaveAccessibleName(/enter your name/i);
		expect(firstNameField).toHaveAccessibleName(jasmine.stringContaining('your name'));
		{
			const { pass, message } = compare(firstNameField, 'First name');
			expect(pass).toBeFalse();
			expect(message).toMatch(/expected element to have accessible name/i);
		}

		const checkboxField = queryByTestId('checkbox-field');
		expect(checkboxField).not.toHaveAccessibleName('Accept terms and conditions');
		expect(checkboxField).toHaveAccessibleName('Accept our terms and conditions');
		expect(checkboxField).toHaveAccessibleName(/accept our terms/i);
		expect(checkboxField).toHaveAccessibleName(jasmine.stringContaining('terms'));
		{
			const { pass, message } = compare(checkboxField, 'Accept terms and conditions');
			expect(pass).toBeFalse();
			expect(message).toMatch(/expected element to have accessible name/i);
		}

		const submitButton = queryByTestId('submit-button');
		expect(submitButton).not.toHaveAccessibleName('Continue');
		expect(submitButton).toHaveAccessibleName('Submit this form');
		expect(submitButton).toHaveAccessibleName(/submit this form/i);
		expect(submitButton).toHaveAccessibleName(jasmine.stringContaining('form'));
		{
			const { pass, message } = compare(submitButton, 'Continue');
			expect(pass).toBeFalse();
			expect(message).toMatch(/expected element to have accessible name/i);
		}
	});

	it('works with image alt attributes', () => {
		const { queryByTestId } = render(`
      <div>
        <img src="logo.png" alt="Company logo" data-testid="logo-img" />
        <button data-testid="close-button">
          <img src="close.png" alt="Close modal"  />
        </button>
      </div>
    `);

		const logoImage = queryByTestId('logo-img');
		expect(logoImage).toHaveAccessibleName('Company logo');
		expect(logoImage).toHaveAccessibleName(/company logo/i);
		expect(logoImage).toHaveAccessibleName(jasmine.stringContaining('logo'));
		expect(logoImage).not.toHaveAccessibleName('Our company logo');
		expect(logoImage).toHaveAccessibleName('Company logo');
		{
			const { pass, message } = compare(logoImage, 'Our company logo');
			expect(pass).toBeFalse();
			expect(message).toMatch(/expected element to have accessible name/i);
		}

		const closeButton = queryByTestId('close-button');
		expect(closeButton).toHaveAccessibleName('Close modal');
		expect(closeButton).toHaveAccessibleName(/close modal/i);
		expect(closeButton).toHaveAccessibleName(jasmine.stringContaining('modal'));
		expect(closeButton).not.toHaveAccessibleName('Close window');

		{
			const { pass, message } = compare(closeButton, 'Close window');
			expect(pass).toBeFalse();
			expect(message).toMatch(/expected element to have accessible name/i);
		}
	});

	it('works with svg title attributes', () => {
		const { queryByTestId } = render(`
      <svg data-testid="svg-title"><title>Test title</title></svg>
    `);

		const svgElement = queryByTestId('svg-title');
		expect(svgElement).toHaveAccessibleName('Test title');
		expect(svgElement).toHaveAccessibleName(/test title/i);
		expect(svgElement).toHaveAccessibleName(jasmine.stringContaining('Test'));
		expect(svgElement).not.toHaveAccessibleName('Another title');

		{
			const { pass, message } = compare(svgElement, 'Another title');
			expect(pass).toBeFalse();
			expect(message).toMatch(/expected element to have accessible name/i);
		}
	});

	it('works as in the examples in the README', () => {
		const { queryByTestId: getByTestId } = render(`
      <div>
        <img data-testid="img-alt" src="" alt="Test alt" />
        <img data-testid="img-empty-alt" src="" alt="" />
        <svg data-testid="svg-title"><title>Test title</title></svg>
        <button data-testid="button-img-alt"><img src="" alt="Test" /></button>
        <p><img data-testid="img-paragraph" src="" alt="" /> Test content</p>
        <button data-testid="svg-button"><svg><title>Test</title></svg></p>
        <div><svg data-testid="svg-without-title"></svg></div>
        <input data-testid="input-title" title="test" />
      </div>
    `);

		expect(getByTestId('img-alt')).toHaveAccessibleName('Test alt');
		expect(getByTestId('img-empty-alt')).not.toHaveAccessibleName();
		expect(getByTestId('svg-title')).toHaveAccessibleName('Test title');
		expect(getByTestId('button-img-alt')).toHaveAccessibleName();
		expect(getByTestId('img-paragraph')).not.toHaveAccessibleName();
		expect(getByTestId('svg-button')).toHaveAccessibleName();
		expect(getByTestId('svg-without-title')).not.toHaveAccessibleName();
		expect(getByTestId('input-title')).toHaveAccessibleName();
	});
});
