import { render } from "@testing-library/react";
import { axe } from "jest-axe";
// views
import { Profile } from "../index";

const profileView = <Profile />;

describe("Test Profile", () => {
  test("Check that Profile page renders", () => {
    const { getByTestId } = render(profileView);
    expect(getByTestId("profile")).toBeVisible();
  });
});

describe("Test Profile view accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(profileView);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
