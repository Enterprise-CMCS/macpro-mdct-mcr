import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, MockedFunction, test, vi } from "vitest";
import { act } from "react-dom/test-utils";
// components
import { TemplateCard } from "components";
// utils
import {
  mockStateUserStore,
  RouterWrappedComponent,
} from "utils/testing/setupTests";
import { useStore } from "utils";
import { useFlags } from "launchdarkly-react-client-sdk";
import { testA11y } from "utils/testing/commonTests";
// verbiage
import verbiage from "verbiage/pages/home";

const mockGetSignedTemplateUrl = vi.fn();

vi.mock("utils/api/requestMethods/getTemplateUrl", () => ({
  getSignedTemplateUrl: () => mockGetSignedTemplateUrl(),
}));

vi.mock("utils/other/useBreakpoint", () => ({
  useBreakpoint: vi.fn(() => ({
    isDesktop: true,
  })),
}));

vi.mock("utils/state/useStore");
const mockedUseStore = useStore as unknown as MockedFunction<typeof useStore>;

vi.mock("launchdarkly-react-client-sdk", () => ({
  useFlags: vi.fn().mockReturnValue({ naaarReport: false }),
}));
const mockedUseFlags = useFlags as MockedFunction<typeof useFlags>;

const mockUseNavigate = vi.fn();

vi.mock("react-router-dom", async (importOriginal) => ({
  ...(await importOriginal()),
  useNavigate: () => mockUseNavigate,
}));

const mcparTemplateVerbiage = verbiage.cards.MCPAR;
const mlrTemplateVerbiage = verbiage.cards.MLR;
const naaarTemplateVerbiage = verbiage.cards.NAAAR;

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

const naaarTemplateCardComponent = (
  <RouterWrappedComponent>
    <TemplateCard templateName="NAAAR" verbiage={naaarTemplateVerbiage} />
  </RouterWrappedComponent>
);

describe("<TemplateCard />", () => {
  describe("Test MCPAR TemplateCard", () => {
    beforeEach(() => {
      render(mcparTemplateCardComponent);
    });

    test("MCPAR TemplateCard is visible", () => {
      expect(screen.getByText(mcparTemplateVerbiage.title)).toBeVisible();
    });

    test("MCPAR TemplateCard download button is visible and clickable", async () => {
      const downloadButton = screen.getByText(
        mcparTemplateVerbiage.downloadText
      );
      expect(downloadButton).toBeVisible();
      await act(async () => {
        await userEvent.click(downloadButton);
      });
      await waitFor(() =>
        expect(mockGetSignedTemplateUrl).toHaveBeenCalledTimes(1)
      );
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
      mockedUseStore.mockReturnValue(mockStateUserStore);
      const templateCardLink = screen.getByText(
        mcparTemplateVerbiage.link.text
      )!;
      await userEvent.click(templateCardLink);
      const expectedRoute = mcparTemplateVerbiage.link.route;
      await expect(mockUseNavigate).toHaveBeenCalledWith(expectedRoute);
    });
  });

  describe("Test MLR TemplateCard", () => {
    beforeEach(() => {
      render(mlrTemplateCardComponent);
    });

    test("MLR TemplateCard is visible", () => {
      expect(screen.getByText(mlrTemplateVerbiage.title)).toBeVisible();
    });

    test("MLR TemplateCard download button is visible and clickable", async () => {
      const downloadButton = screen.getByText(mlrTemplateVerbiage.downloadText);
      expect(downloadButton).toBeVisible();
      await act(async () => {
        await userEvent.click(downloadButton);
      });
      await waitFor(() => expect(mockGetSignedTemplateUrl).toHaveBeenCalled());
    });

    test("MLR TemplateCard image is visible on desktop", () => {
      const imageAltText = "Spreadsheet icon";
      expect(screen.getByAltText(imageAltText)).toBeVisible();
    });

    test("MLR TemplateCard link is visible on desktop", () => {
      const templateCardLink = mlrTemplateVerbiage.link.text;
      expect(screen.getByText(templateCardLink)).toBeVisible();
    });

    test("MLR TemplateCard navigates to next route on link click", async () => {
      mockedUseStore.mockReturnValue(mockStateUserStore);
      const templateCardLink = screen.getByText(mlrTemplateVerbiage.link.text)!;
      await userEvent.click(templateCardLink);
      const expectedRoute = mlrTemplateVerbiage.link.route;
      await expect(mockUseNavigate).toHaveBeenCalledWith(expectedRoute);
    });
  });

  describe("Test naaarReport feature flag functionality", () => {
    test("if naaarReport flag is true, NAAAR available verbiage should be visible", async () => {
      mockedUseFlags.mockReturnValueOnce({ naaarReport: true });
      render(naaarTemplateCardComponent);
      expect(
        screen.getByText(naaarTemplateVerbiage.body.available)
      ).toBeVisible();
      const enterNaaarButton = screen.getByText(
        naaarTemplateVerbiage.link.text
      );
      expect(enterNaaarButton).toBeVisible();
    });

    test("if naaarReport flag is false, NAAAR available verbiage should not be visible", async () => {
      render(naaarTemplateCardComponent);
      expect(
        screen.queryByText(naaarTemplateVerbiage.link.text)
      ).not.toBeInTheDocument();
    });
  });

  testA11y(mcparTemplateCardComponent);
});
