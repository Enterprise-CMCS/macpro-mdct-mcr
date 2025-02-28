import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
// components
import { AdminBannerForm } from "components";
// utils
import { convertDateTimeEtToUtc } from "utils";
import { RouterWrappedComponent } from "utils/testing/mockRouter";
import { testA11y } from "utils/testing/commonTests";

const mockWriteAdminBanner = jest.fn();
const mockWriteAdminBannerWithError = jest.fn(() => {
  throw new Error();
});

jest.mock("react-uuid", () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue("mock-key"),
}));

const adminBannerFormComponent = (writeAdminBanner: Function) => (
  <RouterWrappedComponent>
    <AdminBannerForm
      writeAdminBanner={writeAdminBanner}
      data-testid="test-form"
    />
  </RouterWrappedComponent>
);

const fillOutForm = async (form: any) => {
  // selectors for all the required fields
  const titleInput = form.querySelector("[name='bannerTitle']")!;
  const descriptionInput = form.querySelector("[name='bannerDescription']")!;
  const startDateInput = form.querySelector("[name='bannerStartDate']")!;
  const endDateInput = form.querySelector("[name='bannerEndDate']")!;
  // fill out form fields
  await userEvent.type(titleInput, "this is the title text");
  await userEvent.type(descriptionInput, "this is the description text");
  await userEvent.type(startDateInput, "7/11/2021");
  await userEvent.type(endDateInput, "8/12/2021");
  await userEvent.tab();
};

describe("<AdminBannerForm />", () => {
  test("AdminBannerForm is visible", () => {
    render(adminBannerFormComponent(mockWriteAdminBanner));
    const form = screen.getByTestId("test-form");
    expect(form).toBeVisible();
  });

  test("Form submits correctly", async () => {
    const result = render(adminBannerFormComponent(mockWriteAdminBanner));
    const form = result.container;
    await fillOutForm(form);
    const submitButton = screen.getByRole("button");
    await userEvent.click(submitButton);
    await expect(mockWriteAdminBanner).toHaveBeenCalledWith({
      key: "mock-key",
      title: "this is the title text",
      description: "this is the description text",
      link: undefined,
      startDate: convertDateTimeEtToUtc(
        { year: 2021, month: 7, day: 11 },
        { hour: 0, minute: 0, second: 0 }
      ),
      endDate: convertDateTimeEtToUtc(
        { year: 2021, month: 8, day: 12 },
        { hour: 23, minute: 59, second: 59 }
      ),
    });
  });

  test("Shows error if writeBanner throws error", async () => {
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
    const result = render(
      adminBannerFormComponent(mockWriteAdminBannerWithError)
    );
    const form = result.container;
    await fillOutForm(form);
    const submitButton = screen.getByRole("button");
    await userEvent.click(submitButton);
    expect(screen.getByText(/Something went wrong on our end/)).toBeVisible();
  });

  testA11y(adminBannerFormComponent(mockWriteAdminBanner));
});
