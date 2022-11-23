import { checkHtmlElement, normalize } from './utils';
import { printSecSuccess, printSuccess, printSecError, printError } from './printers';

/**
 * @see aria-errormessage spec https://www.w3.org/TR/wai-aria-1.2/#aria-errormessage
 * @param {jasmine.MatchersUtil} matchersUtil
 */
export function toHaveErrorMessage(matchersUtil) {
	return {
		compare: function (htmlElement, checkWith) {
			checkHtmlElement(htmlElement);

			if (!htmlElement.hasAttribute('aria-invalid') || htmlElement.getAttribute('aria-invalid') === 'false') {
				return {
					pass: false,
					message: pass
						? `${printSuccess('PASSED')} ${printSecSuccess(
								`Expected the element to have invalid state indicated by\n${printSuccess(
									`aria-invalid="true"`
								)}\nReceived\n${printSuccess(
									htmlElement.hasAttribute('aria-invalid')
										? `aria-invalid="${htmlElement.getAttribute('aria-invalid')}"`
										: `''`
								)}`
						  )}`
						: `${printError('FAILED')} ${printSecError(
								`Expected the element to have invalid state indicated by\n${printError(
									`aria-invalid="true"`
								)}\nReceived\n${printSuccess(
									htmlElement.hasAttribute('aria-invalid')
										? `aria-invalid="${htmlElement.getAttribute('aria-invalid')}"`
										: `''`
								)}`
						  )}`,
				};
			}

			const expectsErrorMessage = checkWith !== undefined;

			const errormessageIDRaw = htmlElement.getAttribute('aria-errormessage') || '';
			const errormessageIDs = errormessageIDRaw.split(/\s+/).filter(Boolean);

			let errormessage = '';
			if (errormessageIDs.length > 0) {
				const document = htmlElement.ownerDocument;

				const errormessageEls = errormessageIDs
					.map(errormessageID => document.getElementById(errormessageID))
					.filter(Boolean);

				errormessage = normalize(errormessageEls.map(el => el.textContent).join(' '));
			}

			const pass = expectsErrorMessage
				? checkWith instanceof RegExp
					? checkWith.test(errormessage)
					: matchersUtil.equals(errormessage, checkWith)
				: Boolean(errormessage);

			return {
				pass,
				message: pass
					? `${printSuccess('PASSED')} ${printSecSuccess(
							`Expected the element to have error message\n${printSuccess(checkWith)}\nReceived\n${printSuccess(
								errormessage
							)}`
					  )}`
					: `${printError('FAILED')} ${printSecError(
							`Expected the element to have error message\n${printError(checkWith)}\nReceived\n${printSuccess(
								errormessage
							)}`
					  )}`,
			};
		},
	};
}
