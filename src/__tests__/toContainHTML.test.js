import { render } from './helpers/renderer';
import { toContainHTML } from '../toContainHTML';
import { printSuccess, printSecError, printError } from '../printers';

/**
 * @param {object}  params
 * @param {boolean} params.positivePass
 * @param {RegExp}  params.positiveMatch
 * @param {RegExp}  params.negativeMatch
 * @param {Element} params.htmlElement
 * @param {string}  params.htmlText
 */
function testPositiveNagative({ positivePass, positiveMatch, negativeMatch, htmlElement, htmlText }) {
	const { compare, negativeCompare } = toContainHTML();

	const positive = compare(htmlElement, htmlText);
	expect(positive.pass)[positivePass ? 'toBeTrue' : 'toBeFalse']();
	expect(positive.message).toMatch(positiveMatch);

	const negative = negativeCompare(htmlElement, htmlText);
	expect(negative.pass)[positivePass ? 'toBeFalse' : 'toBeTrue']();
	expect(negative.message).toMatch(negativeMatch);
}

/* eslint-disable max-statements */
describe('.toContainHTML', () => {
	it('handles positive and negative cases', () => {
		const { queryByTestId } = render(`
    <span data-testid="grandparent">
      <span data-testid="parent">
        <span data-testid="child"></span>
      </span>
      <svg data-testid="svg-element"></svg>
    </span>
    `);

		const grandparent = queryByTestId('grandparent');
		const parent = queryByTestId('parent');
		const child = queryByTestId('child');
		const nonExistantElement = queryByTestId('not-exists');
		const fakeElement = { thisIsNot: 'an html element' };
		const stringChildElement = '<span data-testid="child"></span>';
		const stringChildElementSelfClosing = '<span data-testid="child" />';
		const incorrectStringHtml = '<span data-testid="child"></div>';
		const nonExistantString = '<span> Does not exists </span>';
		const svgElement = queryByTestId('svg-element');

		expect(grandparent).toContainHTML(stringChildElement);
		expect(parent).toContainHTML(stringChildElement);
		expect(child).toContainHTML(stringChildElement);
		expect(child).toContainHTML(stringChildElementSelfClosing);
		expect(grandparent).not.toContainHTML(nonExistantString);
		expect(parent).not.toContainHTML(nonExistantString);
		expect(child).not.toContainHTML(nonExistantString);
		expect(child).not.toContainHTML(nonExistantString);
		expect(grandparent).toContainHTML(incorrectStringHtml);
		expect(parent).toContainHTML(incorrectStringHtml);
		expect(child).toContainHTML(incorrectStringHtml);

		// Tests that throws
		expect(() => expect(nonExistantElement).toContainHTML(stringChildElement)).toThrowError();
		expect(() => expect(nonExistantElement).toContainHTML(nonExistantElement)).toThrowError();
		expect(() => expect(stringChildElement).toContainHTML(fakeElement)).toThrowError();
		expect(() => expect(nonExistantElement).not.toContainHTML(stringChildElement)).toThrowError();
		expect(() => expect(nonExistantElement).not.toContainHTML(nonExistantElement)).toThrowError();
		expect(() => expect(stringChildElement).not.toContainHTML(fakeElement)).toThrowError();
		expect(() => expect(nonExistantElement).not.toContainHTML(incorrectStringHtml)).toThrowError();

		// negative test cases wrapped in throwError assertions for coverage.
		testPositiveNagative({
			positivePass: false,
			positiveMatch: /Expected:.*Received:.*/,
			negativeMatch: /Expected:.*Received:.*/,
			htmlElement: svgElement,
			htmlText: stringChildElement,
		});

		testPositiveNagative({
			positivePass: true,
			positiveMatch: /Expected:.*Received:.*/,
			negativeMatch: /Expected:.*Received:.*/,
			htmlElement: parent,
			htmlText: stringChildElement,
		});

		testPositiveNagative({
			positivePass: true,
			positiveMatch: /Expected:.*Received:.*/,
			negativeMatch: /Expected:.*Received:.*/,
			htmlElement: grandparent,
			htmlText: stringChildElement,
		});

		testPositiveNagative({
			positivePass: true,
			positiveMatch: /Expected:.*Received:.*/,
			negativeMatch: /Expected:.*Received:.*/,
			htmlElement: child,
			htmlText: stringChildElement,
		});

		testPositiveNagative({
			positivePass: true,
			positiveMatch: /Expected:.*Received:.*/,
			negativeMatch: /Expected:.*Received:.*/,
			htmlElement: child,
			htmlText: stringChildElementSelfClosing,
		});

		testPositiveNagative({
			positivePass: false,
			positiveMatch: /Expected:.*Received:.*/,
			negativeMatch: /Expected:.*Received:.*/,
			htmlElement: child,
			htmlText: nonExistantString,
		});

		testPositiveNagative({
			positivePass: false,
			positiveMatch: /Expected:.*Received:.*/,
			negativeMatch: /Expected:.*Received:.*/,
			htmlElement: parent,
			htmlText: nonExistantString,
		});

		testPositiveNagative({
			positivePass: false,
			positiveMatch: /Expected:.*Received:.*/,
			negativeMatch: /Expected:.*Received:.*/,
			htmlElement: grandparent,
			htmlText: nonExistantString,
		});

		testPositiveNagative({
			positivePass: true,
			positiveMatch: /Expected:.*Received:.*/,
			negativeMatch: /Expected:.*Received:.*/,
			htmlElement: grandparent,
			htmlText: incorrectStringHtml,
		});

		testPositiveNagative({
			positivePass: true,
			positiveMatch: /Expected:.*Received:.*/,
			negativeMatch: /Expected:.*Received:.*/,
			htmlElement: child,
			htmlText: incorrectStringHtml,
		});

		testPositiveNagative({
			positivePass: true,
			positiveMatch: /Expected:.*Received:.*/,
			negativeMatch: /Expected:.*Received:.*/,
			htmlElement: parent,
			htmlText: incorrectStringHtml,
		});
	});

	it('throws with an expected text', () => {
		const { queryByTestId } = render('<span data-testid="child"></span>');
		const htmlElement = queryByTestId('child');
		const nonExistantString = '<div> non-existant element </div>';

		const errorMessage = toContainHTML().compare(htmlElement, nonExistantString).message;

		expect(errorMessage).toBe(
			`${printError('FAILED')} ${printSecError(
				`Expected: ${printError(`'<div> non-existant element </div>'`)}. Received: ${printSuccess(
					'<span data-testid="child"></span>'
				)}`
			)}`
		);
	});
});
