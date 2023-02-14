import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { act } from "react-dom/test-utils";
// components
import { TemplateCard } from "components";
// utils
import { mockLDFlags, RouterWrappedComponent } from "utils/testing/setupJest";
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
}));

const mcparTemplateVerbiage = verbiage.cards.MCPAR;
const mlrTemplateVerbiage = verbiage.cards.MLR;

const mcparTemplateCardComponent = (
  <RouterWrappedComponent>
    <TemplateCard templateName="MCPAR" verbiage={mcparTemplateVerbiage} />
  </RouterWrappedComponent>
);

const mlrTemplateCardComponent = (
  <RouterWrappedComponent>
    <TemplateCard templateName="MLR" verbiage={mlrTemplateVerbiage} />
  </RouterWrappedComponent>
);

mockLDFlags.setDefault({ mlrReport: true });

describe("Test MCPAR TemplateCard", () => {
  beforeEach(() => {
    render(mcparTemplateCardComponent);
  });

  test("MCPAR TemplateCard is visible", () => {
    expect(screen.getByText(mcparTemplateVerbiage.title)).toBeVisible();
  });

  test("MCPAR TemplateCard download button is visible and clickable", async () => {
    const apiSpy = jest.spyOn(mockAPI, "getSignedTemplateUrl");
    const downloadButton = screen.getByText(mcparTemplateVerbiage.downloadText);
    expect(downloadButton).toBeVisible();
    await act(async () => {
      await userEvent.click(downloadButton);
    });
    await waitFor(() => expect(apiSpy).toHaveBeenCalledTimes(1));
  });

  test("MCPAR TemplateCard image is visible on desktop", () => {
    const imageAltText = "Spreadsheet icon";
    expect(screen.getByAltText(imageAltText)).toBeVisible();
  });

  test("MCPAR TemplateCard link is visible on desktop", () => {
    const templateCardLink = mcparTemplateVerbiage.link.text;
    expect(screen.getByText(templateCardLink)).toBeVisible();
  });

  test("MCPAR TemplateCard navigates to next route on link click", async () => {
    const templateCardLink = screen.getByText(mcparTemplateVerbiage.link.text)!;
    await userEvent.click(templateCardLink);
    const expectedRoute = mcparTemplateVerbiage.link.route;
    await expect(mockUseNavigate).toHaveBeenCalledWith(expectedRoute);
  });
});

describe("Test mlrReport feature flag functionality", () => {
  test("if mlrReport flag is true, MLR available verbiage should be visible", async () => {
    mockLDFlags.set({ mlrReport: true });
    render(mlrTemplateCardComponent);
    expect(screen.getByText(mlrTemplateVerbiage.body.available)).toBeVisible();
    const enterMlrButton = screen.getByText(mlrTemplateVerbiage.link.text);
    expect(enterMlrButton).toBeVisible();
  });

  test("if mlrReport flag is false, MLR available verbiage should not be visible", async () => {
    mockLDFlags.set({ mlrReport: false });
    render(mlrTemplateCardComponent);
    expect(
      screen.queryByText(mlrTemplateVerbiage.link.text)
    ).not.toBeInTheDocument();
  });
});

describe("Test TemplateCard accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(mcparTemplateCardComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
