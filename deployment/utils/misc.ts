/**
 * Determines whether an item is defined, *while informing Typescript*
 *
 * Useful for turning a `(string | undefined)[]` into a `string[]`
 */
export function isDefined<T>(x: T | undefined): x is T {
  return x !== undefined;
}
