import { checkHtmlElement, getTag } from './utils';
import { printSuccess, printSecSuccess, printError, printSecError } from './printers';

const INVALID_FORM_TAGS = ['form', 'input', 'select', 'textarea'];

function isElementHavingAriaInvalid(htmlElement) {
	return htmlElement.hasAttribute('aria-invalid') && htmlElement.getAttribute('aria-invalid') !== 'false';
}

function supportsValidityMethod(htmlElement) {
	return INVALID_FORM_TAGS.includes(getTag(htmlElement));
}

function isElementInvalid(htmlElement) {
	const hasAriaInvalid = isElementHavingAriaInvalid(htmlElement);
	if (supportsValidityMethod(htmlElement)) {
		return hasAriaInvalid || !htmlElement.checkValidity();
	} else {
		return hasAriaInvalid;
	}
}

export function toBeInvalid() {
	return {
		compare: function (htmlElement) {
			checkHtmlElement(htmlElement);
			let result = {};
			const isInvalid = isElementInvalid(htmlElement);
			result.pass = isInvalid;
			result.message = `${
				result.pass
					? `${printSuccess('PASSED')} ${printSecSuccess(
							`Expected the element ${printSuccess(getTag(htmlElement))} to be invalid, and it ${printSuccess(
								'is invalid'
							)}.`
					  )}`
					: `${printError('FAILED')} ${printSecError(
							`Expected the element ${printError(getTag(htmlElement))} to be invalid, and it ${printError(
								"isn't invalid"
							)}.`
					  )}`
			}`;
			return result;
		},
		negativeCompare: function (htmlElement) {
			checkHtmlElement(htmlElement);
			let result = {};
			const isValid = !isElementInvalid(htmlElement);
			result.pass = isValid;
			result.message = `${
				result.pass
					? `${printSuccess('PASSED')} ${printSecSuccess(
							`Expected the element ${printSuccess(getTag(htmlElement))} not to be invalid, and it ${printSuccess(
								"isn't invalid"
							)}.`
					  )}`
					: `${printError('FAILED')} ${printSecError(
							`Expected the element ${printError(getTag(htmlElement))} not to be invalid, and it ${printError(
								'is invalid'
							)}.`
					  )}`
			}`;
			return result;
		},
	};
}

export function toBeValid() {
	return {
		compare: function (htmlElement) {
			checkHtmlElement(htmlElement);
			let result = {};
			const isValid = !isElementInvalid(htmlElement);
			result.pass = isValid;
			result.message = `${
				result.pass
					? `${printSuccess('PASSED')} ${printSecSuccess(
							`Expected the element ${printSuccess(getTag(htmlElement))} to be valid, and it ${printSuccess(
								'is valid'
							)}.`
					  )}`
					: `${printError('FAILED')} ${printSecError(
							`Expected the element ${printError(getTag(htmlElement))} to be valid, and it ${printError(
								"isn't valid"
							)}.`
					  )}`
			}`;
			return result;
		},
		negativeCompare: function (htmlElement) {
			checkHtmlElement(htmlElement);
			let result = {};
			const isInvalid = isElementInvalid(htmlElement);
			result.pass = isInvalid;
			result.message = `${
				result.pass
					? `${printSuccess('PASSED')} ${printSecSuccess(
							`Expected the element ${printSuccess(getTag(htmlElement))} not to be valid, and it ${printSuccess(
								"isn't valid"
							)}.`
					  )}`
					: `${printError('FAILED')} ${printSecError(
							`Expected the element ${printError(getTag(htmlElement))} not to be valid, and it ${printError(
								'is valid'
							)}.`
					  )}`
			}`;
			return result;
		},
	};
}
