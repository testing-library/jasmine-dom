import { render } from './helpers/renderer';
import { toHaveFormValues } from '../toHaveFormValues';

function mountForm() {
	return render(`
    <form data-testid="parent-form">
      <label for="title">Job title</label>
      <input
        type="text"
        id="title"
        name="title"
        value="Full-stack developer"
      />

      <label for="empty-value">Empty value</label>
      <input
        type="text"
        id="empty-value"
        name="empty-value"
      />

      <label for="salary">Salary</label>
      <input
        type="number"
        id="salary"
        name="salary"
        value="12345"
      />
      
      <label for="description">Description</label>
      <textarea
        id="description"
        name="description"
      >You need to know your stuff</textarea>

      <input
        type="checkbox"
        id="can-remote"
        name="remote[]"
        checked
      />
      <label for="can-remote">Can work remotely!</label>
      
      <input
        type="checkbox"
        id="cant-remote"
        name="cant-remote"
      />
      <label for="cant-remote">Can't work remotely</label>

      <input
        type="checkbox"
        id="freelancing"
        name="freelancing"
        checked
      />
      <label for="freelancing">Freelancing</label>
      
      <input
        type="checkbox"
        id="not-freelancing"
        name="not-freelancing"
        checked
      />
      <label for="not-freelancing">Not freelancing</label>

      <fieldset>

        <legend>Benefits</legend>
        <input
          type="text"
          id="benefits[0]"
          name="benefits[0]"
          value="Fruit & free drinks everyday"
        />
        <input
          type="text"
          id="benefits[1]"
          name="benefits[1]"
          value="Multicultural environment"

      </fieldset>

      <label for="is%Private^">Is Private</label>
      <input
        type="checkbox"
        id="is%Private^"
        name="is%Private^"
        checked
      />

      <label for="not%Private^">Not Private</label>
      <input
        type="checkbox"
        id="not%Private^"
        name="not%Private^"
        checked
      />
      
      <fieldset data-testid="multiple-checkbox-fieldset">
        <input
          type="checkbox"
          name="multi-value"
          value="1"
          checked
        />
        <input
          type="checkbox"
          name="multi-value"
          value="2"
        />
        <input
          type="checkbox"
          name="multi-value"
          value="3"
          checked
        />
      </fieldset>

      <fieldset data-testid="multiple-checkboxes">
        <legend>Skills</legend>
        <select id="skills" name="skills-options">
            <option
              name="graphql"
              id="graphql"
              value="graphql"
              selected
            >Graph QL</option>
            <option
              name="javascript"
              id="javascript"
              value="javascript"
            >JavaScript</option>
            <option
              name="python"
              id="python"
              value="python"
            >Python</option>
        </select>
      </fieldset>

      <label for="skills-options">Multiple options select</label>
      <select id="skills-options" name="skills" multiple>
        <option value="graphql" selected>GraphQL</option>
        <option value="python" selected>Python</option>
        <option value="javascript" selected>JavaScript</option>
        <option value="c-sharp">C#</option>
      </select>

      <fieldset data-testid="radio-select">
        <legend>Single radio select</legend>
        <div>
          <input
            type="radio"
            name="category"
            id="ux"
            value="ux"
          />
          <label for="ux">UX</label>
        </div>
        <div>
          <input
            type="radio"
            name="category"
            id="programming"
            value="programming"
            checked
          />
          <label for="programming">Programming</label>
        </div>
        <div>
          <input
            type="radio"
            name="category"
            id="design"
            value="design"
          />
          <label for="design">Design</label>
        </div>
      </fieldset>

      <fieldset data-testid="unselected-radio">
        <legend>Radio unselected</legend>
        <div>
          <input
            type="radio"
            name="category"
            id="ux"
            value="ux"
          />
          <label for="ux">UX</label>
        </div>
        <div>
          <input
            type="radio"
            name="category"
            id="programming"
            value="programming"
          />
          <label for="programming">Programming</label>
        </div>
        <div>
          <input
            type="radio"
            name="category"
            id="design"
            value="design"
          />
          <label for="design">Design</label>
        </div>
      </fieldset>

    </form>
  `);
}

describe('.toHaveFormValues', () => {
	const { compare, negativeCompare } = toHaveFormValues();
	const { queryByTestId } = mountForm();

	it('positive test cases', () => {
		expect(queryByTestId('parent-form')).toHaveFormValues({
			title: 'Full-stack developer',
			salary: 12345,
			category: 'programming',
			skills: ['javascript', 'graphql', 'python'],
			description: 'You need to know your stuff',
			remote: true,
			freelancing: true,
			'is%Private^': true,
			'benefits[0]': 'Fruit & free drinks everyday',
			'benefits[1]': 'Multicultural environment',
		});
	});

	it('allows to match partially', () => {
		expect(queryByTestId('parent-form')).toHaveFormValues({
			category: 'programming',
			salary: 12345,
		});
	});

	it('supports checkboxes for multiple selection', () => {
		expect(queryByTestId('parent-form')).toHaveFormValues({
			skills: ['javascript', 'graphql', 'python'],
		});
	});

	it('supports radio-buttons for single selection', () => {
		expect(queryByTestId('parent-form')).toHaveFormValues({
			category: 'programming',
		});
	});

	it('matches groups of selected values regardless of the order', () => {
		expect(queryByTestId('parent-form')).toHaveFormValues({
			skills: ['javascript', 'graphql', 'python'],
		});
		expect(queryByTestId('parent-form')).toHaveFormValues({
			skills: ['javascript', 'python', 'graphql'],
		});
		expect(queryByTestId('parent-form')).toHaveFormValues({
			skills: ['python', 'javascript', 'graphql'],
		});
		expect(queryByTestId('parent-form')).toHaveFormValues({
			skills: ['graphql', 'python', 'javascript'],
		});
		expect(queryByTestId('parent-form')).toHaveFormValues({
			skills: ['graphql', 'javascript', 'python'],
		});
	});

	it('correctly handles empty values', () => {
		expect(queryByTestId('parent-form')).not.toHaveFormValues({
			title: '',
			salary: null,
			category: null,
			skills: [],
			description: '',
		});
		expect(queryByTestId('parent-form')).toHaveFormValues({
			'empty-value': '',
		});
	});

	it('handles number type input values correctly', () => {
		expect(queryByTestId('parent-form')).toHaveFormValues({
			salary: 12345,
		});
		expect(queryByTestId('parent-form')).not.toHaveFormValues({
			salary: 123.456,
		});
		expect(queryByTestId('parent-form')).not.toHaveFormValues({
			salary: 135000,
		});
		expect(queryByTestId('parent-form')).not.toHaveFormValues({
			salary: -123,
		});
		expect(queryByTestId('parent-form')).not.toHaveFormValues({
			salary: 1e5,
		});
	});

	it('detects multiple elements with the same name but different type', () => {
		const { container } = render(`
      <form>
        <input type="checkbox" name="accept">
        <input type="radio" name="accept">
      </form>
    `);
		let errorMsg;
		try {
			expect(container.querySelector('form')).toHaveFormValues({});
		} catch (err) {
			errorMsg = err.message;
		}
		expect(errorMsg).toMatch(/Multiple form elements with the same name must be of the same type/);
	});

	it('detects multiple lements with the same type and name', () => {
		const { container } = render(`
        <form>
          <input type="text" name="title" value="one">
          <input type="text" name="title" value="two">
        </form>
    `);
		expect(container.querySelector('form')).toHaveFormValues({
			title: ['one', 'two'],
		});
	});

	it('supports unselected radio buttons', () => {
		expect(queryByTestId('unselected-radio')).toHaveFormValues({
			category: undefined,
		});
	});

	it('only works with form or fieldset elements', () => {
		const { container } = render(`
      <form>
        <input type="text" name="title" value="one" />
        <input type="text" name="description" value="two" />
      </form>
    `);
		const form = container.querySelector('form');

		expect(() =>
			expect(form).toHaveFormValues({
				title: 'one',
				description: 'two',
			})
		).not.toThrowError();

		expect(() =>
			expect(container).toHaveFormValues({
				title: 'one',
				description: 'two',
			})
		).toThrowError(/\.toHaveFormValues\(\) must be called on a.*form.*or a.*fieldset.*element\./);

		expect(() =>
			expect(container).not.toHaveFormValues({
				title: 'one',
				description: 'two',
			})
		).toThrowError(/\.toHaveFormValues\(\) must be called on a.*form.*or a.*fieldset.*element\./);
	});

	it('matches change in selected value of a select element', () => {
		const oldValue = 'graphql';
		const newValue = 'javascript';

		const { container, queryByTestId } = mountForm();

		const fieldset = queryByTestId('multiple-checkboxes');
		const select = container.querySelector('#skills');

		select.value = oldValue;
		expect(fieldset).toHaveFormValues({ 'skills-options': 'graphql' });
		expect(fieldset).not.toHaveFormValues({ 'skills-options': 'javascript' });

		select.value = newValue;
		expect(fieldset).toHaveFormValues({ 'skills-options': 'javascript' });
		expect(fieldset).not.toHaveFormValues({ 'skills-options': 'graphql' });
	});

	it('negative test cases', () => {
		const { message: positiveMessage, pass: positivePass } = compare(queryByTestId('parent-form'), {
			title: 'designer',
			salary: 99999,
			category: 'design',
		});

		const { message: negativeMessage, pass: negativePass } = negativeCompare(queryByTestId('parent-form'), {
			title: 'Full-stack developer',
			salary: 12345,
			category: 'programming',
		});

		expect(positivePass).toBeFalse();
		expect(positiveMessage).toMatch(/Expected the.*form.* to have/);

		expect(negativePass).toBeFalse();
		expect(negativeMessage).toMatch(/Expected the.*form.* not to have/);
	});
});
