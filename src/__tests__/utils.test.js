import document from './helpers/jsdom';
import { checkHtmlElement } from '../utils';

describe('Utils file', () => {
	describe('checkHtmlElement()', () => {
		it("doesn't throw for a correct HTML element", () => {
			expect(() => {
				const htmlElement = document.createElement('p');
				checkHtmlElement(htmlElement, () => {}, {});
			}).not.toThrow();
		});

		it("doesn't throw for a correct SVG element", () => {
			expect(() => {
				const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
				checkHtmlElement(svgElement, () => {}, {});
			}).not.toThrow();
		});

		it("doesn't throw for document body", () => {
			expect(() => {
				checkHtmlElement(document.body, () => {}, {});
			}).not.toThrow();
		});

		it('throws for undefined', () => {
			expect(() => {
				checkHtmlElement(undefined, () => {}, {});
			}).toThrow();
		});

		it('throws for document', () => {
			expect(() => {
				checkHtmlElement(document, () => {}, {});
			}).toThrow();
		});

		it('throws for function', () => {
			expect(() => {
				checkHtmlElement(
					() => {},
					() => {},
					{}
				);
			}).toThrow();
		});

		it('throws for almost element-like objects', () => {
			class FakeObject {}
			expect(() => {
				checkHtmlElement(
					{
						ownerDocument: {
							defaultView: { HTMLElement: FakeObject, SVGElement: FakeObject },
						},
					},
					() => {},
					{}
				);
			}).toThrow();
		});
	});
});
