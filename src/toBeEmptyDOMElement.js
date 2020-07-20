import { checkHtmlElement, getTag } from './utils';
import { printError, printSecError, printSuccess, printSecSuccess } from './printers';

export function toBeEmptyDOMElement() {
	return {
		compare: function (htmlElement) {
			checkHtmlElement(htmlElement);
			let result = {};
			result.pass = htmlElement.innerHTML === '';
			result.message = `${
				result.pass
					? `💯 ${printSecSuccess(
							`Expected ${printSuccess(
								getTag(htmlElement)
							)} to be an empty DOM element. Received: ${printSuccess(`'${htmlElement.innerHTML}'`)}.`
					  )}`
					: `😨 ${printSecError(
							`Expected ${printError(
								getTag(htmlElement)
							)} to be an empty DOM element. Received: ${printError(`'${htmlElement.innerHTML}'`)}.`
					  )}`
			}`;
			return result;
		},
		negativeCompare: function (htmlElement) {
			checkHtmlElement(htmlElement);
			let result = {};
			result.pass = htmlElement.innerHTML !== '';
			result.message = `${
				result.pass
					? `💯 ${printSecSuccess(
							`Expected ${printSuccess(
								getTag(htmlElement)
							)} not to be an empty DOM element. Received: ${printSuccess(`'${htmlElement.innerHTML}'`)}`
					  )}`
					: `😨 ${printSecError(
							`Expected ${printError(
								getTag(htmlElement)
							)} not to be an empty DOM element. Received: ${printError(`'${htmlElement.innerHTML}'`)}.`
					  )}`
			}`;
			return result;
		},
	};
}
