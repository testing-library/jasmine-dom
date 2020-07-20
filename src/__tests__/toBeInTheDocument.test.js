import { render } from './helpers/renderer';
import document from './helpers/jsdom';
import { toBeInTheDocument } from '../toBeInTheDocument';
import { HtmlElementTypeError } from '../utils';

describe('.toBeInTheDocument()', () => {
	const { compare, negativeCompare } = toBeInTheDocument();
	const { container, queryByTestId } = render(`
        <span data-testid="html-element"><span>HTML element</span></span>
				<svg data-testid="svg-element">SVG element</svg>
	`);
	document.body.innerHTML = `
	  <span data-testid="html-element"><span>Html Element</span></span>
	  <svg data-testid="svg-element"></svg>`;

	const detachedElement = document.createElement('div');
	const notAnElement = { whatever: 'clearly not an element' };
	const undefinedElement = undefined;
	const nullElement = null;

	it('positive compare', () => {
		const { message: detachedMessage, pass: detachedPass } = compare(detachedElement);
		const { message: nullMessage, pass: nullPass } = compare(nullElement);

		document.body.appendChild(container);

		expect(detachedPass).toBeFalse();
		expect(detachedMessage).toMatch(/The.*div.*element provided.*could not be found in the document.*\./);

		expect(queryByTestId('html-element')).toBeInTheDocument();
		expect(queryByTestId('svg-element')).toBeInTheDocument();

		expect(() => expect(notAnElement).toBeInTheDocument()).toThrowError();
		expect(() => expect(undefinedElement).toBeInTheDocument()).toThrowError();

		expect(nullPass).toBeFalse();
		expect(nullMessage).toMatch(/The.*null.*element provided.*could not be found in the document.*\./);
	});

	it('negative compare', () => {
		const { message: htmlMessage, pass: htmlPass } = negativeCompare(queryByTestId('html-element'));
		const { message: svgMessage, pass: svgPass } = negativeCompare(queryByTestId('svg-element'));

		expect(htmlPass).toBeFalse();
		expect(htmlMessage).toMatch(/Expected the document not to contain the provided.*span.*element\./);

		expect(svgPass).toBeFalse();
		expect(svgMessage).toMatch(/Expected the document not to contain the provided.*svg.*element\./);

		expect(detachedElement).not.toBeInTheDocument();
		expect(nullElement).not.toBeInTheDocument();

		expect(() => expect(undefinedElement).toBeInTheDocument()).toThrowError(HtmlElementTypeError);
	});
});
