import document from './jsdom';

export function render(html) {
	const container = document.createElement('div');
	container.innerHTML = html;
	const queryByTestId = testId => {
		return container.querySelector(`[data-testid="${testId}"]`);
	};
	document.body.innerHTML = '';
	document.body.appendChild(container);
	return {
		container,
		queryByTestId,
	};
}
