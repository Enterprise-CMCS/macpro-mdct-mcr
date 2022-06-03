import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
// components
import { AdminBannerForm } from "components";

jest.mock("react-hook-form", () => ({
  __esModule: true,
  ...jest.requireActual("react-hook-form"),
  useForm: () => ({
    register: () => {},
    handleSubmit: () => {},
    getValues: () => ({
      title: "mock title",
      description: "mock description",
      link: "mock link",
    }),
    formState: {
      errors: {},
    },
  }),
}));

const mockWriteAdminBanner = jest.fn(() => {});

const adminBannerFormComponent = (
  <AdminBannerForm writeAdminBanner={mockWriteAdminBanner} />
);

describe("Test AdminBannerForm component", () => {
  test("AdminBannerForm is visible", () => {
    render(adminBannerFormComponent);
    const form = screen.getByTestId("admin-banner-form");
    expect(form).toBeVisible();
  });
});

describe("Test AdminBannerForm accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(adminBannerFormComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
