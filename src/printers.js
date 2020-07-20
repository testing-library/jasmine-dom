import chalk from 'chalk';

function printInfo(message) {
	return chalk.cyan(message);
}
function printError(message) {
	return chalk.bgRedBright.black(message);
}

function printSecError(message) {
	return chalk.redBright(message);
}

function printSuccess(message) {
	return chalk.bgGreenBright.black(message);
}

function printSecSuccess(message) {
	return chalk.greenBright(message);
}

function printWarning(message) {
	return chalk.bgYellow.black(message);
}

function printSecWarning(message) {
	return chalk.yellow(message);
}

export { printInfo, printError, printSuccess, printWarning, printSecError, printSecSuccess, printSecWarning };
