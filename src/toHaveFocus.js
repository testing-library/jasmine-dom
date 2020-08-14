import { checkHtmlElement, getTag } from './utils';
import { printSecSuccess, printSuccess, printSecError, printError } from './printers';

export function toHaveFocus() {
	return {
		compare: function (htmlElement) {
			checkHtmlElement(htmlElement);
			let result = {};
			result.pass = htmlElement.ownerDocument.activeElement === htmlElement;
			result.message = result.pass
				? `${printSuccess('PASSED')} ${printSecSuccess(
						`Expected the provided ${printSuccess(getTag(htmlElement))} element to have focus.`
				  )}`
				: `${printError('FAILED')} ${printSecError(
						`Expected the provided ${printError(getTag(htmlElement))} element to have focus.`
				  )}`;
			return result;
		},
		negativeCompare: function (htmlElement) {
			checkHtmlElement(htmlElement);
			let result = {};
			result.pass = htmlElement.ownerDocument.activeElement !== htmlElement;
			result.message = result.pass
				? `${printSuccess('PASSED')} ${printSecSuccess(
						`Expected the provided ${printSuccess(getTag(htmlElement))} element not to have focus.`
				  )}`
				: `${printError('FAILED')} ${printSecError(
						`Expected the provided ${printError(getTag(htmlElement))} element not to have focus.`
				  )}`;
			return result;
		},
	};
}
