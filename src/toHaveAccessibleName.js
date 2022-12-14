import { computeAccessibleName } from 'dom-accessibility-api';
import { checkHtmlElement } from './utils';
import { printSuccess, printSecSuccess, printSecError, printError } from './printers';

/**
 * @param {jasmine.MatchersUtil} matchersUtil
 */
export function toHaveAccessibleName(matchersUtil) {
	return {
		compare: function (htmlElement, expectedAccessibleName) {
			checkHtmlElement(htmlElement);
			const actualAccessibleName = computeAccessibleName(htmlElement);
			const missingExpectedValue = arguments.length === 1;

			let pass = false;
			if (missingExpectedValue) {
				// When called without an expected value we only want to validate that the element has an
				// accessible name, whatever it may be.
				pass = actualAccessibleName !== '';
			} else {
				pass =
					expectedAccessibleName instanceof RegExp
						? expectedAccessibleName.test(actualAccessibleName)
						: matchersUtil.equals(actualAccessibleName, expectedAccessibleName);
			}

			return {
				pass,
				message: pass
					? `${printSuccess('PASSED')} ${printSecSuccess(
							`Expected element to have accessible name:\n${printSuccess(
								String(expectedAccessibleName)
							)}\nReceived:\n${printSuccess(actualAccessibleName)}`
					  )}`
					: `${printError('FAILED')} ${printSecError(
							`Expected element to have accessible name:\n${printError(
								String(expectedAccessibleName)
							)}\nReceived:\n${printSuccess(actualAccessibleName)}`
					  )}`,
			};
		},
	};
}
