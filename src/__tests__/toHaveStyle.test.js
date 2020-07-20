import { render } from './helpers/renderer';
import document from './helpers/jsdom';
import { toHaveStyle } from '../toHaveStyle';

describe('.toHaveStyle', () => {
	const { compare, negativeCompare } = toHaveStyle();

	it('positive test cases', () => {
		const { container } = render(`
      <div class="label" style="background-color: blue; height: 100%">
        Hello world
      </div>
    `);
		const style = document.createElement('style');
		style.innerHTML = `
      .label {
        align-items: center;
        background-color: black;
        color: white;
        float: left;
        transition: opacity 0.2s ease-out, top 0.3s cubic-bezier(1.175, 0.885, 0.32, 1.275);
        transform: translateX(0px);
      }
    `;
		document.body.appendChild(style);
		document.body.appendChild(container);

		expect(container.querySelector('.label')).toHaveStyle(`
      height: 100%;
      color: white;
      background-color: blue;
    `);

		expect(container.querySelector('.label')).toHaveStyle(`
      background-color: blue;
      color: white;
    `);

		expect(container.querySelector('.label')).toHaveStyle(
			'transition: opacity 0.2s ease-out, top 0.3s cubic-bezier(1.175, 0.885, 0.32, 1.275);'
		);

		expect(container.querySelector('.label')).toHaveStyle('background-color:blue;color:white');

		expect(container.querySelector('.label')).not.toHaveStyle(`
      color: white;
      font-weight: bold;
    `);

		expect(container.querySelector('.label')).toHaveStyle(`
      Align-items: center;
    `);

		expect(container.querySelector('.label')).toHaveStyle(`
      transform: translateX(0px);
    `);
	});

	it('normalizes colors accordingly', () => {
		const { queryByTestId } = render(`
      <span data-testid="color-example" style="background-color: #123456">Hello, world!</span>
    `);

		expect(queryByTestId('color-example')).toHaveStyle('background-color: #123456');
	});

	it('properly normalizes colors for border', () => {
		const { queryByTestId } = render(`
      <span data-testid="color-example" style="border: 1px solid #fff">Hello World</span>
    `);

		expect(queryByTestId('color-example')).toHaveStyle('border: 1px solid #fff');
	});

	it('handles different formats for color declarations accordingly', () => {
		const { queryByTestId } = render(`
      <span data-testid="color-example" style="color: rgba(0, 0, 0, 1); background-color: #000000">Hello, world!</span>
    `);

		expect(queryByTestId('color-example')).toHaveStyle('color: #000000');
		expect(queryByTestId('color-example')).toHaveStyle('background-color: rgba(0, 0, 0, 1)');
	});

	it('handles nonexistent styles accordingly', () => {
		const { container } = render(`
      <div class="label" style="background-color: blue; height: 100%">
        Hello, world!
      </div>
    `);

		expect(container.querySelector('.label')).not.toHaveStyle('whatever: something;');
	});

	it('handles styles in JS objects', () => {
		const { container } = render(`
      <div class="label" style="background-color: blue; height: 100%">
        Hello, world!
      </div>
    `);

		expect(container.querySelector('.label')).toHaveStyle({
			backgroundColor: 'blue',
		});
		expect(container.querySelector('.label')).toHaveStyle({
			backgroundColor: 'blue',
			height: '100%',
		});
		expect(container.querySelector('.label')).not.toHaveStyle({
			backgroundColor: 'red',
			height: '100%',
		});
		expect(container.querySelector('.label')).not.toHaveStyle({
			whatever: 'anything',
		});
	});

	it('negative test cases', () => {
		const { container } = render(`
      <div class="label" style="background-color: blue; height: 100%">
        Hello world
      </div>
    `);
		const style = document.createElement('style');
		style.innerHTML = `
    .label {
      align-items: center;
      background-color: black;
      color: white;
      float: left;
      transition: opacity 0.2s ease-out, top 0.3s cubic-bezier(1.175, 0.885, 0.32, 1.275);
      transform: translateX(0px);
    }
  `;
		document.body.appendChild(style);
		document.body.appendChild(container);
		const { message: positiveMessage, pass: positivePass } = compare(
			container.querySelector('.label'),
			'align-items: left'
		);
		const { message: negativeMessage, pass: negativePass } = negativeCompare(
			container.querySelector('.label'),
			'color: white'
		);

		expect(positivePass).toBeFalse();
		expect(positiveMessage).toMatch(/Expected the provided.*element to have styles/);

		expect(negativePass).toBeFalse();
		expect(negativeMessage).toMatch(/Expected the provided.*element not to have styles/);
	});

	it('throws for invalid CSS syntax', () => {
		const { container } = render(`
      <div class="label" style="background-color: blue; height: 100%">
        Hello world
      </div>
    `);
		const style = document.createElement('style');
		style.innerHTML = `
    .label {
      align-items: center;
      background-color: black;
      color: white;
      float: left;
      transition: opacity 0.2s ease-out, top 0.3s cubic-bezier(1.175, 0.885, 0.32, 1.275);
      transform: translateX(0px);
    }
  `;
		document.body.appendChild(style);
		document.body.appendChild(container);

		expect(() => expect(container.querySelector('.label')).toHaveStyle('font weigh bold')).toThrowError();
	});
});
