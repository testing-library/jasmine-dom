/**
 * @see https://github.com/testing-library/jest-dom/blob/main/src/__tests__/to-contain-html.js
 */

import { checkHtmlElement } from './utils';
import { printSuccess, printSecSuccess, printSecError, printError, printSecWarning, printWarning } from './printers';

function getNormalizedHtml(container, htmlText) {
	const div = container.ownerDocument.createElement('div');
	div.innerHTML = htmlText;
	return div.innerHTML;
}

export function toContainHTML() {
	return {
		compare(htmlElement, htmlText) {
			checkHtmlElement(htmlElement);

			if (typeof htmlText !== 'string') {
				throw new Error(
					printSecWarning(
						`${printError('FAILED')}.toContainHTML() expects a string value, got ${printWarning(htmlText)}`
					)
				);
			}

			const pass = htmlElement.outerHTML.includes(getNormalizedHtml(htmlElement, htmlText));

			return {
				pass,
				message: pass
					? `${printSuccess('PASSED')} ${printSecSuccess(
							`Expected: ${printSuccess(`'${htmlText}'`)}. Received: ${printSuccess(htmlElement.outerHTML)}`
					  )}`
					: `${printError('FAILED')} ${printSecError(
							`Expected: ${printError(`'${htmlText}'`)}. Received: ${printSuccess(htmlElement.outerHTML)}`
					  )}`,
			};
		},

		negativeCompare(htmlElement, htmlText) {
			checkHtmlElement(htmlElement);

			if (typeof htmlText !== 'string') {
				throw new Error(
					printSecWarning(
						`${printError('FAILED')}.not.toContainHTML() expects a string value, got ${printWarning(htmlText)}`
					)
				);
			}

			const pass = !htmlElement.outerHTML.includes(getNormalizedHtml(htmlElement, htmlText));

			return {
				pass,
				message: pass
					? `${printSuccess('PASSED')} ${printSecSuccess(
							`Expected: ${printError(`'${htmlText}'`)}. Received: ${printSuccess(htmlElement.outerHTML)}`
					  )}`
					: `${printError('FAILED')} ${printSecError(
							`Expected: ${printSuccess(`'${htmlText}'`)}. Received: ${printSuccess(htmlElement.outerHTML)}`
					  )}`,
			};
		},
	};
}
