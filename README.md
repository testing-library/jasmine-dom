<div align="center">
<h1>jasmine-dom</h1>

<a href="https://www.joypixels.com/profiles/emoji/sloth/_/5.0">
  <img
    height="80"
    width="80"
    alt="sloth"
    src="https://github.com/testing-library/jasmine-dom/blob/master/other/sloth.png?raw=true"  
  >
</a>

<p>Custom Jasmine matchers to test the state of the DOM</p>

</div>

---

[![Build Status][build-badge]][build]
[![Code Coverage][coverage-badge]][coverage]
[![semantic-release][semantic-release-badge]][semantic-release]
[![version][version-badge]][package]
[![downloads][downloads-badge]][npmtrends]
[![MIT License][license-badge]][license]

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors][all-contributors-badge]](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->
[![PRs Welcome][prs-badge]][prs]
[![Code of Conduct][coc-badge]][coc]
[![Discord][discord-badge]][discord]

[![Watch on GitHub][github-watch-badge]][github-watch]
[![Star on GitHub][github-star-badge]][github-star]
[![Tweet][twitter-badge]][twitter]

## The problem

You want to use [Jasmine][jasmine] to write tests that assert various things about the state of the DOM. As part of that goal, you want to avoid all the repetitive patterns that arise in doing so. Checking for an element's attributes, its text content, its css classes, you name it.

## This solution

The `jasmine-dom` library provides a set of custom Jasmine matchers that you can use to extend Jasmine. These will make your tests more declarative, clear to read and to maintain.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Custom matchers](#custom-matchers)
  - [`toBeDisabled`](#tobedisabled)
  - [`toBeEnabled`](#tobeenabled)
  - [`toBeEmptyDOMElement`](#tobeemptydomelement)
  - [`toBeInTheDocument`](#tobeinthedocument)
  - [`toBeInvalid`](#tobeinvalid)
  - [`toBeRequired`](#toberequired)
  - [`toBeValid`](#tobevalid)
  - [`toBeVisible`](#tobevisible)
  - [`toContainElement`](#tocontainelement)
  - [`toHaveAttribute`](#tohaveattribute)
  - [`toHaveClassName`](#tohaveclassname)
  - [`toHaveFocus`](#tohavefocus)
  - [`toHaveFormValues`](#tohaveformvalues)
  - [`toHaveStyle`](#tohavestyle)
  - [`toHaveTextContent`](#tohavetextcontent)
  - [`toHaveValue`](#tohavevalue)
  - [`toHaveDisplayValue`](#tohavedisplayvalue)
  - [`toBeChecked`](#tobechecked)
  - [`toBePartiallyChecked`](#tobepartiallychecked)
  - [`toHaveDescription`](#tohavedescription)
- [Inspiration](#inspiration)
- [Other Solutions](#other-solutions)
- [Guiding Principles](#guiding-principles)
- [Contributors](#contributors)
- [LICENSE](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installation

This module is distributed via [npm][npm] which is bundled with [node][node] and should be installed as one of your project's `devDependencies`.

Using npm:

```
npm install --save-dev @testing-library/jasmine-dom
```

or for installation using [yarn][yarn] package manager:

```
yarn add --dev @testing-library/jasmine-dom
```

## Usage

You should have a directory for helpers specified inside the helpers array in your `jasmine.json` file.
Example:

```json
{
	"spec_dir": "src/__tests__",
	"spec_files": ["**/*.test.js"],
	"helpers": ["helpers/**/*.js"],
	"stopSpecOnExpectationFailure": false,
	"random": false
}
```

Make a new file inside that directory, import @testing-library/jasmine-dom and add the matchers like so:

```javascript
import JasmineDOM from '@testing-library/jasmine-dom';

beforeAll(() => {
	jasmine.getEnv().addMatchers(JasmineDOM);
});
```

That's it! You're good to go.

## Matchers

This library is meant to be a Jasmine version of `@testing-library/jest-dom` library. As such, it provides the same set of matchers and the same functionality for each one, with a couple of minor diferences:
- toBeEmpty() is not included, in favor of toBeEmptyDOMElement()
- toBeInTheDOM() is not included, since it's deprecated
- toContainHTML() is not included
- toHaveClass() is renamed to toHaveClassName() to prevent name collision with Jasmine's toHaveClass()

### `toBeDisabled`

```typescript
toBeDisabled()
```

This allows you to check whether an element is disabled from the user's
perspective.

It matches if the element is a form control and the `disabled` attribute is
specified on this element or the element is a descendant of a form element with
a `disabled` attribute.

According to the specification, the following elements can be
[actually disabled](https://html.spec.whatwg.org/multipage/semantics-other.html#disabled-elements):
`button`, `input`, `select`, `textarea`, `optgroup`, `option`, `fieldset`.

#### Examples

```html
<button data-testid="button" type="submit" disabled>submit</button>
<fieldset disabled><input type="text" data-testid="input" /></fieldset>
<a href="..." disabled>link</a>
```

```javascript
expect(getByTestId('button')).toBeDisabled()
expect(getByTestId('input')).toBeDisabled()
expect(getByText('link')).not.toBeDisabled()
```

<hr />

### `toBeEnabled`

```typescript
toBeEnabled()
```

This allows you to check whether an element is not disabled from the user's
perspective.

It works like `not.toBeDisabled()`. Use this matcher to avoid double negation in
your tests.

<hr />

### `toBeEmptyDOMElement`

```typescript
toBeEmptyDOMElement()
```

This allows you to assert whether an element has content or not.

#### Examples

```html
<span data-testid="not-empty"><span data-testid="empty"></span></span>
```

```javascript
expect(getByTestId('empty')).toBeEmptyDOMElement()
expect(getByTestId('not-empty')).not.toBeEmptyDOMElement()
```

<hr />

### `toBeInTheDocument`

```typescript
toBeInTheDocument()
```

This allows you to assert whether an element is present in the document or not.

#### Examples

```html
<span data-testid="html-element"><span>Html Element</span></span>
<svg data-testid="svg-element"></svg>
```

```javascript
expect(
  getByTestId(document.documentElement, 'html-element'),
).toBeInTheDocument()
expect(
  getByTestId(document.documentElement, 'svg-element'),
).toBeInTheDocument()
expect(
  queryByTestId(document.documentElement, 'does-not-exist'),
).not.toBeInTheDocument()
```

> Note: This matcher does not find detached elements. The element must be added
> to the document to be found by toBeInTheDocument. If you desire to search in a
> detached element please use: [`toContainElement`](#tocontainelement)

<hr />

### `toBeInvalid`

```typescript
toBeInvalid()
```

This allows you to check if an element, is currently invalid.

An element is invalid if it has an
[`aria-invalid` attribute](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-invalid_attribute)
with no value or a value of `"true"`, or if the result of
[`checkValidity()`](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5/Constraint_validation)
is `false`.

#### Examples

```html
<input data-testid="no-aria-invalid" />
<input data-testid="aria-invalid" aria-invalid />
<input data-testid="aria-invalid-value" aria-invalid="true" />
<input data-testid="aria-invalid-false" aria-invalid="false" />

<form data-testid="valid-form">
  <input />
</form>

<form data-testid="invalid-form">
  <input required />
</form>
```

```javascript
expect(getByTestId('no-aria-invalid')).not.toBeInvalid()
expect(getByTestId('aria-invalid')).toBeInvalid()
expect(getByTestId('aria-invalid-value')).toBeInvalid()
expect(getByTestId('aria-invalid-false')).not.toBeInvalid()

expect(getByTestId('valid-form')).not.toBeInvalid()
expect(getByTestId('invalid-form')).toBeInvalid()
```

<hr />

### `toBeRequired`

```typescript
toBeRequired()
```

This allows you to check if a form element is currently required.

An element is required if it is having a `required` or `aria-required="true"`
attribute.

#### Examples

```html
<input data-testid="required-input" required />
<input data-testid="aria-required-input" aria-required="true" />
<input data-testid="conflicted-input" required aria-required="false" />
<input data-testid="aria-not-required-input" aria-required="false" />
<input data-testid="optional-input" />
<input data-testid="unsupported-type" type="image" required />
<select data-testid="select" required></select>
<textarea data-testid="textarea" required></textarea>
<div data-testid="supported-role" role="tree" required></div>
<div data-testid="supported-role-aria" role="tree" aria-required="true"></div>
```

```javascript
expect(getByTestId('required-input')).toBeRequired()
expect(getByTestId('aria-required-input')).toBeRequired()
expect(getByTestId('conflicted-input')).toBeRequired()
expect(getByTestId('aria-not-required-input')).not.toBeRequired()
expect(getByTestId('optional-input')).not.toBeRequired()
expect(getByTestId('unsupported-type')).not.toBeRequired()
expect(getByTestId('select')).toBeRequired()
expect(getByTestId('textarea')).toBeRequired()
expect(getByTestId('supported-role')).not.toBeRequired()
expect(getByTestId('supported-role-aria')).toBeRequired()
```

<hr />

### `toBeValid`

```typescript
toBeValid()
```

This allows you to check if the value of an element, is currently valid.

An element is valid if it has no
[`aria-invalid` attribute](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-invalid_attribute)s
or an attribute value of `"false"`. The result of
[`checkValidity()`](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5/Constraint_validation)
must also be `true` if it's a form element.

#### Examples

```html
<input data-testid="no-aria-invalid" />
<input data-testid="aria-invalid" aria-invalid />
<input data-testid="aria-invalid-value" aria-invalid="true" />
<input data-testid="aria-invalid-false" aria-invalid="false" />

<form data-testid="valid-form">
  <input />
</form>

<form data-testid="invalid-form">
  <input required />
</form>
```

```javascript
expect(getByTestId('no-aria-invalid')).toBeValid()
expect(getByTestId('aria-invalid')).not.toBeValid()
expect(getByTestId('aria-invalid-value')).not.toBeValid()
expect(getByTestId('aria-invalid-false')).toBeValid()

expect(getByTestId('valid-form')).toBeValid()
expect(getByTestId('invalid-form')).not.toBeValid()
```

<hr />

### `toBeVisible`

```typescript
toBeVisible()
```

This allows you to check if an element is currently visible to the user.

An element is visible if **all** the following conditions are met:

- it does not have its css property `display` set to `none`
- it does not have its css property `visibility` set to either `hidden` or
  `collapse`
- it does not have its css property `opacity` set to `0`
- its parent element is also visible (and so on up to the top of the DOM tree)
- it does not have the
  [`hidden`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/hidden)
  attribute
- if `<details />` it has the `open` attribute

#### Examples

```html
<div data-testid="zero-opacity" style="opacity: 0">Zero Opacity Example</div>
<div data-testid="visibility-hidden" style="visibility: hidden">
  Visibility Hidden Example
</div>
<div data-testid="display-none" style="display: none">Display None Example</div>
<div style="opacity: 0">
  <span data-testid="hidden-parent">Hidden Parent Example</span>
</div>
<div data-testid="visible">Visible Example</div>
<div data-testid="hidden-attribute" hidden>Hidden Attribute Example</div>
```

```javascript
expect(getByText('Zero Opacity Example')).not.toBeVisible()
expect(getByText('Visibility Hidden Example')).not.toBeVisible()
expect(getByText('Display None Example')).not.toBeVisible()
expect(getByText('Hidden Parent Example')).not.toBeVisible()
expect(getByText('Visible Example')).toBeVisible()
expect(getByText('Hidden Attribute Example')).not.toBeVisible()
```

<hr />

### `toContainElement`

```typescript
toContainElement(element: HTMLElement | SVGElement | null)
```

This allows you to assert whether an element contains another element as a
descendant or not.

#### Examples

```html
<span data-testid="ancestor"><span data-testid="descendant"></span></span>
```

```javascript
const ancestor = getByTestId('ancestor')
const descendant = getByTestId('descendant')
const nonExistantElement = getByTestId('does-not-exist')

expect(ancestor).toContainElement(descendant)
expect(descendant).not.toContainElement(ancestor)
expect(ancestor).not.toContainElement(nonExistantElement)
```

<hr />

### `toHaveAttribute`

```typescript
toHaveAttribute(attr: string, value?: any)
```

This allows you to check whether the given element has an attribute or not. You
can also optionally check that the attribute has a specific expected value or
partial match using a RegExp.

#### Examples

```html
<button data-testid="ok-button" type="submit" disabled>ok</button>
```

```javascript
const button = getByTestId('ok-button')

expect(button).toHaveAttribute('disabled')
expect(button).toHaveAttribute('type', 'submit')
expect(button).not.toHaveAttribute('type', 'button')

expect(button).toHaveAttribute('type', /sub/))
expect(button).toHaveAttribute('type', /but/))
```

<hr />

### `toHaveClassName`

```typescript
toHaveClassName(...classNames: string[], options?: {exact: boolean})
```

This allows you to check whether the given element has certain classes within
its `class` attribute.

You must provide at least one class, unless you are asserting that an element
does not have any classes.

#### Examples

```html
<button data-testid="delete-button" class="btn extra btn-danger">
  Delete item
</button>
<button data-testid="no-classes">No Classes</button>
```

```javascript
const deleteButton = getByTestId('delete-button')
const noClasses = getByTestId('no-classes')

expect(deleteButton).toHaveClassName('extra')
expect(deleteButton).toHaveClassName('btn-danger btn')
expect(deleteButton).toHaveClassName('btn-danger', 'btn')
expect(deleteButton).not.toHaveClassName('btn-link')

expect(deleteButton).toHaveClassName('btn-danger extra btn', {exact: true}) // to check if the element has EXACTLY a set of classes
expect(deleteButton).not.toHaveClassName('btn-danger extra', {exact: true}) // if it has more than expected it is going to fail

expect(noClasses).not.toHaveClassName()
```

<hr />

### `toHaveFocus`

```typescript
toHaveFocus()
```

This allows you to assert whether an element has focus or not.

#### Examples

```html
<div><input type="text" data-testid="element-to-focus" /></div>
```

```javascript
const input = getByTestId('element-to-focus')

input.focus()
expect(input).toHaveFocus()

input.blur()
expect(input).not.toHaveFocus()
```

<hr />

### `toHaveFormValues`

```typescript
toHaveFormValues(expectedValues: {
  [name: string]: any
})
```

This allows you to check if a form or fieldset contains form controls for each
given name, and having the specified value.

> It is important to stress that this matcher can only be invoked on a [form][]
> or a [fieldset][] element.
>
> This allows it to take advantage of the [.elements][] property in `form` and
> `fieldset` to reliably fetch all form controls within them.
>
> This also avoids the possibility that users provide a container that contains
> more than one `form`, thereby intermixing form controls that are not related,
> and could even conflict with one another.

This matcher abstracts away the particularities with which a form control value
is obtained depending on the type of form control. For instance, `<input>`
elements have a `value` attribute, but `<select>` elements do not. Here's a list
of all cases covered:

- `<input type="number">` elements return the value as a **number**, instead of
  a string.
- `<input type="checkbox">` elements:
  - if there's a single one with the given `name` attribute, it is treated as a
    **boolean**, returning `true` if the checkbox is checked, `false` if
    unchecked.
  - if there's more than one checkbox with the same `name` attribute, they are
    all treated collectively as a single form control, which returns the value
    as an **array** containing all the values of the selected checkboxes in the
    collection.
- `<input type="radio">` elements are all grouped by the `name` attribute, and
  such a group treated as a single form control. This form control returns the
  value as a **string** corresponding to the `value` attribute of the selected
  radio button within the group.
- `<input type="text">` elements return the value as a **string**. This also
  applies to `<input>` elements having any other possible `type` attribute
  that's not explicitly covered in different rules above (e.g. `search`,
  `email`, `date`, `password`, `hidden`, etc.)
- `<select>` elements without the `multiple` attribute return the value as a
  **string** corresponding to the `value` attribute of the selected `option`, or
  `undefined` if there's no selected option.
- `<select multiple>` elements return the value as an **array** containing all
  the values of the [selected options][].
- `<textarea>` elements return their value as a **string**. The value
  corresponds to their node content.

The above rules make it easy, for instance, to switch from using a single select
control to using a group of radio buttons. Or to switch from a multi select
control, to using a group of checkboxes. The resulting set of form values used
by this matcher to compare against would be the same.

[selected options]:
  https://developer.mozilla.org/en-US/docs/Web/API/HTMLSelectElement/selectedOptions
[form]: https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement
[fieldset]: https://developer.mozilla.org/en-US/docs/Web/API/HTMLFieldSetElement
[.elements]:
  https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/elements

#### Examples

```html
<form data-testid="login-form">
  <input type="text" name="username" value="jane.doe" />
  <input type="password" name="password" value="12345678" />
  <input type="checkbox" name="rememberMe" checked />
  <button type="submit">Sign in</button>
</form>
```

```javascript
expect(getByTestId('login-form')).toHaveFormValues({
  username: 'jane.doe',
  rememberMe: true,
})
```

### `toHaveStyle`

```typescript
toHaveStyle(css: string | object)
```

This allows you to check if a certain element has some specific css properties
with specific values applied. It matches only if the element has _all_ the
expected properties applied, not just some of them.

#### Examples

```html
<button
  data-testid="delete-button"
  style="display: none; background-color: red"
>
  Delete item
</button>
```

```javascript
const button = getByTestId('delete-button')

expect(button).toHaveStyle('display: none')
expect(button).toHaveStyle({display: 'none'})
expect(button).toHaveStyle(`
  background-color: red;
  display: none;
`)
expect(button).toHaveStyle({
  backgroundColor: 'red',
  display: 'none',
})
expect(button).not.toHaveStyle(`
  background-color: blue;
  display: none;
`)
expect(button).not.toHaveStyle({
  backgroundColor: 'blue',
  display: 'none',
})
```

This also works with rules that are applied to the element via a class name for
which some rules are defined in a stylesheet currently active in the document.
The usual rules of css precedence apply.

<hr />

### `toHaveTextContent`

```typescript
toHaveTextContent(text: string | RegExp, options?: {normalizeWhitespace: boolean})
```

This allows you to check whether the given element has a text content or not.

When a `string` argument is passed through, it will perform a partial
case-sensitive match to the element content.

To perform a case-insensitive match, you can use a `RegExp` with the `/i`
modifier.

If you want to match the whole content, you can use a `RegExp` to do it.

#### Examples

```html
<span data-testid="text-content">Text Content</span>
```

```javascript
const element = getByTestId('text-content')

expect(element).toHaveTextContent('Content')
expect(element).toHaveTextContent(/^Text Content$/) // to match the whole content
expect(element).toHaveTextContent(/content$/i) // to use case-insensitive match
expect(element).not.toHaveTextContent('content')
```

<hr />

### `toHaveValue`

```typescript
toHaveValue(value: string | string[] | number)
```

This allows you to check whether the given form element has the specified value.
It accepts `<input>`, `<select>` and `<textarea>` elements with the exception of
`<input type="checkbox">` and `<input type="radio">`, which can be meaningfully
matched only using [`toBeChecked`](#tobechecked) or
[`toHaveFormValues`](#tohaveformvalues).

For all other form elements, the value is matched using the same algorithm as in
[`toHaveFormValues`](#tohaveformvalues) does.

#### Examples

```html
<input type="text" value="text" data-testid="input-text" />
<input type="number" value="5" data-testid="input-number" />
<input type="text" data-testid="input-empty" />
<select data-testid="multiple" multiple data-testid="select-number">
  <option value="first">First Value</option>
  <option value="second" selected>Second Value</option>
  <option value="third" selected>Third Value</option>
</select>
```

##### Using DOM Testing Library

```javascript
const textInput = screen.getByTestId('input-text')
const numberInput = screen.getByTestId('input-number')
const emptyInput = screen.getByTestId('input-empty')
const selectInput = screen.getByTestId('select-number')

expect(textInput).toHaveValue('text')
expect(numberInput).toHaveValue(5)
expect(emptyInput).not.toHaveValue()
expect(selectInput).not.toHaveValue(['second', 'third'])
```

<hr />

### `toHaveDisplayValue`

```typescript
toHaveDisplayValue(value: string | RegExp | (string|RegExp)[])
```

This allows you to check whether the given form element has the specified
displayed value (the one the end user will see). It accepts `<input>`,
`<select>` and `<textarea>` elements with the exception of
`<input type="checkbox">` and `<input type="radio">`, which can be meaningfully
matched only using [`toBeChecked`](#tobechecked) or
[`toHaveFormValues`](#tohaveformvalues).

#### Examples

```html
<label for="input-example">First name</label>
<input type="text" id="input-example" value="Luca" />

<label for="textarea-example">Description</label>
<textarea id="textarea-example">An example description here.</textarea>

<label for="single-select-example">Fruit</label>
<select id="single-select-example">
  <option value="">Select a fruit...</option>
  <option value="banana">Banana</option>
  <option value="ananas">Ananas</option>
  <option value="avocado">Avocado</option>
</select>

<label for="mutiple-select-example">Fruits</label>
<select id="multiple-select-example" multiple>
  <option value="">Select a fruit...</option>
  <option value="banana" selected>Banana</option>
  <option value="ananas">Ananas</option>
  <option value="avocado" selected>Avocado</option>
</select>
```

##### Using DOM Testing Library

```javascript
const input = screen.getByLabelText('First name')
const textarea = screen.getByLabelText('Description')
const selectSingle = screen.getByLabelText('Fruit')
const selectMultiple = screen.getByLabelText('Fruits')

expect(input).toHaveDisplayValue('Luca')
expect(input).toHaveDisplayValue(/Luc/)
expect(textarea).toHaveDisplayValue('An example description here.')
expect(textarea).toHaveDisplayValue(/example/)
expect(selectSingle).toHaveDisplayValue('Select a fruit...')
expect(selectSingle).toHaveDisplayValue(/Select/)
expect(selectMultiple).toHaveDisplayValue([/Avocado/, 'Banana'])
```

<hr />

### `toBeChecked`

```typescript
toBeChecked()
```

This allows you to check whether the given element is checked. It accepts an
`input` of type `checkbox` or `radio` and elements with a `role` of `checkbox`,
`radio` or `switch` with a valid `aria-checked` attribute of `"true"` or
`"false"`.

#### Examples

```html
<input type="checkbox" checked data-testid="input-checkbox-checked" />
<input type="checkbox" data-testid="input-checkbox-unchecked" />
<div role="checkbox" aria-checked="true" data-testid="aria-checkbox-checked" />
<div
  role="checkbox"
  aria-checked="false"
  data-testid="aria-checkbox-unchecked"
/>

<input type="radio" checked value="foo" data-testid="input-radio-checked" />
<input type="radio" value="foo" data-testid="input-radio-unchecked" />
<div role="radio" aria-checked="true" data-testid="aria-radio-checked" />
<div role="radio" aria-checked="false" data-testid="aria-radio-unchecked" />
<div role="switch" aria-checked="true" data-testid="aria-switch-checked" />
<div role="switch" aria-checked="false" data-testid="aria-switch-unchecked" />
```

```javascript
const inputCheckboxChecked = getByTestId('input-checkbox-checked')
const inputCheckboxUnchecked = getByTestId('input-checkbox-unchecked')
const ariaCheckboxChecked = getByTestId('aria-checkbox-checked')
const ariaCheckboxUnchecked = getByTestId('aria-checkbox-unchecked')
expect(inputCheckboxChecked).toBeChecked()
expect(inputCheckboxUnchecked).not.toBeChecked()
expect(ariaCheckboxChecked).toBeChecked()
expect(ariaCheckboxUnchecked).not.toBeChecked()

const inputRadioChecked = getByTestId('input-radio-checked')
const inputRadioUnchecked = getByTestId('input-radio-unchecked')
const ariaRadioChecked = getByTestId('aria-radio-checked')
const ariaRadioUnchecked = getByTestId('aria-radio-unchecked')
expect(inputRadioChecked).toBeChecked()
expect(inputRadioUnchecked).not.toBeChecked()
expect(ariaRadioChecked).toBeChecked()
expect(ariaRadioUnchecked).not.toBeChecked()

const ariaSwitchChecked = getByTestId('aria-switch-checked')
const ariaSwitchUnchecked = getByTestId('aria-switch-unchecked')
expect(ariaSwitchChecked).toBeChecked()
expect(ariaSwitchUnchecked).not.toBeChecked()
```

<hr />

### `toBePartiallyChecked`

```typescript
toBePartiallyChecked()
```

This allows you to check whether the given element is partially checked. It
accepts an `input` of type `checkbox` and elements with a `role` of `checkbox`
with a `aria-checked="mixed"`, or `input` of type `checkbox` with
`indeterminate` set to `true`

#### Examples

```html
<input type="checkbox" aria-checked="mixed" data-testid="aria-checkbox-mixed" />
<input type="checkbox" checked data-testid="input-checkbox-checked" />
<input type="checkbox" data-testid="input-checkbox-unchecked" />
<div role="checkbox" aria-checked="true" data-testid="aria-checkbox-checked" />
<div
  role="checkbox"
  aria-checked="false"
  data-testid="aria-checkbox-unchecked"
/>
<input type="checkbox" data-testid="input-checkbox-indeterminate" />
```

```javascript
const ariaCheckboxMixed = getByTestId('aria-checkbox-mixed')
const inputCheckboxChecked = getByTestId('input-checkbox-checked')
const inputCheckboxUnchecked = getByTestId('input-checkbox-unchecked')
const ariaCheckboxChecked = getByTestId('aria-checkbox-checked')
const ariaCheckboxUnchecked = getByTestId('aria-checkbox-unchecked')
const inputCheckboxIndeterminate = getByTestId('input-checkbox-indeterminate')

expect(ariaCheckboxMixed).toBePartiallyChecked()
expect(inputCheckboxChecked).not.toBePartiallyChecked()
expect(inputCheckboxUnchecked).not.toBePartiallyChecked()
expect(ariaCheckboxChecked).not.toBePartiallyChecked()
expect(ariaCheckboxUnchecked).not.toBePartiallyChecked()

inputCheckboxIndeterminate.indeterminate = true
expect(inputCheckboxIndeterminate).toBePartiallyChecked()
```

<hr />

### `toHaveDescription`

```typescript
toHaveDescription(text: string | RegExp)
```

This allows you to check whether the given element has a description or not.

An element gets its description via the
[`aria-describedby` attribute](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-describedby_attribute).
Set this to the `id` of one or more other elements. These elements may be nested
inside, be outside, or a sibling of the passed in element.

Whitespace is normalized. Using multiple ids will
[join the referenced elements’ text content separated by a space](https://www.w3.org/TR/accname-1.1/#mapping_additional_nd_description).

When a `string` argument is passed through, it will perform a whole
case-sensitive match to the description text.

To perform a case-insensitive match, you can use a `RegExp` with the `/i`
modifier.

To perform a partial match, you can pass a `RegExp`.

#### Examples

```html
<button aria-label="Close" aria-describedby="description-close">
  X
</button>
<div id="description-close">
  Closing will discard any changes
</div>

<button>Delete</button>
```

```javascript
const closeButton = getByRole('button', {name: 'Close'})

expect(closeButton).toHaveDescription('Closing will discard any changes')
expect(closeButton).toHaveDescription(/will discard/) // to partially match
expect(closeButton).toHaveDescription(/^closing/i) // to use case-insensitive match
expect(closeButton).not.toHaveDescription('Other description')

const deleteButton = getByRole('button', {name: 'Delete'})
expect(deleteButton).not.toHaveDescription()
expect(deleteButton).toHaveDescription('') // Missing or empty description always becomes a blank string
```

## Inspiration

This library was heavily inspired by [testing-library][testing-library] being [jest-dom][jest-dom] a part of its ecosystem, and [Kent C. Dodds'][kentcdodds] guiding principles.

The intention is to make these matchers available to developers using Jasmine instead of Jest.

## Other Solutions

I'm not aware of any, if you are please do make a PR and add it here!

For extending Jasmine's matchers outside the realm of DOM testing, [Jasmine-Matchers](https://github.com/JamieMason/Jasmine-Matchers) is an option.

## Guiding Principles

> [The more your tests resemble the way your software is used, the more confidence they can give you][guiding-principle]

## Contributors

Thanks goes to these people ([emoji key][emojis])

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://kentcdodds.com"><img src="https://avatars.githubusercontent.com/u/1500684?v=3" width="100px;" alt=""/><br /><sub><b>Kent C. Dodds</b></sub></a><br /><a href="#infra-kentcdodds" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a></td>
    <td align="center"><a href="https://github.com/brrianalexis"><img src="https://avatars2.githubusercontent.com/u/51463930?v=4" width="100px;" alt=""/><br /><sub><b>Brian Alexis</b></sub></a><br /><a href="#ideas-brrianalexis" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/testing-library/jasmine-dom/commits?author=kentcdodds" title="Code">💻</a> <a href="https://github.com/testing-library/jasmine-dom/commits?author=kentcdodds" title="Documentation">📖</a> <a href="https://github.com/testing-library/jasmine-dom/commits?author=brrianalexis" title="Tests">⚠️</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors][all-contributors] specification.
Contributions of any kind are welcome!

## LICENSE

MIT

[jasmine]: https://jasmine.github.io/
[jest-dom]: https://testing-library.com/docs/ecosystem-jest-dom
[kentcdodds]: https://kentcdodds.com/
[npm]: https://www.npmjs.com/
[node]: https://nodejs.org
[testing-library]: https://testing-library.com/
[yarn]: https://yarnpkg.com

<!-- BADGES -->

[build-badge]: https://img.shields.io/github/workflow/status/testing-library/jasmine-dom/validate?logo=github&style=flat-square
[build]: https://github.com/testing-library/jasmine-dom/actions?query=workflow%3Avalidate
[coverage-badge]: https://codecov.io/gh/testing-library/jasmine-dom/branch/master/graph/badge.svg
[coverage]: https://codecov.io/gh/testing-library/jasmine-dom
[version-badge]: https://img.shields.io/npm/v/@testing-library/jasmine-dom?style=flat-square
[semantic-release-badge]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-release]: https://github.com/semantic-release/semantic-release
[package]: https://www.npmjs.com/package/@testing-library/jasmine-dom
[downloads-badge]: https://img.shields.io/npm/dm/@testing-library/jasmine-dom?style=flat-square
[npmtrends]: http://www.npmtrends.com/@testing-library/jasmine-dom
[license-badge]: https://img.shields.io/npm/l/@testing-library/jasmine-dom?style=flat-square
[license]: https://github.com/testing-library/jasmine-dom/blob/master/LICENSE
[prs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[prs]: http://makeapullrequest.com
[coc-badge]: https://img.shields.io/badge/code%20of-conduct-ff69b4.svg?style=flat-square
[coc]: https://github.com/testing-library/jasmine-dom/blob/master/other/CODE_OF_CONDUCT.md
[github-watch-badge]: https://img.shields.io/github/watchers/testing-library/jasmine-dom?style=social
[github-watch]: https://github.com/testing-library/jasmine-dom/watchers
[github-star-badge]: https://img.shields.io/github/stars/testing-library/jasmine-dom?style=social
[github-star]: https://github.com/testing-library/jasmine-dom/stargazers
[twitter]: https://twitter.com/intent/tweet?text=Check%20out%20jasmine-dom%20by%20%40brrianalexis%20https%3A%2F%2Fgithub.com%2Ftesting-library%2Fjasmine-dom%20%F0%9F%91%8D
[twitter-badge]: https://img.shields.io/twitter/url?style=social&url=https%3A%2F%2Fgithub.com%2Ftesting-library%2Fjasmine-dom
[emojis]: https://allcontributors.org/docs/en/emoji-key
[all-contributors]: https://github.com/all-contributors/all-contributors
[all-contributors-badge]: https://img.shields.io/badge/all_contributors-2-orange.svg?style=flat-square
[guiding-principle]: https://testing-library.com/docs/guiding-principles
[discord-badge]: https://img.shields.io/discord/723559267868737556.svg?color=7389D8&labelColor=6A7EC2&logo=discord&logoColor=ffffff&style=flat-square
[discord]: https://discord.gg/c6JN9fM
