import { checkHtmlElement } from './utils';
import { printSecSuccess, printSuccess, printSecError, printError } from './printers';

export function toHaveAttribute(util) {
	return {
		compare: function (htmlElement, name, expectedValue) {
			checkHtmlElement(htmlElement);
			let result = {};
			const isExpectedValuePresent = expectedValue !== undefined;
			const hasAttribute = htmlElement.hasAttribute(name);
			const receivedValue = htmlElement.getAttribute(name);
			result.pass = isExpectedValuePresent ? hasAttribute && util.equals(receivedValue, expectedValue) : hasAttribute;
			result.message = result.pass
				? `${printSuccess('PASSED')} ${printSecSuccess(
						`Expected the value of the received attribute ${printSuccess(`'${name}'`)} to be ${printSuccess(
							`'${expectedValue}'`
						)}.`
				  )}`
				: `${printError('FAILED')} ${printSecError(
						`Expected the value of the received attribute ${printError(`'${name}'`)} to be ${printError(
							`'${expectedValue}'`
						)}, but received ${printError(`'${receivedValue}'`)}.`
				  )}`;
			return result;
		},
		negativeCompare: function (htmlElement, name, expectedValue) {
			checkHtmlElement(htmlElement);
			let result = {};
			const isExpectedValuePresent = expectedValue !== undefined;
			const hasAttribute = htmlElement.hasAttribute(name);
			const receivedValue = htmlElement.getAttribute(name);
			result.pass = isExpectedValuePresent ? hasAttribute && !util.equals(receivedValue, expectedValue) : !hasAttribute;
			result.message = result.pass
				? `${printSuccess('PASSED')} ${printSecSuccess(
						`Expected the value of the received attribute ${printSuccess(`'${name}'`)} not to be ${printSuccess(
							`'${expectedValue}'`
						)}.`
				  )}`
				: `${printError('FAILED')} ${printSecError(
						`Expected the value of the received attribute ${printError(`'${name}'`)} not to be ${printError(
							`'${expectedValue}'`
						)}, but received ${printError(`'${receivedValue}'`)}.`
				  )}`;
			return result;
		},
	};
}
