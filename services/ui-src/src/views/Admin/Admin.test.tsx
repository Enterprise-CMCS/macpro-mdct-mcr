import { fireEvent, render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
// utils
import { RouterWrappedComponent } from "utils/testing/setupJest";
// views
import { Admin } from "../index";

const mockBannerData = {
  key: "bannerId",
  title: "Yes here I am a banner",
  description: "I have a description too",
  startDate: 1640995200000, // 1/1/2022 00:00:00 UTC
  endDate: 1672531199000, // 12/31/2022 23:59:59 UTC
  fetchAdminBanner: jest.fn(() => {}),
  writeAdminBanner: jest.fn(() => {}),
  deleteAdminBanner: jest.fn(() => {}),
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

  test("Check that delete admin banner button works", () => {
    const deleteButton = screen.getByTestId("delete-admin-banner-button");
    expect(deleteButton).toBeVisible();
    fireEvent.click(deleteButton);
    expect(mockBannerData.deleteAdminBanner).toHaveBeenCalled();
  });
});

describe("Test /admin view accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(adminView);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
