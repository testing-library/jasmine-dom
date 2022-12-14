import { render } from './helpers/renderer';
import { toHaveErrorMessage } from '../toHaveErrorMessage';

describe('.toHaveErrorMessage', () => {
	const matchersUtilMock = {
		equals: Object.is,
	};

	const { compare } = toHaveErrorMessage(matchersUtilMock);

	it('resolves for object with correct aria-errormessage reference', () => {
		const { queryByTestId } = render(`
      <label for="startTime"> Please enter a start time for the meeting: </label>
      <input data-testid="startTime" type="text" aria-errormessage="msgID" aria-invalid="true" value="11:30 PM" >
      <span id="msgID" aria-live="assertive" style="visibility:visible"> Invalid time:  the time must be between 9:00 AM and 5:00 PM </span>
    `);

		const timeInput = queryByTestId('startTime');

		expect(timeInput).toHaveErrorMessage('Invalid time: the time must be between 9:00 AM and 5:00 PM');
		expect(timeInput).toHaveErrorMessage(/invalid time/i); // to partially match
		expect(timeInput).toHaveErrorMessage(jasmine.stringContaining('Invalid time')); // to partially match
		expect(timeInput).not.toHaveErrorMessage('Pikachu!');
	});

	it('works correctly on implicit invalid element', () => {
		const { queryByTestId } = render(`
      <label for="startTime"> Please enter a start time for the meeting: </label>
      <input data-testid="startTime" type="text" aria-errormessage="msgID" aria-invalid value="11:30 PM" >
      <span id="msgID" aria-live="assertive" style="visibility:visible"> Invalid time:  the time must be between 9:00 AM and 5:00 PM </span>
    `);

		const timeInput = queryByTestId('startTime');

		expect(timeInput).toHaveErrorMessage('Invalid time: the time must be between 9:00 AM and 5:00 PM');
		expect(timeInput).toHaveErrorMessage(/invalid time/i); // to partially match
		expect(timeInput).toHaveErrorMessage(jasmine.stringContaining('Invalid time')); // to partially match
		expect(timeInput).not.toHaveErrorMessage('Pikachu!');
	});

	it('rejects for valid object', () => {
		const { queryByTestId } = render(`
    <div id="errormessage">The errormessage</div>
    <div data-testid="valid" aria-errormessage="errormessage"></div>
    <div data-testid="explicitly_valid" aria-errormessage="errormessage" aria-invalid="false"></div>
    `);

		expect(queryByTestId('valid')).not.toHaveErrorMessage('The errormessage');
		expect(compare(queryByTestId('valid'), 'The errormessage').pass).toBeFalse();

		expect(queryByTestId('explicitly_valid')).not.toHaveErrorMessage('The errormessage');
		expect(compare(queryByTestId('explicitly_valid'), 'The errormessage').pass).toBeFalse();
	});

	it('rejects for object with incorrect aria-errormessage reference', () => {
		const { queryByTestId } = render(`
    <div id="errormessage">The errormessage</div>
    <div data-testid="invalid_id" aria-errormessage="invalid" aria-invalid="true"></div>
    `);

		expect(queryByTestId('invalid_id')).not.toHaveErrorMessage();
		expect(queryByTestId('invalid_id')).toHaveErrorMessage('');
	});

	it('handles invalid element without aria-errormessage', () => {
		const { queryByTestId } = render(`
    <div id="errormessage">The errormessage</div>
    <div data-testid="without" aria-invalid="true"></div>
    `);

		expect(queryByTestId('without')).not.toHaveErrorMessage();
		expect(queryByTestId('without')).toHaveErrorMessage('');
	});

	it('handles valid element without aria-errormessage', () => {
		const { queryByTestId } = render(`
    <div id="errormessage">The errormessage</div>
    <div data-testid="without"></div>
    `);

		expect(queryByTestId('without')).not.toHaveErrorMessage();
		expect(compare(queryByTestId('without')).pass).toBeFalse();

		expect(queryByTestId('without')).not.toHaveErrorMessage('');
		expect(compare(queryByTestId('without', '')).pass).toBeFalse();
	});

	it('handles multiple ids', () => {
		const { queryByTestId } = render(`
    <div id="first">First errormessage</div>
    <div id="second">Second errormessage</div>
    <div id="third">Third errormessage</div>
    <div data-testid="multiple" aria-errormessage="first second third" aria-invalid="true"></div>
    `);

		expect(queryByTestId('multiple')).toHaveErrorMessage('First errormessage Second errormessage Third errormessage');
		expect(queryByTestId('multiple')).toHaveErrorMessage(/Second errormessage Third/);
		expect(queryByTestId('multiple')).toHaveErrorMessage(jasmine.stringContaining('Second errormessage Third'));
		expect(queryByTestId('multiple')).toHaveErrorMessage(jasmine.stringMatching(/Second errormessage Third/));
		expect(queryByTestId('multiple')).not.toHaveErrorMessage('Something else');
		expect(queryByTestId('multiple')).not.toHaveErrorMessage('First');
	});

	it('handles negative test cases', () => {
		const { queryByTestId } = render(`
      <div id="errormessage">The errormessage</div>
      <div data-testid="target" aria-errormessage="errormessage" aria-invalid="true"></div>
    `);

		expect(() => expect(queryByTestId('other')).toHaveErrorMessage('The errormessage')).toThrowError();

		expect(compare(queryByTestId('target'), 'Something else').pass).toBeFalse();

		expect(compare(queryByTestId('target'), 'The errormessage').pass).toBeTrue();
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
            errormessage
      </div>
      <div data-testid="target" aria-errormessage="first second" aria-invalid="true"></div>
    `);

		expect(queryByTestId('target')).toHaveErrorMessage('Step 1 of 4 And extra errormessage');
	});

	it('can handle multiple levels with content spread across decendants', () => {
		const { queryByTestId } = render(`
        <span id="errormessage">
            <span>Step</span>
            <span>      1</span>
            <span><span>of</span></span>
            4</span>
        </span>
        <div data-testid="target" aria-errormessage="errormessage" aria-invalid="true"></div>
    `);

		expect(queryByTestId('target')).toHaveErrorMessage('Step 1 of 4');
	});

	it('handles extra whitespace with multiple ids', () => {
		const { queryByTestId } = render(`
      <div id="first">First errormessage</div>
      <div id="second">Second errormessage</div>
      <div id="third">Third errormessage</div>
      <div data-testid="multiple" aria-errormessage="  first
      second    third
      " aria-invalid="true"></div>
    `);

		expect(queryByTestId('multiple')).toHaveErrorMessage('First errormessage Second errormessage Third errormessage');
	});

	it('is case-sensitive', () => {
		const { queryByTestId } = render(`
      <span id="errormessage">Sensitive text</span>
      <div data-testid="target" aria-errormessage="errormessage" aria-invalid="true"></div>
    `);

		expect(queryByTestId('target')).toHaveErrorMessage('Sensitive text');
		expect(queryByTestId('target')).not.toHaveErrorMessage('sensitive text');
	});
});
