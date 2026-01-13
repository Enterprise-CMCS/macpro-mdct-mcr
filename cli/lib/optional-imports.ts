// This file is managed by macpro-mdct-core so if you'd like to change it let's do it there

/**
 * Attempts to dynamically import a module that may not exist.
 * Returns the module if successful, undefined if the module doesn't exist.
 *
 * Useful for optional app-specific modules like clam.ts
 */
export async function tryImport<T>(modulePath: string): Promise<T | undefined> {
  try {
    return await import(modulePath);
  } catch {
    return undefined;
  }
}
