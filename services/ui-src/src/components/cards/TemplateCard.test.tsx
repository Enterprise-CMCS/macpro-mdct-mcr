import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { act } from "react-dom/test-utils";
//components
import { TemplateCard } from "components";
import verbiage from "verbiage/pages/home";
import { RouterWrappedComponent } from "utils/testing/setupJest";

const mockAPI = require("utils/api/requestMethods/getTemplateUrl");

jest.mock("utils/other/useBreakpoint", () => ({
  useBreakpoint: jest.fn(() => ({
    isDesktop: true,
  })),
  makeMediaQueryClasses: jest.fn(() => "desktop"),
}));

const templateVerbiage = verbiage.cards.MCPAR;

const templateCardComponent = (
  <RouterWrappedComponent>
    <TemplateCard
      templateName="testTemplate"
      verbiage={templateVerbiage}
      data-testid="template-download-card"
    />
  </RouterWrappedComponent>
);

describe("Test TemplateCard", () => {
  beforeEach(() => {
    render(templateCardComponent);
  });

  test("TemplateCard is visible", () => {
    expect(screen.getByTestId("template-download-card")).toBeVisible();
  });

  test("TemplateCard download button is visible and clickable", async () => {
    const apiSpy = jest.spyOn(mockAPI, "getSignedTemplateUrl");
    const downloadButton = screen.getByText("Download MCPAR Excel Workbook");
    expect(downloadButton).toBeVisible();
    await act(async () => {
      await userEvent.click(downloadButton);
    });
    await waitFor(() => expect(apiSpy).toHaveBeenCalledTimes(1));
  });

  test("TemplateCard image is visible on desktop", () => {
    const imageAltText = "Spreadsheet icon";
    expect(screen.getByAltText(imageAltText)).toBeVisible();
  });

  test("TemplateCard link is visible on desktop", () => {
    const templateCardLink = "Enter MCPAR online";
    expect(screen.getByText(templateCardLink)).toBeVisible();
  });
});

describe("Test TemplateCard accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(templateCardComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
