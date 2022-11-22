import { computeAccessibleDescription } from 'dom-accessibility-api';
import { checkHtmlElement } from './utils';
import { printSuccess, printSecSuccess, printSecError, printError } from './printers';

/**
 * @param {jasmine.MatchersUtil} matchersUtil
 */
export function toHaveAccessibleDescription(matchersUtil) {
	return {
		/**
		 * @param {Element} htmlElement
		 * @param {RegExp | string | jasmine.AsymmetricMatcher<string>} expectedAccessibleDescription
		 */
		compare: function (htmlElement, expectedAccessibleDescription) {
			checkHtmlElement(htmlElement);

			const actualAccessibleDescription = computeAccessibleDescription(htmlElement);
			const missingExpectedValue = arguments.length === 1;

			let pass = false;
			if (missingExpectedValue) {
				// When called without an expected value we only want to validate that the element has an
				// accessible description, whatever it may be.
				pass = actualAccessibleDescription !== '';
			} else {
				pass =
					expectedAccessibleDescription instanceof RegExp
						? expectedAccessibleDescription.test(actualAccessibleDescription)
						: matchersUtil.equals(actualAccessibleDescription, expectedAccessibleDescription);
			}

			return {
				pass,
				message: pass
					? `${printSuccess('PASSED')} ${printSecSuccess(
							`Expected element to have accessible description:\n${printSuccess(
								String(expectedAccessibleDescription)
							)}\nReceived:\n${printSuccess(actualAccessibleDescription)}`
					  )}`
					: `${printError('FAILED')} ${printSecError(
							`Expected element to have accessible description:\n${printError(
								String(expectedAccessibleDescription)
							)}\nReceived:\n${printSuccess(actualAccessibleDescription)}`
					  )}`,
			};
		},
	};
}
