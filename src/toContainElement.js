import { checkHtmlElement, getTag } from './utils';
import { printSecSuccess, printSuccess, printError, printSecError } from './printers';

export function toContainElement() {
	return {
		compare: function (container, htmlElement) {
			checkHtmlElement(container);
			let result = {};
			if (htmlElement !== null) {
				checkHtmlElement(htmlElement);
			}
			result.pass = container.contains(htmlElement);
			result.message = `${
				result.pass
					? `${printSuccess('PASSED')} ${printSecSuccess(
							`Expected the element ${printSuccess(getTag(container))} to contain ${printSuccess(getTag(htmlElement))}`
					  )}`
					: `${printError('FAILED')} ${printSecError(
							`Expected the element ${printError(getTag(container))} to contain ${printError(getTag(htmlElement))}`
					  )}`
			}`;
			return result;
		},
		negativeCompare: function (container, htmlElement) {
			checkHtmlElement(container);
			let result = {};
			if (htmlElement !== null) {
				checkHtmlElement(htmlElement);
			}
			result.pass = !container.contains(htmlElement);
			result.message = `${
				result.pass
					? `${printSuccess('PASSED')} ${printSecSuccess(
							`Expected the element ${printSuccess(getTag(container))} not to contain ${printSuccess(
								getTag(htmlElement)
							)}`
					  )}`
					: `${printError('FAILED')} ${printSecError(
							`Expected the element ${printError(getTag(container))} not to contain ${printError(getTag(htmlElement))}`
					  )}`
			}`;
			return result;
		},
	};
}
