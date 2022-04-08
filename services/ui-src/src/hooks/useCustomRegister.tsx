/*
 * Code for Generating this Dynamic Type was found online
 * at this link: https://bit.ly/3uj587J
 */

// Beginning of Code Found Online
type Join<K, P> = K extends string | number
  ? P extends string | number
    ? `${K}${"" extends P ? "" : "."}${P}`
    : never
  : never;

type Prev = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, ...0[]];

type Paths<T, D extends number = 10> = [D] extends [never]
  ? never
  : T extends object
  ? {
      [K in keyof T]-?: K extends string | number
        ? `${K}` | Join<K, Paths<T[K], Prev[D]>>
        : never;
    }[keyof T]
  : "";
// End of code found online

export function useCustomRegister<T = string>() {
  return (name: T extends string ? string : Paths<T>) => ({
    name,
    key: name,
    testId: name,
  });
}
