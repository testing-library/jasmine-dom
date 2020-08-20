<div align="center">
<h1>jasmine-dom</h1>

<a href="https://www.joypixels.com/profiles/emoji/sloth/_/5.0">
  <img
    height="80"
    width="80"
    alt="sloth"
    src="https://github.com/brrianalexis/jasmine-dom/blob/master/other/sloth.png?raw=true"  
  >
</a>

<p>UNPUBLISHED - Under development</p>
<p>Custom Jasmine matchers to test the state of the DOM</p>

</div>

---

[![Build Status][build-badge]][build]
[![Code Coverage][coverage-badge]][coverage]
[![version][version-badge]][package]
[![downloads][downloads-badge]][npmtrends]
[![MIT License][license-badge]][license]

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)
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

-   [Installation](#installation)
-   [Usage](#usage)
-   [Documentation](#documentation)
-   [Inspiration](#inspiration)
-   [Other Solutions](#other-solutions)
-   [Guiding Principles](#guiding-principles)
-   [Contributors](#contributors)
-   [LICENSE](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installation

This module is distributed via [npm][npm] which is bundled with [node][node] and should be installed as one of your project's `devDependencies`.

Using npm:

```
npm install --save-dev jasmine-dom
```

or for installation using [yarn][yarn] package manager:

```
yarn add --dev jasmine-dom
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

Make a new file inside that directory, import jasmine-dom and add the matchers like so:

```javascript
import JasmineDOM from 'jasmine-dom';

beforeAll(() => {
	jasmine.getEnv().addMatchers(JasmineDOM);
});
```

That's it! You're good to go.

## Documentation

This library is meant to be a Jasmine version of `@testing-library/jest-dom` library. As such, it provides the same set of matchers and the same functionality for each one.

You can find examples for each matcher on [jest-dom's docs][jest-dom-docs].

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

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors][all-contributors] specification.
Contributions of any kind are welcome!

## LICENSE

MIT

[jasmine]: https://jasmine.github.io/
[jest-dom]: https://testing-library.com/docs/ecosystem-jest-dom
[jest-dom-docs]: https://github.com/testing-library/jest-dom#custom-matchers
[kentcdodds]: https://kentcdodds.com/
[npm]: https://www.npmjs.com/
[node]: https://nodejs.org
[testing-library]: https://testing-library.com/
[yarn]: https://yarnpkg.com

<!-- BADGES -->

[build-badge]: https://travis-ci.org/testing-library/jasmine-dom.svg?branch=master
[build]: https://travis-ci.org/testing-library/jasmine-dom
[coverage-badge]: https://codecov.io/gh/testing-library/jasmine-dom/branch/master/graph/badge.svg
[coverage]: https://codecov.io/gh/testing-library/jasmine-dom
[version-badge]: https://img.shields.io/npm/v/@testing-library/jasmine-dom?style=flat-square
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
[twitter]: https://twitter.com/intent/tweet?text=Check%20out%20jest-dom%20by%20%40brrianalexis%20https%3A%2F%2Fgithub.com%2Ftesting-library%2Fjasmine-dom%20%F0%9F%91%8D
[twitter-badge]: https://img.shields.io/twitter/url?style=social&url=https%3A%2F%2Fgithub.com%2Ftesting-library%2Fjasmine-dom
[emojis]: https://allcontributors.org/docs/en/emoji-key
[all-contributors]: https://github.com/all-contributors/all-contributors
[guiding-principle]: https://testing-library.com/docs/guiding-principles
[discord-badge]: https://img.shields.io/discord/723559267868737556.svg?color=7389D8&labelColor=6A7EC2&logo=discord&logoColor=ffffff&style=flat-square
[discord]: https://discord.gg/c6JN9fM
