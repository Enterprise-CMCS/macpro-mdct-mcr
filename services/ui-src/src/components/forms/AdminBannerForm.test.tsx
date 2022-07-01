import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
// components
import { AdminBannerForm } from "components";
import { bannerId } from "utils/constants/constants";
import { convertDateEtToUtc } from "utils/time/time";

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
  const titleInput = form.querySelector("[name='titleText']")!;
  const descriptionInput = form.querySelector("[name='descriptionText']")!;
  const startDateMonthInput = form.querySelector("[name='startDateMonth']")!;
  const startDateDayInput = form.querySelector("[name='startDateDay']")!;
  const startDateYearInput = form.querySelector("[name='startDateYear']")!;
  const endDateMonthInput = form.querySelector("[name='endDateMonth']")!;
  const endDateDayInput = form.querySelector("[name='endDateDay']")!;
  const endDateYearInput = form.querySelector("[name='endDateYear']")!;
  // fill out form fields
  await userEvent.type(titleInput, "this is the title text");
  await userEvent.type(descriptionInput, "this is the description text");
  await userEvent.type(startDateMonthInput, "1");
  await userEvent.type(startDateDayInput, "1");
  await userEvent.type(startDateYearInput, "2022");
  await userEvent.type(endDateMonthInput, "2");
  await userEvent.type(endDateDayInput, "2");
  await userEvent.type(endDateYearInput, "2022");
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
      titleText: "this is the title text",
      descriptionText: "this is the description text",
      link: undefined,
      startDate: convertDateEtToUtc(
        { year: 2022, month: 1, day: 1 },
        { hour: 0, minute: 0, second: 0 }
      ),
      endDate: convertDateEtToUtc(
        { year: 2022, month: 2, day: 2 },
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
