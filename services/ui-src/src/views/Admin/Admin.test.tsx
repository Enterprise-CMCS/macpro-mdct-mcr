import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
// utils
import { RouterWrappedComponent } from "utils/testing/setupJest";
// views
import { Admin } from "../index";

const adminView = (
  <RouterWrappedComponent>
    <Admin />
  </RouterWrappedComponent>
);

describe("Test /admin view", () => {
  beforeEach(() => {
    render(adminView);
  });

  test("Check that /admin view renders", () => {
    expect(screen.getByTestId("admin-view")).toBeVisible();
  });

  test("Check that delete admin banner button works", () => {
    const deleteButton = screen.getByTestId("delete-admin-banner-button");
    expect(deleteButton).toBeVisible();
    /*
     * TODO: Finish this test
     * fireEvent.click(deleteButton);
     * expect(mockBannerData.deleteAdminBanner).toHaveBeenCalled();
     */
  });
});

describe("Test /admin view accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(adminView);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
