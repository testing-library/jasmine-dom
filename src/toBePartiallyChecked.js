import { checkHtmlElement, getTag } from './utils';
import { printWarning, printSecWarning, printError, printSecError, printSuccess, printSecSuccess } from './printers';

function isValidCheckbox(htmlElement) {
	return getTag(htmlElement) === 'input' && htmlElement.type === 'checkbox';
}

function isValidAriaElement(htmlElement) {
	return htmlElement.getAttribute('role') === 'checkbox';
}

function isPartiallyChecked(htmlElement) {
	const isAriaMixed = htmlElement.getAttribute('aria-checked') === 'mixed';
	if (isValidCheckbox(htmlElement)) {
		return htmlElement.indeterminate || isAriaMixed;
	}
	return isAriaMixed;
}

export function toBePartiallyChecked() {
	return {
		compare: function (htmlElement) {
			checkHtmlElement(htmlElement);
			let result = {};
			if (!isValidCheckbox(htmlElement) && !isValidAriaElement(htmlElement)) {
				result.pass = false;
				result.message = `${printError('FAILED')} ${printSecWarning(
					`Only inputs with type="checkbox" or elements with role="checkbox" and a valid aria-checked attribute can be used with ${printWarning(
						'.toBePartiallyChecked()'
					)}. Use ${printSuccess('.toHaveValue()')} instead.`
				)}`;
				return result;
			}
			result.pass = isPartiallyChecked(htmlElement);
			result.message = `${
				result.pass
					? `${printSuccess('PASSED')} ${printSecSuccess(
							`Expected the element ${printSuccess(getTag(htmlElement))} to be partially checked, and it ${printSuccess(
								'is partially checked'
							)}.`
					  )}`
					: `${printError('FAILED')} ${printSecError(
							`Expected the element ${printError(getTag(htmlElement))} to be partially checked, and it ${printError(
								"isn't partially checked"
							)}.`
					  )}`
			}`;
			return result;
		},
		negativeCompare: function (htmlElement) {
			checkHtmlElement(htmlElement);
			let result = {};
			if (!isValidCheckbox(htmlElement) && !isValidAriaElement(htmlElement)) {
				result.pass = false;
				result.message = `${printError('FAILED')} ${printSecWarning(
					`Only inputs with type="checkbox" or elements with role="checkbox" and a valid aria-checked attribute can be used with ${printWarning(
						'.toBePartiallyChecked()'
					)}. Use ${printSuccess('.toHaveValue()')} instead.`
				)}`;
				return result;
			}
			result.pass = !isPartiallyChecked(htmlElement);
			result.message = `${
				result.pass
					? `${printSuccess('PASSED')} ${printSecSuccess(
							`Expected the element ${printSuccess(
								getTag(htmlElement)
							)} not to be partially checked, and it ${printSuccess("isn't partially checked")}.`
					  )}`
					: `${printError('FAILED')} ${printSecError(
							`Expected the element ${printError(getTag(htmlElement))} not to be partially checked, and it ${printError(
								'is partially checked'
							)}.`
					  )}`
			}`;
			return result;
		},
	};
}
