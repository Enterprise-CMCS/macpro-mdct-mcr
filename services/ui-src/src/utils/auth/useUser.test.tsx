import { useUser } from "./useUser";

jest.mock("react", () => ({
  useContext: jest
    .fn()
    .mockReturnValueOnce(true)
    .mockReturnValueOnce(undefined),
  createContext: jest.fn().mockReturnValue({
    logout: async () => {},
    loginWithIDM: () => {},
  }),
}));

describe("Test useUser", () => {
  test("test useUser is truthy when context exists", () => {
    expect(useUser()).toBeTruthy;
  });
  test("test useUser throws when context is undefined", () => {
    expect(() => useUser()).toThrow(
      "`useUser` hook must be used within a `UserProvider` component"
    );
  });
});
