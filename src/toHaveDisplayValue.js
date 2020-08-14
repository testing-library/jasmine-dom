import { checkHtmlElement, matches, getTag } from './utils';
import { printSuccess, printSecSuccess, printSecError, printError, printSecWarning, printWarning } from './printers';

function getValues(tagName, htmlElement) {
	return tagName === 'select'
		? Array.from(htmlElement)
				.filter(option => option.selected)
				.map(option => option.textContent)
		: [htmlElement.value];
}

function getExpectedValues(expectedValue) {
	return expectedValue instanceof Array ? expectedValue : [expectedValue];
}

function getNumberOfMatchesBetweenArrays(arrayBase, array) {
	return array.filter(expected => arrayBase.filter(value => matches(value, expected)).length).length;
}

export function toHaveDisplayValue() {
	return {
		compare: function (htmlElement, expectedValue) {
			checkHtmlElement(htmlElement);
			let result = {};
			const tagName = getTag(htmlElement);

			if (!['select', 'input', 'textarea'].includes(tagName)) {
				throw new Error(
					printSecWarning(
						`${printError('FAILED')} .toHaveDisplayValue() supports only ${printWarning('input')}, ${printWarning(
							'textarea'
						)} or ${printWarning('select')} elements. Try using another matcher instead.`
					)
				);
			}

			if (tagName === 'input' && ['radio', 'checkbox'].includes(htmlElement.type)) {
				throw new Error(
					printSecWarning(
						`${printError('FAILED')} .toHaveDisplayValue() currently does not support ${printWarning(
							`input[type="${htmlElement.type}"]`
						)}, try with another matcher instead.`
					)
				);
			}

			const values = getValues(tagName, htmlElement);
			const expectedValues = getExpectedValues(expectedValue);
			const numberOfMatchesWithValues = getNumberOfMatchesBetweenArrays(values, expectedValues);
			const matchedWithAllValues = numberOfMatchesWithValues === values.length;
			const matchedWithAllExpectedValues = numberOfMatchesWithValues === expectedValues.length;

			result.pass = matchedWithAllValues && matchedWithAllExpectedValues;
			result.message = result.pass
				? `${printSuccess('PASSED')} ${printSecSuccess(
						`Expected the element ${printSuccess(getTag(htmlElement))} to have display value ${printSuccess(
							`'${expectedValue}'`
						)}. Received ${printSuccess(`'${values}'`)}`
				  )}`
				: `${printError('FAILED')} ${printSecError(
						`Expected the element ${printError(getTag(htmlElement))} to have display value ${printError(
							`'${expectedValue}'`
						)}. Received ${printError(`'${values}'`)}`
				  )}`;
			return result;
		},
		negativeCompare: function (htmlElement, expectedValue) {
			checkHtmlElement(htmlElement);
			let result = {};
			const tagName = getTag(htmlElement);

			if (!['select', 'input', 'textarea'].includes(tagName)) {
				throw new Error(
					printSecWarning(
						`${printError('FAILED')} .toHaveDisplayValue() supports only ${printWarning('input')}, ${printWarning(
							'textarea'
						)} or ${printWarning('select')} elements. Try using another matcher instead.`
					)
				);
			}

			const values = getValues(tagName, htmlElement);
			const expectedValues = getExpectedValues(expectedValue);
			const numberOfMatchesWithValues = getNumberOfMatchesBetweenArrays(values, expectedValues);
			const matchedWithAllValues = numberOfMatchesWithValues === values.length;
			const matchedWithAllExpectedValues = numberOfMatchesWithValues === expectedValues.length;

			result.pass = !(matchedWithAllValues && matchedWithAllExpectedValues);
			result.message = result.pass
				? `${printSuccess('PASSED')} ${printSecSuccess(
						`Expected the element ${printSuccess(getTag(htmlElement))} not to have display value ${printSuccess(
							`'${expectedValue}'`
						)}. Received ${printSuccess(`'${values}'`)}`
				  )}`
				: `${printError('FAILED')} ${printSecError(
						`Expected the element ${printError(getTag(htmlElement))} not to have display value ${printError(
							`'${expectedValue}'`
						)}. Received ${printError(`'${values}'`)}`
				  )}`;
			return result;
		},
	};
}
