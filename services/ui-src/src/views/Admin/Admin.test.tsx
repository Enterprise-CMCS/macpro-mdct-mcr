import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
// utils
import { RouterWrappedComponent } from "utils/testing/setupJest";
// views
import { Admin } from "../index";

const mockBannerData = {
  key: "",
  title: "",
  description: "",
  startDate: 0,
  endDate: 0,
  fetchAdminBanner: () => {},
  writeAdminBanner: () => {},
  deleteAdminBanner: () => {},
};

const adminView = (
  <RouterWrappedComponent>
    <Admin adminBanner={mockBannerData} />
  </RouterWrappedComponent>
);

describe("Test /admin view", () => {
  beforeEach(() => {
    render(adminView);
  });

  test("Check that /admin view renders", () => {
    expect(screen.getByTestId("admin-view")).toBeVisible();
  });
});

describe("Test /admin view accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(adminView);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
