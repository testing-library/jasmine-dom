import { render } from './helpers/renderer';
import { toHaveClassName } from '../toHaveClassName';

describe('.toHaveClassName', () => {
	const { compare, negativeCompare } = toHaveClassName();
	const { queryByTestId } = render(`
    <div>
      <button data-testid="delete-button" class="btn extra btn-danger">
        Delete item
      </button>
      <button data-testid="cancel-button">
        Cancel
      </button>
      <svg data-testid="svg-spinner" class="spinner clockwise">
        <path />
      </svg>
      <div data-testid="only-one-class" class="alone"></div>
      <div data-testid="no-classes"></div>
    </div>
  `);
	const deleteButton = queryByTestId('delete-button');
	const cancelButton = queryByTestId('cancel-button');
	const svgSpinner = queryByTestId('svg-spinner');
	const oneClass = queryByTestId('only-one-class');
	const noClasses = queryByTestId('no-classes');

	describe('without exact mode', () => {
		it('positive test cases', () => {
			expect(deleteButton).toHaveClassName('btn');
			expect(deleteButton).toHaveClassName('btn-danger');
			expect(deleteButton).toHaveClassName('extra');
			expect(deleteButton).not.toHaveClassName('xtra');
			expect(deleteButton).not.toHaveClassName('btn xtra');
			expect(deleteButton).not.toHaveClassName('btn', 'xtra');
			expect(deleteButton).not.toHaveClassName('btn', 'extra xtra');
			expect(deleteButton).toHaveClassName('btn btn-danger');
			expect(deleteButton).toHaveClassName('btn', 'btn-danger');
			expect(deleteButton).toHaveClassName('btn extra', 'btn-danger extra');
			expect(deleteButton).not.toHaveClassName('btn-link');
			expect(cancelButton).not.toHaveClassName('btn-danger');
			expect(svgSpinner).toHaveClassName('spinner');
			expect(svgSpinner).toHaveClassName('clockwise');
			expect(svgSpinner).not.toHaveClassName('wise');
			expect(noClasses).not.toHaveClassName();
			expect(noClasses).not.toHaveClassName(' ');
		});

		it('negative test cases', () => {
			const { message: negativeDeleteBtnMessage, pass: negativeDeleteBtnPass } = negativeCompare(
				deleteButton,
				'btn'
			);
			const { message: negativeDeleteBtnDangerMessage, pass: negativeDeleteBtnDangerPass } = negativeCompare(
				deleteButton,
				'btn-danger'
			);
			const { message: negativeDeleteExtraMessage, pass: negativeDeleteExtraPass } = negativeCompare(
				deleteButton,
				'extra'
			);
			const { message: positiveDeleteXtraMessage, pass: positiveDeleteXtraPass } = compare(deleteButton, 'xtra');
			const { message: positiveDeleteBtnExtraXtraMessage, pass: positiveDeleteBtnExtraXtraPass } = compare(
				deleteButton,
				'btn',
				'extra xtra'
			);
			const {
				message: negativeDeleteBtnBtnDangerMessage,
				pass: negativeDeleteBtnBtnDangerPass,
			} = negativeCompare(deleteButton, 'btn btn-danger');
			const {
				message: negativeDeleteBtnAndBtnDangerMessage,
				pass: negativeDeleteBtnAndBtnDangerPass,
			} = negativeCompare(deleteButton, 'btn', 'btn-danger');
			const { message: positiveDeleteBtnLinkMessage, pass: positiveDeleteBtnLinkPass } = compare(
				deleteButton,
				'btn-link'
			);
			const { message: positiveCancelBtnDangerMessage, pass: positiveCancelBtnDangerPass } = compare(
				cancelButton,
				'btn-danger'
			);
			const { message: negativeSvgSpinnerMessage, pass: negativeSvgSpinnerPass } = negativeCompare(
				svgSpinner,
				'spinner'
			);
			const { message: positiveSvgWiseMessage, pass: positiveSvgWisePass } = compare(svgSpinner, 'wise');
			const { message: positiveDeleteNullMessage, pass: positiveDeleteNullPass } = compare(deleteButton);
			const { message: positiveDeleteEmptyMessage, pass: positiveDeleteEmptyPass } = compare(deleteButton, '');
			const { message: positiveNoClassesMessage, pass: positiveNoClassesPass } = compare(noClasses);
			const { message: negativeDeleteNullMessage, pass: negativeDeleteNullPass } = negativeCompare(deleteButton);
			const { message: negativeDeleteWhitespaceMessage, pass: negativeDeleteWhitespacePass } = negativeCompare(
				deleteButton,
				'  '
			);

			expect(negativeDeleteBtnPass).toBeFalse();
			expect(negativeDeleteBtnMessage).toMatch(/Expected.*not to have class/);
			expect(negativeDeleteBtnDangerPass).toBeFalse();
			expect(negativeDeleteBtnDangerMessage).toMatch(/Expected.*not to have class/);
			expect(negativeDeleteExtraPass).toBeFalse();
			expect(negativeDeleteExtraMessage).toMatch(/Expected.*not to have class/);
			expect(positiveDeleteXtraPass).toBeFalse();
			expect(positiveDeleteXtraMessage).toMatch(/Expected.*to have class/);
			expect(positiveDeleteBtnExtraXtraPass).toBeFalse();
			expect(positiveDeleteBtnExtraXtraMessage).toMatch(/Expected.*to have class/);
			expect(negativeDeleteBtnBtnDangerPass).toBeFalse();
			expect(negativeDeleteBtnBtnDangerMessage).toMatch(/Expected.*not to have class/);
			expect(negativeDeleteBtnAndBtnDangerPass).toBeFalse();
			expect(negativeDeleteBtnAndBtnDangerMessage).toMatch(/Expected.*not to have class/);
			expect(positiveDeleteBtnLinkPass).toBeFalse();
			expect(positiveDeleteBtnLinkMessage).toMatch(/Expected.*to have class/);
			expect(positiveCancelBtnDangerPass).toBeFalse();
			expect(positiveCancelBtnDangerMessage).toMatch(/Expected.*to have class/);
			expect(negativeSvgSpinnerPass).toBeFalse();
			expect(negativeSvgSpinnerMessage).toMatch(/Expected.*not to have class/);
			expect(positiveSvgWisePass).toBeFalse();
			expect(positiveSvgWiseMessage).toMatch(/Expected.*to have class/);
			expect(positiveDeleteNullPass).toBeFalse();
			expect(positiveDeleteNullMessage).toMatch(/At least one expected class must be provided/);
			expect(positiveDeleteEmptyPass).toBeFalse();
			expect(positiveDeleteEmptyMessage).toMatch(/At least one expected class must be provided/);
			expect(positiveNoClassesPass).toBeFalse();
			expect(positiveNoClassesMessage).toMatch(/At least one expected class must be provided/);
			expect(negativeDeleteNullPass).toBeFalse();
			expect(negativeDeleteNullMessage).toMatch(/Expected.*not to have classes/);
			expect(negativeDeleteWhitespacePass).toBeFalse();
			expect(negativeDeleteWhitespaceMessage).toMatch(/Expected.*not to have classes/);
		});
	});

	describe('with exact mode', () => {
		it('positive test cases', () => {
			expect(deleteButton).toHaveClassName('btn extra btn-danger', {
				exact: true,
			});
			expect(deleteButton).not.toHaveClassName('btn extra', {
				exact: true,
			});
			expect(deleteButton).not.toHaveClassName('btn extra btn-danger foo bar', {
				exact: true,
			});
			expect(deleteButton).toHaveClassName('btn extra btn-danger', {
				exact: false,
			});
			expect(deleteButton).toHaveClassName('btn extra', {
				exact: false,
			});
			expect(deleteButton).not.toHaveClassName('btn extra btn-danger foo bar', {
				exact: false,
			});
			expect(deleteButton).toHaveClassName('btn', 'extra', 'btn-danger', {
				exact: true,
			});
			expect(deleteButton).not.toHaveClassName('btn', 'extra', {
				exact: true,
			});
			expect(deleteButton).not.toHaveClassName('btn', 'extra', 'btn-danger', 'foo', 'bar', {
				exact: true,
			});
			expect(deleteButton).toHaveClassName('btn', 'extra', 'btn-danger', {
				exact: false,
			});
			expect(deleteButton).toHaveClassName('btn', 'extra', {
				exact: false,
			});
			expect(deleteButton).not.toHaveClassName('btn', 'extra', 'btn-danger', 'foo', 'bar', {
				exact: false,
			});
			expect(oneClass).toHaveClassName('alone', {
				exact: true,
			});
			expect(oneClass).not.toHaveClassName('alone foo', {
				exact: true,
			});
			expect(oneClass).not.toHaveClassName('alone', 'foo', {
				exact: true,
			});
			expect(oneClass).toHaveClassName('alone', {
				exact: false,
			});
			expect(oneClass).not.toHaveClassName('alone foo', {
				exact: false,
			});
			expect(oneClass).not.toHaveClassName('alone', 'foo', {
				exact: false,
			});
		});

		it('negative test cases', () => {
			const { message: negativeAloneExactMessage, pass: negativeAloneExactPass } = negativeCompare(
				oneClass,
				'alone',
				{
					exact: true,
				}
			);
			const { message: positiveAloneFooExactMessage, pass: positiveAloneFooExactPass } = compare(
				oneClass,
				'alone',
				'foo',
				{
					exact: true,
				}
			);

			expect(negativeAloneExactPass).toBeFalse();
			expect(negativeAloneExactMessage).toMatch(/Expected.*not to have.*EXACTLY.*defined classes/);
			expect(positiveAloneFooExactPass).toBeFalse();
			expect(positiveAloneFooExactMessage).toMatch(/Expected.*to have.*EXACTLY.*defined classes/);
		});
	});
});
