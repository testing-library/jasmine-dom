import { checkHtmlElement, getTag } from './utils';
import { printError, printSecError, printSuccess, printSecSuccess } from './printers';

const DISABLED_FORM_TAGS = ['fieldset', 'input', 'select', 'optgroup', 'option', 'button', 'textarea'];

function isFirstLegendChildOfFieldset(htmlElement, parentElement) {
	return (
		getTag(htmlElement) === 'legend' &&
		getTag(parentElement) === 'fieldset' &&
		htmlElement.isSameNode(Array.from(parentElement.children).find(child => getTag(child) === 'legend'))
	);
}

function canElementBeDisabled(htmlElement) {
	return DISABLED_FORM_TAGS.includes(getTag(htmlElement));
}

function isElementDisabled(htmlElement) {
	return canElementBeDisabled(htmlElement) && htmlElement.hasAttribute('disabled');
}

function isElementDisabledByParent(htmlElement, parentElement) {
	return isElementDisabled(parentElement) && !isFirstLegendChildOfFieldset(htmlElement, parentElement);
}

function isAncestorDisabled(htmlElement) {
	const parent = htmlElement.parentElement;
	return Boolean(parent) && (isElementDisabledByParent(htmlElement, parent) || isAncestorDisabled(parent));
}

function isElementOrAncestorDisabled(htmlElement) {
	return canElementBeDisabled(htmlElement) && (isElementDisabled(htmlElement) || isAncestorDisabled(htmlElement));
}

export function toBeDisabled() {
	return {
		compare: function (htmlElement) {
			checkHtmlElement(htmlElement);
			let result = {};
			const isDisabled = isElementOrAncestorDisabled(htmlElement);
			result.pass = isDisabled;
			result.message = `${
				result.pass
					? `💯 ${printSecSuccess(
							`Expected the element ${printSuccess(
								getTag(htmlElement)
							)} to be disabled and it ${printSuccess('is disabled')}.`
					  )}`
					: `😨 ${printSecError(
							`Expected the element ${printError(getTag(htmlElement))} to be disabled and it ${printError(
								"isn't disabled"
							)}.`
					  )}`
			}`;
			return result;
		},
		negativeCompare: function (htmlElement) {
			checkHtmlElement(htmlElement);
			let result = {};
			const isNotDisabled = !isElementOrAncestorDisabled(htmlElement);
			result.pass = isNotDisabled;
			result.message = `${
				result.pass
					? `💯 ${printSecSuccess(
							`Expected the element ${printSuccess(
								getTag(htmlElement)
							)} not to be disabled and it ${printSuccess("isn't disabled")}.`
					  )}`
					: `😨 ${printSecError(
							`Expected the element ${printError(
								getTag(htmlElement)
							)} not to be disabled and it ${printError('is disabled')}.`
					  )}`
			}`;
			return result;
		},
	};
}

export function toBeEnabled() {
	return {
		compare: function (htmlElement) {
			checkHtmlElement(htmlElement);
			let result = {};
			const isEnabled = !isElementOrAncestorDisabled(htmlElement);
			result.pass = isEnabled;
			result.message = `${
				result.pass
					? `💯 ${printSecSuccess(
							`Expected the element ${printSuccess(
								getTag(htmlElement)
							)} to be enabled and it ${printSuccess('is enabled')}.`
					  )}`
					: `😨 ${printSecError(
							`Expected the element ${printError(getTag(htmlElement))} to be enabled and it ${printError(
								"isn't enabled"
							)}.`
					  )}`
			}`;
			return result;
		},
		negativeCompare: function (htmlElement) {
			checkHtmlElement(htmlElement);
			let result = {};
			const isEnabled = !isElementOrAncestorDisabled(htmlElement);
			result.pass = !isEnabled;
			result.message = `${
				result.pass
					? `💯 ${printSecSuccess(
							`Expected the element ${printSuccess(
								getTag(htmlElement)
							)} not to be enabled and it ${printSuccess("isn't enabled")}.`
					  )}`
					: `😨 ${printSecError(
							`Expected the element ${printError(
								getTag(htmlElement)
							)} not to be enabled and it ${printError('is enabled')}.`
					  )}`
			}`;
			return result;
		},
	};
}
