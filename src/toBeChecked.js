import { checkHtmlElement, getTag } from './utils';
import { printSecWarning, printWarning, printSuccess, printSecSuccess, printError, printSecError } from './printers';

function isValidInput(htmlElement) {
	return getTag(htmlElement) === 'input' && ['checkbox', 'radio'].includes(htmlElement.type);
}

function isChecked(htmlElement) {
	if (isValidInput(htmlElement)) return htmlElement.checked;
	return htmlElement.getAttribute('aria-checked') === 'true';
}

function checkInputTypeOrRole(htmlElement) {
	return (
		['checkbox', 'radio', 'switch'].includes(htmlElement.getAttribute('role')) &&
		['true', 'false'].includes(htmlElement.getAttribute('aria-checked'))
	);
}

export function toBeChecked() {
	return {
		compare: function (htmlElement) {
			checkHtmlElement(htmlElement);
			let result = {};
			const validInput = isValidInput(htmlElement);
			const verifyElement = checkInputTypeOrRole(htmlElement);
			if (!validInput && !verifyElement) {
				result.pass = false;
				result.message = `🤔 ${printSecWarning(
					`Only inputs with type='checkbox/radio' or elements with role='checkbox/radio/switch' and a valid aria-checked attribute can be used with ${printWarning(
						'.toBeChecked'
					)}. Use ${printSuccess(`.toHaveValue()`)} instead.`
				)}`;
				return result;
			}
			const checkedInput = isChecked(htmlElement);
			result.pass = checkedInput;
			result.message = `${
				result.pass
					? `💯 ${printSecSuccess(
							`Expected the element ${printSuccess(
								getTag(htmlElement)
							)} to be checked and it ${printSuccess('is checked')}.`
					  )}`
					: `😨 ${printSecError(
							`Expected the element ${printError(getTag(htmlElement))} ${printError(
								`type="${htmlElement.type}"`
							)} to be checked and it ${printError("isn't checked")}.`
					  )}`
			}`;
			return result;
		},
		negativeCompare: function (htmlElement) {
			checkHtmlElement(htmlElement);
			let result = {};
			const validInput = isValidInput(htmlElement);
			const verifyElement = checkInputTypeOrRole(htmlElement);
			if (!validInput && !verifyElement) {
				result.pass = false;
				result.message = `🤔 ${printSecWarning(
					`Only inputs with type='checkbox/radio' or elements with role='checkbox/radio/switch' and a valid aria-checked attribute can be used with`
				)} ${printWarning(`.toBeChecked()`)}${printSecWarning('. Use')} ${printSuccess(
					`.toHaveValue()`
				)}${printSecWarning(' instead.')}`;
				return result;
			}
			const notCheckedInput = !isChecked(htmlElement);
			result.pass = notCheckedInput;
			result.message = `${
				result.pass
					? `💯 ${printSecSuccess(
							`Expected the element ${printSuccess(
								getTag(htmlElement)
							)} not to be checked and it ${printSuccess("isn't checked")}.`
					  )}`
					: `😨 ${printSecError(
							`Expected the element ${printError(getTag(htmlElement))} ${printError(
								`type="${htmlElement.type}"`
							)} not to be checked and it ${printError('is checked')}.`
					  )}`
			}`;
			return result;
		},
	};
}
