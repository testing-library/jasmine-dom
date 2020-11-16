import { parse } from 'css';
import { checkHtmlElement, getTag, InvalidCSSError } from './utils';
import { printSecSuccess, printSuccess, printSecError, printError } from './printers';

function parseCSS(css, ...args) {
	const ast = parse(`selector { ${css} }`, {
		silent: true,
	}).stylesheet;
	if (ast.parsingErrors && ast.parsingErrors.length > 0) {
		const { reason, line } = ast.parsingErrors[0];
		throw new InvalidCSSError(
			{
				css,
				message: printSecError(`Syntax error parsing expected styles: ${reason} on ${printError(`line ${line}`)}`),
			},
			...args
		);
	}
	const parsedRules = ast.rules[0].declarations
		.filter(declaration => declaration.type === 'declaration')
		.reduce((obj, { property, value }) => Object.assign(obj, { [property]: value }), {});
	return parsedRules;
}

function parseJStoCSS(document, styles) {
	const sandboxElement = document.createElement('div');
	Object.assign(sandboxElement.style, styles);
	return sandboxElement.style.cssText;
}

function getStyleDeclaration(document, css) {
	const styles = {};

	//	The next block is necessary to normalize colors
	const copy = document.createElement('div');
	Object.keys(css).forEach(prop => {
		copy.style[prop] = css[prop];
		styles[prop] = copy.style[prop];
	});

	return styles;
}

function styleIsSubset(styles, computedStyle) {
	return (
		!!Object.keys(styles).length &&
		Object.entries(styles).every(
			([prop, value]) => computedStyle[prop] === value || computedStyle.getPropertyValue(prop.toLowerCase()) === value
		)
	);
}

function getCSStoParse(document, styles) {
	return typeof styles === 'object' ? parseJStoCSS(document, styles) : styles;
}

function printoutStyles(styles) {
	return Object.keys(styles)
		.sort()
		.map(prop => `${prop}: ${styles[prop]};`)
		.join('\n');
}

function expectedStyleDiff(expected, computedStyles) {
	const received = Array.from(computedStyles)
		.filter(prop => expected[prop] !== undefined)
		.reduce(
			(obj, prop) =>
				Object.assign(obj, {
					[prop]: computedStyles.getPropertyValue(prop),
				}),
			{}
		);
	const receivedOutput = printoutStyles(received);
	return receivedOutput;
}

export function toHaveStyle() {
	return {
		compare: function (htmlElement, styles) {
			checkHtmlElement(htmlElement);
			let result = {};
			const cssToParse = getCSStoParse(htmlElement.ownerDocument, styles);
			const parsedCSS = parseCSS(cssToParse);
			const { getComputedStyle } = htmlElement.ownerDocument.defaultView;
			const expected = getStyleDeclaration(htmlElement.ownerDocument, parsedCSS);
			const received = getComputedStyle(htmlElement);
			result.pass = styleIsSubset(expected, received);
			result.message = result.pass
				? `${printSuccess('PASSED')} ${printSecSuccess(
						`Expected the provided ${printSuccess(getTag(htmlElement))} element to have styles:\n${printSuccess(
							styles
						)}\nReceived:\n\n${printSuccess(expectedStyleDiff(expected, received))}`
				  )}`
				: `${printError('FAILED')} ${printSecError(
						`Expected the provided ${printError(getTag(htmlElement))} element to have styles:\n${printError(
							styles
						)}\nReceived:\n\n${printError(expectedStyleDiff(expected, received))}`
				  )}`;
			return result;
		},
		negativeCompare: function (htmlElement, styles) {
			checkHtmlElement(htmlElement);
			let result = {};
			const cssToParse = getCSStoParse(htmlElement.ownerDocument, styles);
			const parsedCSS = parseCSS(cssToParse);
			const { getComputedStyle } = htmlElement.ownerDocument.defaultView;
			const expected = getStyleDeclaration(htmlElement.ownerDocument, parsedCSS);
			const received = getComputedStyle(htmlElement);
			result.pass = !styleIsSubset(expected, received);
			result.message = result.pass
				? `${printSuccess('PASSED')} ${printSecSuccess(
						`Expected the provided ${printSuccess(getTag(htmlElement))} element not to have styles:\n${printSuccess(
							styles
						)}\nReceived:\n\n${printSuccess(expectedStyleDiff(expected, received))}`
				  )}`
				: `${printError('FAILED')} ${printSecError(
						`Expected the provided ${printError(getTag(htmlElement))} element not to have styles:\n${printError(
							styles
						)}\nReceived:\n\n${printError(expectedStyleDiff(expected, received))}`
				  )}`;
			return result;
		},
	};
}
