import { checkHtmlElement, getTag } from './utils';
import { printSuccess, printSecSuccess, printError, printSecError, printSecWarning, printWarning } from './printers';

function isStyleVisible(htmlElement) {
	const { getComputedStyle } = htmlElement.ownerDocument.defaultView;
	const { display, visibility, opacity } = getComputedStyle(htmlElement);
	return (
		display !== 'none' && visibility !== 'hidden' && visibility !== 'collapse' && opacity !== '0' && opacity !== 0
	);
}

function isAttributeVisible(htmlElement, previousElement) {
	return (
		!htmlElement.hasAttribute('hidden') &&
		(htmlElement.nodeName === 'DETAILS' && previousElement.nodeName !== 'SUMMARY'
			? htmlElement.hasAttribute('open')
			: true)
	);
}

function isElementVisible(htmlElement, previousElement) {
	return (
		isStyleVisible(htmlElement) &&
		isAttributeVisible(htmlElement, previousElement) &&
		(!htmlElement.parentElement || isElementVisible(htmlElement.parentElement, htmlElement))
	);
}

export function toBeVisible() {
	return {
		compare: function (htmlElement) {
			checkHtmlElement(htmlElement);
			let result = {};
			const isVisible = isElementVisible(htmlElement);
			result.pass = isVisible;
			result.message = `${
				result.pass
					? `💯 ${printSecSuccess(
							`Expected the provided ${printSuccess(
								getTag(htmlElement)
							)} element to be visible and it ${printSuccess('is visible')}.`
					  )}`
					: `😨 ${printSecError(
							`Expected the provided ${printError(
								getTag(htmlElement)
							)} element to be visible and it ${printError("isn't visible")}.`
					  )} \n🤔 ${printSecWarning(
							`Take a look at the ${printWarning('display')}, ${printWarning(
								'visibility'
							)} and ${printWarning(
								'opacity'
							)} CSS properties of the provided element and the elements up on to the top of the DOM tree.`
					  )}`
			}`;
			return result;
		},
		negativeCompare: function (htmlElement) {
			checkHtmlElement(htmlElement);
			let result = {};
			const isVisible = isElementVisible(htmlElement);
			result.pass = !isVisible;
			result.message = `${
				result.pass
					? `💯 ${printSecSuccess(
							`Expected the provided ${printSuccess(
								getTag(htmlElement)
							)} element not to be visible and it ${printSuccess("isn't visible")}.`
					  )}`
					: `😨 ${printSecError(
							`Expected the provided ${printError(
								getTag(htmlElement)
							)} element not to be visible and it ${printError('is visible')}.`
					  )} \n🤔 ${printSecWarning(
							`Take a look at the ${printWarning('display')}, ${printWarning(
								'visibility'
							)} and ${printWarning(
								'opacity'
							)} CSS properties of the provided element and the elements up on to the top of the DOM tree.`
					  )}`
			}`;
			return result;
		},
	};
}
