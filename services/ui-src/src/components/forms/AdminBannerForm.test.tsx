import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
// components
import { AdminBannerForm } from "components";
import { bannerId } from "../../constants";
// utils
import { convertDateEtToUtc } from "utils";

const mockWriteAdminBanner = jest.fn();
const mockWriteAdminBannerWithError = jest.fn(() => {
  throw new Error();
});

const adminBannerFormComponent = (writeAdminBanner: Function) => (
  <AdminBannerForm
    writeAdminBanner={writeAdminBanner}
    data-testid="test-form"
  />
);

const fillOutForm = async (form: any) => {
  // selectors for all the required fields
  const titleInput = form.querySelector("[name='abf-title']")!;
  const descriptionInput = form.querySelector("[name='abf-description']")!;
  const startDateInput = form.querySelector("[name='abf-startDate']")!;
  const endDateInput = form.querySelector("[name='abf-endDate']")!;
  // fill out form fields
  await userEvent.type(titleInput, "this is the title text");
  await userEvent.type(descriptionInput, "this is the description text");
  await userEvent.type(startDateInput, "07/11/2021");
  await userEvent.type(endDateInput, "08/12/2021");
  await userEvent.tab();
};

describe("Test AdminBannerForm component", () => {
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
      key: bannerId,
      title: "this is the title text",
      description: "this is the description text",
      link: undefined,
      startDate: convertDateEtToUtc(
        { year: 2021, month: 7, day: 11 },
        { hour: 0, minute: 0, second: 0 }
      ),
      endDate: convertDateEtToUtc(
        { year: 2021, month: 8, day: 12 },
        { hour: 23, minute: 59, second: 59 }
      ),
    });
  });

  test("Shows error if writeBanner throws error", async () => {
    const result = render(
      adminBannerFormComponent(mockWriteAdminBannerWithError)
    );
    const form = result.container;
    await fillOutForm(form);
    const submitButton = screen.getByRole("button");
    await userEvent.click(submitButton);
    await expect(screen.getByText("Error")).toBeVisible();
  });
});

describe("Test AdminBannerForm accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(
      adminBannerFormComponent(mockWriteAdminBanner)
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
