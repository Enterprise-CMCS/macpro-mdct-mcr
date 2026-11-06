import { render, screen } from "@testing-library/react";
import { useWatch } from "react-hook-form";
import { ReportingPeriodLengthBanner } from "./ReportingPeriodLengthBanner";

jest.mock("react-hook-form", () => ({
  useFormContext: jest.fn(() => ({ control: {} })),
  useWatch: jest.fn(),
}));
const mockUseWatch = useWatch as jest.Mock;

const content = "This reporting period is not 12 months in length.";
const bannerComponent = (
  <ReportingPeriodLengthBanner
    startDateFieldId="startDate"
    endDateFieldId="endDate"
    content={content}
  />
);

describe("<ReportingPeriodLengthBanner />", () => {
  test("shows the banner when the period is not 12 months", () => {
    mockUseWatch.mockReturnValue(["01/01/2023", "01/01/2024"]);
    render(bannerComponent);
    expect(screen.getByRole("alert")).toHaveTextContent(content);
  });

  test.each([
    ["a 12-month period", ["01/01/2023", "12/31/2023"]],
    ["a missing end date", ["01/01/2023", undefined]],
    ["N/A dates", ["N/A", "N/A"]],
  ])("does not show the banner for %s", (_label, dates) => {
    mockUseWatch.mockReturnValue(dates);
    render(bannerComponent);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  test("watches the configured start and end date fields", () => {
    mockUseWatch.mockReturnValue([undefined, undefined]);
    render(bannerComponent);
    expect(mockUseWatch).toHaveBeenCalledWith({
      control: {},
      name: ["startDate", "endDate"],
    });
  });
});
