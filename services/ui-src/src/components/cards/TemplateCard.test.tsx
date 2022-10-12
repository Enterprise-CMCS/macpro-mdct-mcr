import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { act } from "react-dom/test-utils";
// components
import { TemplateCard } from "components";
// utils
import { RouterWrappedComponent } from "utils/testing/setupJest";
// verbiage
import verbiage from "verbiage/pages/home";

const mockAPI = require("utils/api/requestMethods/getTemplateUrl");

jest.mock("utils/other/useBreakpoint", () => ({
  useBreakpoint: jest.fn(() => ({
    isDesktop: true,
  })),
}));

const mockUseNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  useNavigate: () => mockUseNavigate,
  useLocation: jest.fn(() => ({
    pathname: "mcpar/get-started",
  })),
}));

const templateVerbiage = verbiage.cards.MCPAR;

const templateCardComponent = (
  <RouterWrappedComponent>
    <TemplateCard templateName="testTemplate" verbiage={templateVerbiage} />
  </RouterWrappedComponent>
);

describe("Test TemplateCard", () => {
  beforeEach(() => {
    render(templateCardComponent);
  });

  test("TemplateCard is visible", () => {
    expect(screen.getByText(templateVerbiage.title)).toBeVisible();
  });

  test("TemplateCard download button is visible and clickable", async () => {
    const apiSpy = jest.spyOn(mockAPI, "getSignedTemplateUrl");
    const downloadButton = screen.getByText(templateVerbiage.downloadText);
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
    const templateCardLink = templateVerbiage.link.text;
    expect(screen.getByText(templateCardLink)).toBeVisible();
  });

  test("TemplateCard navigates to next route on link click", async () => {
    const templateCardLink = screen.getByText(templateVerbiage.link.text)!;
    await userEvent.click(templateCardLink);
    const expectedRoute = templateVerbiage.link.route;
    await expect(mockUseNavigate).toHaveBeenCalledWith(expectedRoute);
  });
});

describe("Test TemplateCard accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(templateCardComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
