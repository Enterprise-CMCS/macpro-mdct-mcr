// This file is managed by macpro-mdct-core so if you'd like to change it let's do it there
/**
 * Determines whether an item is defined, *while informing Typescript*
 *
 * Useful for turning a `(string | undefined)[]` into a `string[]`
 */
export function isDefined<T>(x: T | undefined): x is T {
  return x !== undefined;
}

/**
 * Attempts to dynamically import a module that may not exist.
 * Returns the module if successful, undefined if the module doesn't exist.
 *
 * Useful for optional app-specific modules like clam.ts or prerequisites-additional.ts
 */
export async function tryImport<T>(modulePath: string): Promise<T | undefined> {
  try {
    return await import(modulePath);
  } catch {
    return undefined;
  }
}
