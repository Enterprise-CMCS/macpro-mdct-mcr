// This file is managed by macpro-mdct-core so if you'd like to change it let's do it there
/**
 * Determines whether an item is defined, *while informing Typescript*
 *
 * Useful for turning a `(string | undefined)[]` into a `string[]`
 */
export function isDefined<T>(x: T | undefined): x is T {
  return x !== undefined;
}
