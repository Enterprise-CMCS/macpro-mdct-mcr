import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
// components
import { McparGetStartedPage } from "components";
// utils
import { RouterWrappedComponent } from "utils/testing/setupJest";
// verbiage
import verbiage from "verbiage/pages/mcpar/mcpar-get-started";

const mockUseNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  useNavigate: () => mockUseNavigate,
  useLocation: jest.fn(() => ({
    pathname: "/mcpar",
  })),
}));

const dashboardView = (
  <RouterWrappedComponent>
    <McparGetStartedPage />
  </RouterWrappedComponent>
);

describe("Test McparGetStartedPage", () => {
  beforeEach(() => {
    render(dashboardView);
  });

  test("Check that McparGetStartedPage renders", () => {
    expect(screen.getByText(verbiage.intro.header)).toBeVisible();
  });

  test("Page link is visible and navigates to the dashboard", async () => {
    const templateCardLink = screen.getByText(verbiage.pageLink.text)!;
    await userEvent.click(templateCardLink);
    const expectedRoute = verbiage.pageLink.route;
    await expect(mockUseNavigate).toHaveBeenCalledWith(expectedRoute);
  });
});

describe("Test McparGetStartedPage accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(dashboardView);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
