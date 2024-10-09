jest.mock("aws-amplify/api", () => ({
  get: () => {},
  post: () => {},
  put: () => {},
  del: () => {},
}));

jest.mock("aws-amplify/auth", () => ({
  fetchAuthSession: jest.fn().mockReturnValue({
    idToken: () => ({
      payload: "eyJLongToken",
    }),
  }),
  configure: () => {},
  signOut: jest.fn().mockImplementation(() => {}),
  federatedSignIn: () => {},
}));

jest.mock("aws-amplify/utils", () => ({
  Hub: {
    listen: jest.fn(),
  },
}));

export default "test-file-stub";
