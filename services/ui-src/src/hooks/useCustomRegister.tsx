// Code for Generating this Dynamic Type was found online
// at this link:
// https://www.typescriptlang.org/play?ts=4.2.3#code/C4TwDgpgBAUg9gSwHYB4DSAaKAFAfFAXijSggA9gIkATAZyluACdkBzKAHyiQFcBbAEYQmUAPwBYAFBQZOUhSp0GzNp278hIidNkADACQBvNAF8jAInPzKNetjFRLUAFyOAdObOHsJ3VNku3BAAbsKBSCHCANxSsZKgkDhMIYRQANoRoUxYAAxYAIxYAExYAMxYACxYAKxYAGxYAOxYABxYAJwFef6y+YVQ+SUD5QNVA7UDDQPNA20DnVBFeVBuqzlpALobcQnQ2ACGwAAWtCgAKlgAItaK9LyCYUT5OfhEaZcbN7bpmcKfokEsoEzl8lHABAArCAAY2AYh6MkM6RIyCgAGsICA4AAzKBnDYAWlErhI5BsSkYLCQ7C49008J0ARkBmMvjU8GQ6CwB2OpzOaTQG25yWC7w2uFwCKZrl+TClJjSGKxuPxgUsO3A0AAMhB9qE+VdQXcNI8Bi9UmKjT9Ikx-oCwq4QWTblBwVDYQyAkiBVBUUqcXjCcTYIhUJgoDq9RA+QKhUkQmKJVAFf6VZ9XJYYpINYkAHLRyjUADykJhwDOmtShil+1clLYWYCAjrKmpjdkEUYrmrjKZ0JbVNY7ZkJmHruOwnzXagPaZsn7ykHY9HUhX2filanhZL7uAPJOqX3py3EGLpdhFcguCzAHob1BdlAT2fd0fUuZ9lYuOYBF-HJ3gD-cw4AnJgtyAgC3GhICQKOScCyg8wpEfZ8dzLSN9VSDDoxQVDz3LTVJUkO8H03AtTzQ2FsPoIgPyA381HMSDoMY2D4MYRC4mQSgmGxfZoWgM5kmgWdZAAGwgbFgEdYSMClFhWCOaS8VkqVqEOWtFzYVc4hIx8hIgCBqKw3V9XOYTrygEjaDgJgmBALBoTgPgwAQCSREAXg3AG6dwBsYg8wBqPakPTKwMozTOjd91OAT9GIkqS3CimLvwUpSEo0oC4uANxMrS6KvyC+9zBylKssSoCSuyyTSvSxiKoqsrYqqyr4pyhquAKxwcuKhBFOqvLGviirWpqrhVjcM1BigPhbOgMa1A68w6p61Klt6txVpW5aso2vrPxzQThOMohqPMwyymvDr9MO8KaJkcw2s6pqHsWrbcqSx6WqekaoAW7q1ueoavv65LXvq9L9qgABZEAAHEqGEBBoUvCBzitN0y1eGcpSVWhXAAQTs-YQBQI9zglLM1ykJykEYB8C1caG4YiFgkc1XDyJfMtkcx0SZBx1w0jorAmIQ6DtkkEwpCAA
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
