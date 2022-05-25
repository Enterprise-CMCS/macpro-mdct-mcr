import { render } from "@testing-library/react";
import { axe } from "jest-axe";
// utils
import { RouterWrappedComponent } from "utils/testing/setupJest";
// views
import { Profile } from "../index";

const mockStateUser = {
  user: {
    attributes: {
      "custom:cms_roles": "mdctmcr-state-user",
      "custom:cms_state": "MA",
      email: "stateuser1@test.com",
      family_name: "States",
      given_name: "Sammy",
    },
  },
  userRole: "mdctmcr-state-user",
};

jest.mock("utils/auth", () => ({
  useUser: jest.fn(() => {
    return mockStateUser;
  }),
}));

const profileView = (
  <RouterWrappedComponent>
    <Profile />
  </RouterWrappedComponent>
);

describe("Test Profile", () => {
  test("Check that Profile page renders", () => {
    const { getByTestId } = render(profileView);
    expect(getByTestId("profile")).toBeVisible();
    expect(getByTestId("statetestid")).toBeVisible();
  });
});

describe("Test Profile view accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(profileView);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
