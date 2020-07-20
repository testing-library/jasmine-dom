import { isEqual, isEqualWith, uniq } from 'lodash';
import cssEscape from 'css.escape';
import { printError, printSecError, printWarning, printSecWarning } from './printers';

class HtmlElementTypeError extends Error {
	constructor(htmlElement) {
		super();
		this.message = printSecWarning(
			`🤔 Received element must be an HTMLElement or an SVGElement.\nReceived: ${printWarning(htmlElement)}`
		);
	}
}

class InvalidCSSError extends Error {
	constructor(received) {
		super();
		this.message = [received.message, '', printSecError(`Failing CSS:`), printError(received.css)].join('\n');
	}
}

function checkHasWindow(htmlElement, ...args) {
	if (!htmlElement || !htmlElement.ownerDocument || !htmlElement.ownerDocument.defaultView) {
		throw new HtmlElementTypeError(htmlElement);
	}
}

function checkHtmlElement(htmlElement, ...args) {
	checkHasWindow(htmlElement, ...args);
	const window = htmlElement.ownerDocument.defaultView;
	if (!(htmlElement instanceof window.HTMLElement) && !(htmlElement instanceof window.SVGElement)) {
		throw new HtmlElementTypeError(htmlElement);
	}
}

function normalize(text) {
	return text.replace(/\s+/g, ' ').trim();
}

function matches(textToMatch, matcher) {
	if (matcher instanceof RegExp) {
		return matcher.test(textToMatch);
	} else {
		return textToMatch.includes(String(matcher));
	}
}

function getTag(htmlElement) {
	return htmlElement === null ? null : htmlElement.tagName && htmlElement.tagName.toLowerCase();
}

function getInputValue(inputElement) {
	switch (inputElement.type) {
		case 'number':
			return inputElement.value === '' ? null : Number(inputElement.value);

		case 'checkbox':
			return inputElement.checked;

		default:
			return inputElement.value;
	}
}

function getSelectValue({ multiple, options }) {
	const selectedOptions = [...options].filter(option => option.selected);
	if (multiple) {
		return [...selectedOptions].map(option => option.value);
	}
	if (selectedOptions.length === 0) {
		return undefined;
	}
	return selectedOptions[0].value;
}

function getSingleElementValue(htmlElement) {
	if (!htmlElement) {
		return undefined;
	}

	switch (htmlElement.tagName.toLowerCase()) {
		case 'input':
			return getInputValue(htmlElement);

		case 'select':
			return getSelectValue(htmlElement);

		default:
			return htmlElement.value;
	}
}

function compareArraysAsSet(a, b) {
	if (Array.isArray(a) && Array.isArray(b)) {
		return isEqual(new Set(a), new Set(b));
	}
	return undefined;
}

export {
	checkHasWindow,
	checkHtmlElement,
	HtmlElementTypeError,
	InvalidCSSError,
	normalize,
	matches,
	getTag,
	getSingleElementValue,
	compareArraysAsSet,
	isEqualWith,
	cssEscape,
	uniq,
};
