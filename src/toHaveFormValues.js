import {
	checkHtmlElement,
	getSingleElementValue,
	compareArraysAsSet,
	isEqualWith,
	cssEscape,
	getTag,
	uniq,
} from './utils';
import { printSecWarning, printWarning, printSuccess, printSecSuccess, printSecError, printError } from './printers';

function getMultiElementValue(htmlElements) {
	const types = uniq(htmlElements.map(htmlElement => htmlElement.type));

	if (types.length !== 1) {
		throw new Error(
			printWarning(`${printError('FAILED')} Multiple form elements with the same name must be of the same type`)
		);
	}

	switch (types[0]) {
		case 'radio': {
			const theChosenOne = htmlElements.find(radio => radio.checked);
			return theChosenOne ? theChosenOne.value : undefined;
		}

		case 'checkbox':
			return htmlElements.filter(checkbox => checkbox.checked).map(checkbox => checkbox.value);

		default:
			return htmlElements.map(htmlElement => htmlElement.value);
	}
}

function getFormValue(container, name) {
	const htmlElements = [...container.querySelectorAll(`[name="${cssEscape(name)}"]`)];

	if (htmlElements.length === 0) {
		return undefined;
	}

	switch (htmlElements.length) {
		case 1:
			return getSingleElementValue(htmlElements[0]);

		default:
			return getMultiElementValue(htmlElements);
	}
}

function getPureName(name) {
	return /\[\]$/.test(name) ? name.slice(0, -2) : name;
}

function getAllFormValues(container) {
	const names = Array.from(container.elements).map(htmlElement => htmlElement.name);
	return names.reduce(
		(obj, name) => ({
			...obj,
			[getPureName(name)]: getFormValue(container, name),
		}),
		{}
	);
}

export function toHaveFormValues() {
	return {
		compare: function (formElement, expectedValues) {
			checkHtmlElement(formElement);
			if (!formElement.elements) {
				throw new Error(
					`${printError('FAILED')} ${printSecWarning(
						`.toHaveFormValues() must be called on a ${printWarning('form')} or a ${printWarning('fieldset')} element.`
					)}`
				);
			}
			let result = {};
			const formValues = getAllFormValues(formElement);
			const commonKeyValues = Object.keys(formValues)
				.filter(key => expectedValues.hasOwnProperty(key))
				.reduce((obj, key) => ({ ...obj, [key]: formValues[key] }), {});
			result.pass = Object.entries(expectedValues).every(([name, expectedValue]) =>
				isEqualWith(formValues[name], expectedValue, compareArraysAsSet)
			);
			result.message = result.pass
				? `💯 ${printSecSuccess(
						`Expected the ${printSuccess(getTag(formElement))} to have values: ${printSuccess(
							Object.keys(expectedValues).map(key => `\n${key}: ${expectedValues[key]}`)
						)}.\nValues received for the expected keys: ${printSuccess(
							Object.keys(commonKeyValues).map(key => `\n${key}: ${commonKeyValues[key]}`)
						)}`
				  )}`
				: `${printError('FAILED')} ${printSecError(
						`Expected the ${printError(getTag(formElement))} to have values: ${printError(
							Object.keys(expectedValues).map(key => `\n${key}: ${expectedValues[key]}`)
						)}.\nValues received for the expected keys: ${printError(
							Object.keys(commonKeyValues).map(key => `\n${key}: ${commonKeyValues[key]}`)
						)}`
				  )}`;
			return result;
		},
		negativeCompare: function (formElement, expectedValues) {
			checkHtmlElement(formElement);
			if (!formElement.elements) {
				throw new Error(
					`${printError('FAILED')} ${printSecWarning(
						`.toHaveFormValues() must be called on a ${printWarning('form')} or a ${printWarning('fieldset')} element.`
					)}`
				);
			}
			let result = {};
			const formValues = getAllFormValues(formElement);
			const commonKeyValues = Object.keys(formValues)
				.filter(key => expectedValues.hasOwnProperty(key))
				.reduce((obj, key) => ({ ...obj, [key]: formValues[key] }), {});
			result.pass = Object.entries(expectedValues).every(
				([name, expectedValue]) => !isEqualWith(formValues[name], expectedValue, compareArraysAsSet)
			);
			result.message = result.pass
				? `💯 ${printSecSuccess(
						`Expected the ${printSuccess(getTag(formElement))} not to have values: ${printSuccess(
							Object.keys(expectedValues).map(key => `\n${key}: ${expectedValues[key]}`)
						)}.\nValues received for the expected keys: ${printSuccess(
							Object.keys(commonKeyValues).map(key => `\n${key}: ${commonKeyValues[key]}`)
						)}`
				  )}`
				: `${printError('FAILED')} ${printSecError(
						`Expected the ${printError(getTag(formElement))} not to have values: ${printError(
							Object.keys(expectedValues).map(key => `\n${key}: ${expectedValues[key]}`)
						)}.\nValues received for the expected keys: ${printError(
							Object.keys(commonKeyValues).map(key => `\n${key}: ${commonKeyValues[key]}`)
						)}`
				  )}`;
			return result;
		},
	};
}
