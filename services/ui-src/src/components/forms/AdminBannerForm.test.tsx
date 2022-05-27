import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
//components
import { AdminBannerForm } from "components";

const mockWriteAdminBanner = jest.fn();
const formComponent = (
  <AdminBannerForm writeAdminBanner={mockWriteAdminBanner} />
);

describe("Test AdminBannerForm", () => {
  beforeEach(() => {
    render(formComponent);
  });

  test("AdminBannerForm is visible", () => {
    expect(screen.getByTestId("new-banner-title-field")).toBeVisible();
  });
});

describe("Test AdminBannerForm accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(formComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
