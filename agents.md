# MDCT agents.md file

## Project overview

- Find the MCR `README.md` [here](https://github.com/Enterprise-CMCS/macpro-mdct-mcr?tab=readme-ov-file#mdct-mcr)

## Build and test commands

- To run MCR locally, use `./run update-env && ./run local`

## Accessibility

<!-- NOTE: These accessibility rules are referenced from [this list](https://github.com/mikemai2awesome/a11y-rules/blob/main/rules.txt) -->

### References

- Use terms defined in [Design Tokens](https://designtokens.fyi/) as reference for design systems terminology
- Use WCAG 2.2 level AA as the baseline accessibility standard
- Use [WCAG 2.2 Understanding](https://www.w3.org/WAI/WCAG22/Understanding/) as reference for accessibility guidance
- Use [WAI-ARIA 1.2](https://www.w3.org/TR/wai-aria-1.2/) as reference for writing ARIA attributes
- Use [APG Gherkin](https://github.com/AFixt/apg-gherkin) as web accessibility component test cases

### CSS coding standards

- Use relative CSS units (rem, em, %, vw, vh) instead of absolute `px` units, except for border styles where `px` is acceptable
- Use CSS logical properties for all styling (e.g., `margin-inline-start` instead of `margin-left`, `block-size` instead of `height`)
- Use CSS cascade layers to organize all CSS in this order: `@layer config, resets, components, utilities`
- Use `@layer config` for CSS custom properties (variables)
- Use `@layer resets` for general CSS resets and normalizations
- Use `@layer components` for component-specific styles
- Use `@layer utilities` for utility classes and common styling patterns
- Use `c-` as the prefix for component CSS classes
- Use `u-` as the prefix for utility CSS classes
- Use `js-` as the prefix for JavaScript id and class selectors
- Use `:focus-visible` instead of `:focus` for focus state
- Don't write text in all caps. Use CSS `text-transform` instead
- Don't use Tailwind CSS

### HTML coding standards

- Use semantic HTML elements that convey meaning instead of generic elements like `<div>`, `<span>`, and `<section>` without `aria-label`
- Use semantic HTML elements before using ARIA
- Follow [Alert Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/alert/examples/alert/) for building Alert component
- Follow [Combobox with Autocomplete](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-autocomplete-both/) for building Combobox or custom select component
- Follow [Switch Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/switch/examples/switch-button/) for building Switch component
- Use HTML `<details>` and `<summary>` elements to build accordion component
- Use HTML `<dialog>` element to build modal dialog component
- Use HTML `<nav>` element and HTML `<button>` element with `aria-expanded` attribute to build global navigation with multiple levels
- Don't add redundant role attribute to landmark elements, for example, <main> instead of <main role="main">, <header> instead of <header role="banner">, <footer> instead of <footer role="contentinfo">, etc.

### Implementation priority

1. Semantic HTML structure
2. Accessible markup and ARIA attributes (only when semantic HTML is not enough)
3. CSS architecture with proper layering
4. Responsive, relative units
5. Progressive enhancement with JavaScript
6. Accessibility testing and validation

## Code style guidelines

-

## Commit guidelines

-

## Unit testing instructions

- For backend unit tests, use `cd services/app-api` to jump from the project root to the backend layer
- Run `yarn test` to kick off unit tests in the backend
- For backend code coverage, run `yarn test --coverage` in `services/app-api`
- For frontend unit tests, use `cd services/ui-src` to jump from the project root to the frontend layer
- Run `yarn test` to kick off unit tests in the frontend
- For frontend code coverage, run `yarn test --coverage` in `services/ui-src`

## End-to-end testing instructions

- From the project root, run `yarn test` to kick off Cypress end-to-end (E2E) testing suite

## Pull request instructions

- Title format: [CMDCT-{ticket_number}]: <Title> (e.g. "CMDCT-1234: Example PR")

## Common issues

- If there are errors running the app locally, run the following commands:

```
./run update-env
colima stop
./run local
```
