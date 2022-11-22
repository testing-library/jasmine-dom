import { render } from './helpers/renderer';
import { toHaveAccessibleDescription } from '../toHaveAccessibleDescription';

describe('.toHaveAccessibleDescription', () => {
	it('works with the link title attribute', () => {
		const fakeMatchersUtils = {
			equals: Object.is,
		};

		const { queryByTestId } = render(`
			<div>
				<a data-testid="link" href="/" aria-label="Home page" title="A link to start over">Start</a>
				<a data-testid="extra-link" href="/about" aria-label="About page">About</a>
			</div>
		`);

		const link = queryByTestId('link');
		expect(link).toHaveAccessibleDescription();
		expect(link).toHaveAccessibleDescription('A link to start over');
		expect(link).not.toHaveAccessibleDescription('Home page');

		const { compare } = toHaveAccessibleDescription(fakeMatchersUtils);
		{
			const { pass, message } = compare(link, 'Invalid description');
			expect(pass).toBeFalse();
			expect(message).toMatch(/expected element to have accessible description/i);
		}

		const extraLink = queryByTestId('extra-link');
		expect(extraLink).not.toHaveAccessibleDescription();
		{
			const { pass, message } = compare(link, 'Invalid description');
			expect(pass).toBeFalse();
			expect(message).toMatch(/expected element to have accessible description/i);
		}
	});

	it('works with aria-describedby attributes', () => {
		const fakeMatchersUtils = {
			equals: Object.is,
		};

		const { queryByTestId } = render(`
			<div>
				<img src="avatar.jpg" data-testid="avatar" alt="User profile pic">
				<img src="logo.jpg" data-testid="logo" alt="Company logo" aria-describedby="t1">
				<span id="t1" role="presentation">The logo of Our Company</span>
			</div>
		`);

		const avatar = queryByTestId('avatar');
		expect(avatar).not.toHaveAccessibleDescription();
		const { compare } = toHaveAccessibleDescription(fakeMatchersUtils);
		{
			const { pass, message } = compare(avatar, 'User profile pic');
			expect(pass).toBeFalse();
			expect(message).toMatch(/expected element to have accessible description/i);
		}

		const logo = queryByTestId('logo');
		expect(logo).not.toHaveAccessibleDescription('Company logo');
		expect(logo).toHaveAccessibleDescription('The logo of Our Company');
		expect(logo).toHaveAccessibleDescription(/logo of our company/i);
		expect(logo).toHaveAccessibleDescription(jasmine.stringContaining('logo of Our Company'));
		{
			const { pass, message } = compare(logo, "Our company's logo");
			expect(pass).toBeFalse();
			expect(message).toMatch(/expected element to have accessible description/i);
		}
	});

	it('handles multiple ids', () => {
		const { queryByTestId } = render(`
			<div>
				<div id="first">First description</div>
				<div id="second">Second description</div>
				<div id="third">Third description</div>

				<div data-testid="multiple" aria-describedby="first second third"></div>
			</div>
		`);

		expect(queryByTestId('multiple')).toHaveAccessibleDescription(
			'First description Second description Third description'
		);
		expect(queryByTestId('multiple')).toHaveAccessibleDescription(/Second description Third/);
		expect(queryByTestId('multiple')).toHaveAccessibleDescription(jasmine.stringContaining('Second description Third'));
		expect(queryByTestId('multiple')).toHaveAccessibleDescription(jasmine.stringMatching(/Second description Third/));
		expect(queryByTestId('multiple')).not.toHaveAccessibleDescription('Something else');
		expect(queryByTestId('multiple')).not.toHaveAccessibleDescription('First');
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

		expect(queryByTestId('target')).toHaveAccessibleDescription('Step 1 of 4 And extra description');
	});
});
