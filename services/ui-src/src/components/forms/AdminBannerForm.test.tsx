import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
// components
import { AdminBannerForm } from "components";
// utils
import { convertDateTimeEtToUtc, useStore } from "utils";
import { RouterWrappedComponent } from "utils/testing/mockRouter";
import { testA11yAct } from "utils/testing/commonTests";
import { mockBannerStore } from "utils/testing/mockZustand";
import { mockBannerData } from "utils/testing/mockBanner";

const mockWriteAdminBanner = jest.fn();
const mockWriteAdminBannerWithError = jest.fn(() => {
  throw new Error();
});

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;

const mockBannerOverlappingDates = {
  ...mockBannerData,
  startDate: 1609477200000, // 1/1/2021 00:00:00 UTC
  endDate: 1641013199000, // 12/31/2021 23:59:59 UTC
};

const emptyBannerStore = {
  ...mockBannerStore,
  allBanners: undefined,
  bannerData: undefined,
};

const mockStoreWithConflictingBanner = {
  ...mockBannerStore,
  allBanners: [mockBannerOverlappingDates],
  bannerData: mockBannerOverlappingDates,
};

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
  await act(async () => {
    await userEvent.type(titleInput, "this is the title text");
    await userEvent.type(descriptionInput, "this is the description text");
    await userEvent.type(startDateInput, "7/11/2021");
    await userEvent.type(endDateInput, "8/12/2021");
    await userEvent.tab();
  });
};

describe("<AdminBannerForm />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test("AdminBannerForm is visible", () => {
    mockedUseStore.mockReturnValue(emptyBannerStore);
    render(adminBannerFormComponent(mockWriteAdminBanner));
    const form = screen.getByTestId("test-form");
    expect(form).toBeVisible();
  });

  test("Form submits correctly", async () => {
    mockedUseStore.mockReturnValue(emptyBannerStore);
    const result = render(adminBannerFormComponent(mockWriteAdminBanner));
    const form = result.container;
    await fillOutForm(form);
    const submitButton = screen.getByRole("button");
    await act(async () => {
      await userEvent.click(submitButton);
    });
    await expect(mockWriteAdminBanner).toHaveBeenCalledWith({
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

  test("Form submits correctly with existing banners that don't overlap", async () => {
    mockedUseStore.mockReturnValue(mockBannerStore);
    const result = render(adminBannerFormComponent(mockWriteAdminBanner));
    const form = result.container;
    await fillOutForm(form);
    const submitButton = screen.getByRole("button");
    await act(async () => {
      await userEvent.click(submitButton);
    });
    await expect(mockWriteAdminBanner).toHaveBeenCalledWith({
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

  test("Form does not submit and displays error if dates overlap with existing banner", async () => {
    mockedUseStore.mockReturnValue(mockStoreWithConflictingBanner);
    const result = render(adminBannerFormComponent(mockWriteAdminBanner));
    const form = result.container;
    await fillOutForm(form);
    const submitButton = screen.getByRole("button");
    await act(async () => {
      await userEvent.click(submitButton);
    });
    await expect(mockWriteAdminBanner).not.toHaveBeenCalled();
    await waitFor(() => {
      expect(
        screen.getByText("Banners cannot have overlapping dates.")
      ).toBeVisible();
      expect(
        screen.getByText("Please adjust the new banner dates and try again.")
      ).toBeVisible();
    });
  });

  test("Shows error if writeBanner throws error", async () => {
    mockedUseStore.mockReturnValue(emptyBannerStore);
    const result = render(
      adminBannerFormComponent(mockWriteAdminBannerWithError)
    );
    const form = result.container;
    await fillOutForm(form);
    const submitButton = screen.getByRole("button");
    await act(async () => {
      await userEvent.click(submitButton);
    });
    await waitFor(() => {
      expect(screen.getByText(/Something went wrong on our end/)).toBeVisible();
    });
  });

  testA11yAct(adminBannerFormComponent(mockWriteAdminBanner));
});
