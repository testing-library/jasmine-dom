import { checkHtmlElement, getTag } from './utils';
import { printSecSuccess, printSuccess, printSecError, printError, printSecWarning } from './printers';

function getExpectedClassNamesAndOptions(params) {
	const lastParam = params.pop();
	let expectedClassNames, options;

	if (typeof lastParam === 'object') {
		expectedClassNames = params;
		options = lastParam;
	} else {
		expectedClassNames = params.concat(lastParam);
		options = {
			exact: false,
		};
	}

	return {
		expectedClassNames,
		options,
	};
}

function splitClassNames(str) {
	if (!str) {
		return [];
	}

	return str.split(/\s+/).filter(s => s.length > 0);
}

function isSubset(subset, superset) {
	return subset.every(item => superset.includes(item));
}

export function toHaveClassName() {
	return {
		compare: function (htmlElement, ...params) {
			checkHtmlElement(htmlElement);
			let result = {};
			const { expectedClassNames, options } = getExpectedClassNamesAndOptions(params);
			const received = splitClassNames(htmlElement.getAttribute('class'));
			const expected = expectedClassNames.reduce((acc, className) => acc.concat(splitClassNames(className)), []);
			if (options.exact) {
				result.pass = isSubset(expected, received) && expected.length === received.length;
				result.message = result.pass
					? `${printSuccess('PASSED')} ${printSecSuccess(
							`Expected the provided ${printSuccess(getTag(htmlElement))} element to have ${printSuccess(
								'EXACTLY'
							)} defined classes ${printSuccess(`${expected.join(' ')}`)}. Received ${printSuccess(
								`${received.join(' ')}`
							)}.`
					  )}`
					: `${printError('FAILED')} ${printSecError(
							`Expected the provided ${printError(getTag(htmlElement))} element to have ${printError(
								'EXACTLY'
							)} defined classes ${printError(`${expected.join(' ')}`)}. Received ${printError(
								`${received.join(' ')}`
							)}.`
					  )}`;
				return result;
			}
			if (expected.length > 0) {
				result.pass = isSubset(expected, received);
				result.message = result.pass
					? `${printSuccess('PASSED')} ${printSecSuccess(
							` Expected the provided ${printSuccess(getTag(htmlElement))} element to have class ${printSuccess(
								expected.join(' ')
							)}. Received ${printSuccess(received.join(' '))}.`
					  )}`
					: `${printError('FAILED')} ${printSecError(
							` Expected the provided ${printError(getTag(htmlElement))} element to have class ${printError(
								expected.join(' ')
							)}. Received ${printError(received.join(' '))}.`
					  )}`;
			} else {
				result.pass = false;
				result.message = `${printError('FAILED')} ${printSecWarning(`At least one expected class must be provided.`)}`;
			}
			return result;
		},
		negativeCompare: function (htmlElement, ...params) {
			checkHtmlElement(htmlElement);
			let result = {};
			const { expectedClassNames, options } = getExpectedClassNamesAndOptions(params);
			const received = splitClassNames(htmlElement.getAttribute('class'));
			const expected = expectedClassNames.reduce((acc, className) => acc.concat(splitClassNames(className)), []);
			if (options.exact) {
				result.pass = !isSubset(expected, received) || expected.length !== received.length;
				result.message = result.pass
					? `${printSuccess('PASSED')} ${printSecSuccess(
							`Expected the provided ${printSuccess(getTag(htmlElement))} element not to have ${printSuccess(
								'EXACTLY'
							)} defined classes ${printSuccess(`${expected.join(' ')}`)}. Received ${printSuccess(
								`${received.join(' ')}`
							)}.`
					  )}`
					: `${printError('FAILED')} ${printSecError(
							`Expected the provided ${printError(getTag(htmlElement))} element not to have ${printError(
								'EXACTLY'
							)} defined classes ${printError(`${expected.join(' ')}`)}. Received ${printError(
								`${received.join(' ')}`
							)}.`
					  )}`;
				return result;
			}
			if (expected.length > 0) {
				result.pass = !isSubset(expected, received);
				result.message = result.pass
					? `${printSuccess('PASSED')} ${printSecSuccess(
							` Expected the provided ${printSuccess(getTag(htmlElement))} element not to have class ${printSuccess(
								expected.join(' ')
							)}. Received ${printSuccess(received.join(' '))}.`
					  )}`
					: `${printError('FAILED')} ${printSecError(
							` Expected the provided ${printError(getTag(htmlElement))} element not to have class ${printError(
								expected.join(' ')
							)}. Received ${printError(received.join(' '))}.`
					  )}`;
			} else {
				result.pass = received.length === 0;
				result.message = result.pass
					? `${printSuccess('PASSED')} ${printSecSuccess(
							`Expected the element not to have classes ${printSuccess('(any)')}.\nReceived: ${printSuccess(
								received.join(' ')
							)}`
					  )}`
					: `${printError('FAILED')} ${printSecError(
							`Expected the element not to have classes ${printError('(any)')}.\nReceived: ${printError(
								received.join(' ')
							)}`
					  )}`;
			}
			return result;
		},
	};
}
