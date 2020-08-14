import { checkHtmlElement, getTag } from './utils';
import { printSuccess, printSecSuccess, printError, printSecError } from './printers';

const REQUIRED_FORM_TAGS = ['select', 'textarea'];
const REQUIRED_ARIA_FORM_TAGS = ['input', 'select', 'textarea'];
const REQUIRED_UNSUPPORTED_INPUT_TYPES = ['color', 'hidden', 'range', 'submit', 'image', 'reset'];
const REQUIRED_SUPPORTED_ARIA_ROLES = ['combobox', 'gridcell', 'radiogroup', 'spinbutton', 'tree'];

function isRequiredOnSupportedInput(htmlElement) {
	return (
		getTag(htmlElement) === 'input' &&
		htmlElement.hasAttribute('required') &&
		((htmlElement.hasAttribute('type') &&
			!REQUIRED_UNSUPPORTED_INPUT_TYPES.includes(htmlElement.getAttribute('type'))) ||
			!htmlElement.hasAttribute('type'))
	);
}

function isRequiredOnFormTagsExceptInput(htmlElement) {
	return REQUIRED_FORM_TAGS.includes(getTag(htmlElement)) && htmlElement.hasAttribute('required');
}

function isElementRequiredByARIA(htmlElement) {
	return (
		htmlElement.hasAttribute('aria-required') &&
		htmlElement.getAttribute('aria-required') === 'true' &&
		(REQUIRED_ARIA_FORM_TAGS.includes(getTag(htmlElement)) ||
			(htmlElement.hasAttribute('role') && REQUIRED_SUPPORTED_ARIA_ROLES.includes(htmlElement.getAttribute('role'))))
	);
}

export function toBeRequired() {
	return {
		compare: function (htmlElement) {
			checkHtmlElement(htmlElement);
			let result = {};
			const isRequired =
				isRequiredOnFormTagsExceptInput(htmlElement) ||
				isRequiredOnSupportedInput(htmlElement) ||
				isElementRequiredByARIA(htmlElement);
			result.pass = isRequired;
			result.message = `${
				result.pass
					? `${printSuccess('PASSED')} ${printSecSuccess(
							`Expected the provided ${printSuccess(getTag(htmlElement))} element to be required, and it ${printSuccess(
								'is required'
							)}.`
					  )}`
					: `${printError('FAILED')} ${printSecError(
							`Expected the provided ${printError(getTag(htmlElement))} element to be required, and it ${printError(
								"isn't required"
							)}.`
					  )}`
			}`;
			return result;
		},
		negativeCompare: function (htmlElement) {
			checkHtmlElement(htmlElement);
			let result = {};
			const isRequired =
				isRequiredOnFormTagsExceptInput(htmlElement) ||
				isRequiredOnSupportedInput(htmlElement) ||
				isElementRequiredByARIA(htmlElement);
			result.pass = !isRequired;
			result.message = `${
				result.pass
					? `${printSuccess('PASSED')} ${printSecSuccess(
							`Expected the provided ${printSuccess(
								getTag(htmlElement)
							)} element not to be required, and it ${printSuccess("isn't required")}.`
					  )}`
					: `${printError('FAILED')} ${printSecError(
							`Expected the provided ${printError(getTag(htmlElement))} element not to be required, and it ${printError(
								'is required'
							)}.`
					  )}`
			}`;
			return result;
		},
	};
}
