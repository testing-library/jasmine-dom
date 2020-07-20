import { checkHtmlElement, getSingleElementValue, compareArraysAsSet, isEqualWith, getTag } from './utils';
import { printSecWarning, printWarning, printSecError, printError, printSecSuccess, printSuccess } from './printers';

export function toHaveValue() {
	return {
		compare: function (htmlElement, expectedValue) {
			checkHtmlElement(htmlElement);
			let result = {};
			if (getTag(htmlElement) === 'input' && ['checkbox', 'radio'].includes(htmlElement.type)) {
				throw new Error(
					printSecWarning(
						`🤔 input elements with ${printWarning(
							'type="checkbox/radio"'
						)} cannot be used with ${printWarning('.toHaveValue()')}. Use ${printSuccess(
							'.toBeChecked()'
						)} for type="checkbox" or ${printSuccess('.toHaveFormValues()')} instead.`
					)
				);
			}
			const receivedValue = getSingleElementValue(htmlElement);
			const expectsValue = expectedValue !== undefined;
			let expectedTypedValue = expectedValue;
			let receivedTypedValue = receivedValue;
			if (expectedValue == receivedValue && expectedValue !== receivedValue) {
				expectedTypedValue = `${expectedValue} (${typeof expectedValue})`;
				receivedTypedValue = `${receivedValue} (${typeof receivedValue})`;
			}
			result.pass = expectsValue
				? isEqualWith(receivedValue, expectedValue, compareArraysAsSet)
				: Boolean(receivedValue);
			result.message = result.pass
				? `💯 ${printSecSuccess(
						`Expected the provided ${printSuccess(getTag(htmlElement))} to have value ${printSuccess(
							`${expectsValue ? expectedTypedValue : '(any)'}`
						)}.\nReceived ${printSuccess(receivedTypedValue)}.`
				  )}`
				: `😨 ${printSecError(
						`Expected the provided ${printError(getTag(htmlElement))} to have value ${printError(
							`${expectsValue ? expectedTypedValue : '(any)'}`
						)}.\nReceived ${printError(receivedTypedValue)}.`
				  )}`;
			return result;
		},
		negativeCompare: function (htmlElement, expectedValue) {
			checkHtmlElement(htmlElement);
			let result = {};
			if (getTag(htmlElement) === 'input' && ['checkbox', 'radio'].includes(htmlElement.type)) {
				throw new Error(
					printSecWarning(
						`🤔 input elements with ${printWarning(
							'type="checkbox/radio"'
						)} cannot be used with ${printWarning('.toHaveValue()')}. Use ${printSuccess(
							'.toBeChecked()'
						)} for type="checkbox" or ${printSuccess('.toHaveFormValues()')} instead.`
					)
				);
			}
			const receivedValue = getSingleElementValue(htmlElement);
			const expectsValue = expectedValue !== undefined;
			let expectedTypedValue = expectedValue;
			let receivedTypedValue = receivedValue;
			if (expectedValue == receivedValue && expectedValue !== receivedValue) {
				expectedTypedValue = `${expectedValue} (${typeof expectedValue})`;
				receivedTypedValue = `${receivedValue} (${typeof receivedValue})`;
			}
			result.pass = expectsValue
				? !isEqualWith(receivedValue, expectedValue, compareArraysAsSet)
				: Boolean(!receivedValue);
			result.message = result.pass
				? `💯 ${printSecSuccess(
						`Expected the provided ${printSuccess(getTag(htmlElement))} not to have value ${printSuccess(
							`${expectsValue ? expectedTypedValue : '(any)'}`
						)}.\nReceived ${printSuccess(receivedTypedValue)}.`
				  )}`
				: `😨 ${printSecError(
						`Expected the provided ${printError(getTag(htmlElement))} not to have value ${printError(
							`${expectsValue ? expectedTypedValue : '(any)'}`
						)}.\nReceived ${printError(receivedTypedValue)}.`
				  )}`;
			return result;
		},
	};
}
