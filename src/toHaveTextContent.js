import { checkHtmlElement, normalize, matches } from './utils';
import { printError, printSuccess, printSecError, printSecWarning, printSecSuccess } from './printers';

export function toHaveTextContent() {
	return {
		compare: function (
			htmlElement,
			checkWith,
			options = {
				normalizeWhitespace: true,
			}
		) {
			checkHtmlElement(htmlElement);
			let result = {};
			const textContent = options.normalizeWhitespace
				? normalize(htmlElement.textContent)
				: htmlElement.textContent.replace(/\u00a0/g, ' ');
			const checkingWithEmptyString = textContent !== '' && checkWith === '';
			const providedArgs = checkWith !== undefined;
			result.pass = !checkingWithEmptyString && providedArgs && matches(textContent, checkWith);
			result.message =
				checkingWithEmptyString || !providedArgs
					? `🤔 ${printSecWarning(
							`Checking with an empty string will always match. Try using ${printSuccess(
								'.toBeEmptyDOMElement()'
							)}.`
					  )}`
					: result.pass
					? `💯 ${printSecSuccess(
							`Expected ${printSuccess(`'${htmlElement.textContent}'`)} to match ${printSuccess(
								`'${checkWith}'`
							)}.`
					  )}`
					: `😨 ${printSecError(
							`Expected ${printError(`'${htmlElement.textContent}'`)} to match ${printError(
								`'${checkWith}'`
							)}.`
					  )}`;
			return result;
		},
		negativeCompare: function (
			htmlElement,
			checkWith,
			options = {
				normalizeWhitespace: true,
			}
		) {
			checkHtmlElement(htmlElement);
			let result = {};
			const textContent = options.normalizeWhitespace
				? normalize(htmlElement.textContent)
				: htmlElement.textContent.replace(/\u00a0/g, ' ');
			const checkingWithEmptyString = textContent !== '' && checkWith === '';
			const providedArgs = checkWith !== undefined;
			result.pass = !checkingWithEmptyString && providedArgs && !matches(textContent, checkWith);
			result.message =
				checkingWithEmptyString || !providedArgs
					? `🤔 ${printSecWarning(
							`Checking with an empty string will always match. Try using ${printSuccess(
								'.toBeEmptyDOMElement()'
							)}.`
					  )}`
					: result.pass
					? `💯 ${printSecSuccess(
							`Expected ${printSuccess(`'${htmlElement.textContent}'`)} not to match ${printSuccess(
								`'${checkWith}'`
							)}.`
					  )}`
					: `😨 ${printSecError(
							`Expected ${printError(`'${htmlElement.textContent}'`)} not to match ${printError(
								`'${checkWith}'`
							)}.`
					  )}`;
			return result;
		},
	};
}
