import { render } from './helpers/renderer';
import { toContainElement } from '../toContainElement';
import { HtmlElementTypeError } from '../utils';

describe('.toContainElement', () => {
	const { compare, negativeCompare } = toContainElement();
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
	const svgElement = queryByTestId('svg-element');
	const unexistentElement = queryByTestId("doesn't-exist");
	const notAnElement = { whatever: 'clearly not an element' };

	it('positive test cases', () => {
		expect(grandparent).toContainElement(parent);
		expect(grandparent).toContainElement(child);
		expect(grandparent).toContainElement(svgElement);
		expect(parent).toContainElement(child);
		expect(parent).not.toContainElement(grandparent);
		expect(parent).not.toContainElement(svgElement);
		expect(child).not.toContainElement(parent);
		expect(child).not.toContainElement(grandparent);
		expect(child).not.toContainElement(svgElement);
		expect(grandparent).not.toContainElement(unexistentElement);
	});

	it('negative test cases', () => {
		const { message: parentGrandparentMessage, pass: parentGrandparentPass } = compare(parent, grandparent);
		const { message: grandparentUnexistentMessage, pass: grandparentUnexistentPass } = compare(
			grandparent,
			unexistentElement
		);
		const { message: grandparentChildMessage, pass: grandparentChildPass } = negativeCompare(grandparent, child);
		const { message: grandparentSvgMessage, pass: grandparentSvgPass } = negativeCompare(grandparent, svgElement);

		expect(parentGrandparentPass).toBeFalse();
		expect(parentGrandparentMessage).toMatch(/Expected the element.*to contain/);
		expect(grandparentUnexistentPass).toBeFalse();
		expect(grandparentUnexistentMessage).toMatch(/Expected the element.*to contain/);
		expect(grandparentChildPass).toBeFalse();
		expect(grandparentChildMessage).toMatch(/Expected the element.*not to contain/);
		expect(grandparentSvgPass).toBeFalse();
		expect(grandparentSvgMessage).toMatch(/Expected the element.*not to contain/);

		expect(() => negativeCompare(unexistentElement, child)).toThrowError(HtmlElementTypeError);
		expect(() => compare(unexistentElement, grandparent)).toThrowError(HtmlElementTypeError);
		expect(() => compare(unexistentElement, unexistentElement)).toThrowError(HtmlElementTypeError);
		expect(() => compare(unexistentElement, notAnElement)).toThrowError(HtmlElementTypeError);
		expect(() => compare(notAnElement, unexistentElement)).toThrowError(HtmlElementTypeError);
		expect(() => negativeCompare(notAnElement, unexistentElement)).toThrowError(HtmlElementTypeError);
		expect(() => compare(notAnElement, grandparent)).toThrowError(HtmlElementTypeError);
		expect(() => compare(grandparent, notAnElement)).toThrowError(HtmlElementTypeError);
		expect(() => compare(notAnElement, notAnElement)).toThrowError(HtmlElementTypeError);
		expect(() => negativeCompare(grandparent, undefined)).toThrowError(HtmlElementTypeError);
	});
});
