import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
// components
import { TemplateCard } from "components";
// utils
import {
  mockStateUserStore,
  RouterWrappedComponent,
} from "utils/testing/setupJest";
import { useStore } from "utils";
import { testA11yAct } from "utils/testing/commonTests";
// verbiage
import verbiage from "verbiage/pages/home";

jest.mock("utils/other/useBreakpoint", () => ({
  useBreakpoint: jest.fn(() => ({
    isDesktop: true,
  })),
}));

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;

const mockUseNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
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
      await act(async () => {
        await userEvent.click(templateCardLink);
      });
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
      await act(async () => {
        await userEvent.click(templateCardLink);
      });
      const expectedRoute = mlrTemplateVerbiage.link.route;
      await expect(mockUseNavigate).toHaveBeenCalledWith(expectedRoute);
    });
  });

  describe("Test NAAAR TemplateCard", () => {
    beforeEach(() => {
      render(naaarTemplateCardComponent);
    });

    test("NAAAR TemplateCard is visible", () => {
      expect(screen.getByText(naaarTemplateVerbiage.title)).toBeVisible();
    });

    test("NAAAR TemplateCard download button is visible and clickable", async () => {
      const downloadButton = screen.getByText(
        naaarTemplateVerbiage.downloadText
      );
      expect(downloadButton).toBeVisible();
      await act(async () => {
        await userEvent.click(downloadButton);
      });
    });

    test("NAAAR TemplateCard image is visible on desktop", () => {
      const imageAltText = "Spreadsheet icon";
      expect(screen.getByAltText(imageAltText)).toBeVisible();
    });

    test("NAAAR TemplateCard link is visible on desktop", () => {
      const templateCardLink = naaarTemplateVerbiage.link.text;
      expect(screen.getByText(templateCardLink)).toBeVisible();
    });

    test("NAAAR TemplateCard navigates to next route on link click", async () => {
      mockedUseStore.mockReturnValue(mockStateUserStore);
      const templateCardLink = screen.getByText(
        naaarTemplateVerbiage.link.text
      )!;
      await act(async () => {
        await userEvent.click(templateCardLink);
      });
      const expectedRoute = naaarTemplateVerbiage.link.route;
      await expect(mockUseNavigate).toHaveBeenCalledWith(expectedRoute);
    });
  });

  testA11yAct(mcparTemplateCardComponent);
});
