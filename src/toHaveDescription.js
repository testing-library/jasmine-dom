import { checkHtmlElement, normalize, getTag } from './utils';
import { printSecSuccess, printSuccess, printSecError, printError } from './printers';

export function toHaveDescription(util) {
	return {
		compare: function (htmlElement, checkWith) {
			checkHtmlElement(htmlElement);
			let result = {};
			let description = '';
			const expectsDescription = checkWith !== undefined;
			const descriptionIDRaw = htmlElement.getAttribute('aria-describedby') || '';
			const descriptionIDs = descriptionIDRaw.split(/\s+/).filter(Boolean);
			if (descriptionIDs.length > 0) {
				const document = htmlElement.ownerDocument;
				const descriptionElements = descriptionIDs
					.map(descriptionID => document.getElementById(descriptionID))
					.filter(Boolean);
				description = normalize(descriptionElements.map(element => element.textContent).join(' '));
			}
			result.pass = expectsDescription
				? checkWith instanceof RegExp
					? checkWith.test(description)
					: util.equals(description, checkWith)
				: Boolean(description);
			checkWith === undefined ? (checkWith = '') : null;
			result.message = result.pass
				? `${printSuccess('PASSED')} ${printSecSuccess(
						`Expected the ${printSuccess(getTag(htmlElement))} element to have description ${printSuccess(
							`'${checkWith}'`
						)}. Received ${printSuccess(`'${description}'`)}.`
				  )}`
				: `${printSuccess('FAILED')} ${printSecError(
						`Expected the ${printError(getTag(htmlElement))} element to have description ${printError(
							`'${checkWith}'`
						)}. Received ${printError(`'${description}'`)}.`
				  )}`;
			return result;
		},
		negativeCompare: function (htmlElement, checkWith) {
			checkHtmlElement(htmlElement);
			let result = {};
			let description = '';
			const expectsNotDescription = checkWith !== undefined;
			const descriptionIDRaw = htmlElement.getAttribute('aria-describedby') || '';
			const descriptionIDs = descriptionIDRaw.split(/\s+/).filter(Boolean);
			if (descriptionIDs.length > 0) {
				const document = htmlElement.ownerDocument;
				const descriptionElements = descriptionIDs
					.map(descriptionID => document.getElementById(descriptionID))
					.filter(Boolean);
				description = normalize(descriptionElements.map(element => element.textContent).join(' '));
			}
			result.pass = expectsNotDescription
				? checkWith instanceof RegExp
					? !checkWith.test(description)
					: !util.equals(description, checkWith)
				: !Boolean(description);
			checkWith === undefined ? (checkWith = '') : null;
			result.message = result.pass
				? `${printSuccess('PASSED')} ${printSecSuccess(
						`Expected the ${printSuccess(getTag(htmlElement))} element not to have description ${printSuccess(
							`'${checkWith}'`
						)}. Received ${printSuccess(`'${description}'`)}.`
				  )}`
				: `${printSuccess('FAILED')} ${printSecError(
						`Expected the ${printError(getTag(htmlElement))} element not to have description ${printError(
							`'${checkWith}'`
						)}. Received ${printError(`'${description}'`)}.`
				  )}`;
			return result;
		},
	};
}
