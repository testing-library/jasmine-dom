import { render } from './helpers/renderer';
import { toHaveDisplayValue } from '../toHaveDisplayValue';

describe('.toHaveDisplayValue', () => {
	const { compare, negativeCompare } = toHaveDisplayValue();

	describe('w/ supported elements', () => {
		it('positive test cases', () => {
			const { queryByTestId } = render(`
        <select id="fruits" data-testid="select">
        <option value="">Select a fruit...</option>
        <option value="ananas">Ananas</option>
        <option value="banana">Banana</option>
        <option value="avocado">Avocado</option>
        </select>
      `);
			const select = queryByTestId('select');

			expect(select).toHaveDisplayValue('Select a fruit...');
			expect(select).not.toHaveDisplayValue('Banana');

			select.value = 'banana';

			expect(select).toHaveDisplayValue('Banana');
			expect(select).toHaveDisplayValue(/[bB]ana/);
		});

		it('negative test cases', () => {
			const { queryByTestId } = render(`
        <select id="fruits" data-testid="select">
        <option value="">Select a fruit...</option>
        <option value="ananas">Ananas</option>
        <option value="banana">Banana</option>
        <option value="avocado">Avocado</option>
        </select>
    `);

			const { message: negativeMessage, pass: negativePass } = negativeCompare(
				queryByTestId('select'),
				'Select a fruit...'
			);
			const { message: positiveMessage, pass: positivePass } = compare(queryByTestId('select'), 'Ananas');

			expect(negativePass).toBeFalse();
			expect(negativeMessage).toMatch(
				/FAILED.*Expected the element.*select.*not to have display value.*'Select a fruit\.\.\.'.*\. Received.*'Select a fruit\.\.\.'/i
			);
			expect(positivePass).toBeFalse();
			expect(positiveMessage).toMatch(
				/FAILED.*Expected the element.*select.*to have display value.*'Ananas'.*\. Received.*'Select a fruit\.\.\.'/i
			);
		});

		it('w/ input elements', () => {
			const { queryByTestId } = render(`
        <input type="text" data-testid="input" value="Luca" />
      `);
			const input = queryByTestId('input');

			expect(input).toHaveDisplayValue('Luca');
			expect(input).toHaveDisplayValue(/Luc/);
			expect(input).not.toHaveDisplayValue('Brian');

			input.value = 'Brian';

			expect(input).toHaveDisplayValue('Brian');
			expect(input).not.toHaveDisplayValue('Luca');
		});

		it('w/ textarea elements', () => {
			const { queryByTestId } = render('<textarea data-testid="textarea">An example description here.</textarea>');
			const textarea = queryByTestId('textarea');

			expect(textarea).toHaveDisplayValue('An example description here.');
			expect(textarea).toHaveDisplayValue(/example/);
			expect(textarea).not.toHaveDisplayValue('Another example');

			textarea.value = 'Another example';

			expect(textarea).toHaveDisplayValue('Another example');
			expect(textarea).not.toHaveDisplayValue('An example description here.');
		});
	});

	describe('w/ multiple select', () => {
		function mount() {
			return render(`
        <select id="fruits" data-testid="select" multiple>
          <option value="">Select a fruit...</option>
          <option value="ananas" selected>Ananas</option>
          <option value="banana">Banana</option>
          <option value="avocado" selected>Avocado</option>
        </select>
      `);
		}

		it('matches only when all the multiple selected values are equal to all the expected values', () => {
			const { queryByTestId } = mount();
			const select = queryByTestId('select');

			expect(select).toHaveDisplayValue(['Ananas', 'Avocado']);
			expect(select).not.toHaveDisplayValue(['Ananas', 'Avocado', 'Orange']);
			expect(select).not.toHaveDisplayValue('Ananas');
			Array.from(select.options).forEach(option => {
				option.selected = ['ananas', 'banana'].includes(option.value);
			});

			expect(select).toHaveDisplayValue(['Ananas', 'Banana']);
		});

		it('matches even when the expected values are unordered', () => {
			const { queryByTestId } = mount();

			expect(queryByTestId('select')).toHaveDisplayValue(['Avocado', 'Ananas']);
		});

		it('matches with RegExp expected values', () => {
			const { queryByTestId } = mount();

			expect(queryByTestId('select')).toHaveDisplayValue([/[Aa]nanas/, 'Avocado']);
		});
	});

	describe('w/ invalid elements', () => {
		const { queryByTestId } = render(`
      <div data-testid="div">Banana</div>
      <input type="radio" data-testid="radio" value="Something" />
      <input type="checkbox" data-testid="checkbox" />
    `);
		it('should throw', () => {
			let errorMessage;

			try {
				expect(queryByTestId('div')).toHaveDisplayValue('Banana');
			} catch (err) {
				errorMessage = err.message;
			}

			expect(errorMessage).toMatch(/\.toHaveDisplayValue\(\) supports only.*input.*textarea.*select.*/);

			try {
				expect(queryByTestId('div')).not.toHaveDisplayValue('Banana');
			} catch (err) {
				errorMessage = err.message;
			}

			expect(errorMessage).toMatch(/\.toHaveDisplayValue\(\) supports only.*input.*textarea.*select.*/);

			try {
				expect(queryByTestId('radio')).toHaveDisplayValue('whatever');
			} catch (err) {
				errorMessage = err.message;
			}

			expect(errorMessage).toMatch(/\.toHaveDisplayValue\(\) currently does not support.*input\[type="radio"\].*/);

			try {
				expect(queryByTestId('checkbox')).toHaveDisplayValue(true);
			} catch (err) {
				errorMessage = err.message;
			}

			expect(errorMessage).toMatch(/\.toHaveDisplayValue\(\) currently does not support.*input\[type="checkbox"\].*/);
		});
	});
});
